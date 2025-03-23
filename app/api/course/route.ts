import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../(lib)/mongodb";
import Course from "../(model)/Course";
import { uploadToCloudinary } from "../(lib)/cloudinary";
import axios from "axios";
import { PdfReader } from "pdfreader";

const API_KEY = "AIzaSyCIFxqaCGYGBy3YJZFKMKVgMguOMBIX1k0"; // Replace with your actual API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// Helper function to extract text from PDF
const extractTextFromPDF = async (pdfBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    let extractedText = "";
    new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
      if (err) {
        reject(`Error reading PDF: ${err}`);
      } else if (!item) {
        resolve(extractedText.trim());
      } else if (item.text) {
        extractedText += item.text + " ";
      }
    });
  });
};

// Helper function to generate quiz using Gemini API
const generateQuiz = async (text: string): Promise<any> => {
  try {
    const maxLength = 90000; // Split text into chunks to avoid API limits
    const textChunks = [];
    for (let i = 0; i < text.length; i += maxLength) {
      textChunks.push(text.slice(i, i + maxLength));
    }

    const quizResponses = await Promise.all(
      textChunks.map(async (chunk) => {
        const response = await axios.post(API_URL, {
          contents: [{ parts: [{ text: chunk }] }],
        });
        return response.data;
      })
    );

    const combinedQuizText = quizResponses
      .map((result) => result?.candidates?.[0]?.content?.parts?.[0]?.text || "")
      .join(" ");

    return combinedQuizText;
  } catch (error: any) {
    console.error("Failed to generate quiz:", error);
    // Fallback to a default quiz if the API fails
    return JSON.stringify({
      quiz: [
        {
          question: "What is the capital of France?",
          options: ["Berlin", "Madrid", "Paris", "Rome"],
          answer: "Paris",
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Earth", "Mars", "Jupiter", "Venus"],
          answer: "Mars",
        },
      ],
    });
  }
};

// Helper function to clean quiz data
const cleanQuizData = (quizData: string): string => {
  let cleaned = quizData;
  cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "").trim();
  const jsonStartPos = cleaned.indexOf('{');
  const jsonEndPos = cleaned.lastIndexOf('}') + 1;
  if (jsonStartPos >= 0 && jsonEndPos > jsonStartPos) {
    cleaned = cleaned.substring(jsonStartPos, jsonEndPos);
  }
  return cleaned;
};

// Helper function to parse quiz data
const parseQuizData = (quizData: string): any[] => {
  try {
    const cleanedQuizData = cleanQuizData(quizData);
    const parsedData = JSON.parse(cleanedQuizData);
    if (!parsedData || !parsedData.quiz || !Array.isArray(parsedData.quiz)) {
      return [];
    }
    const validQuizItems = parsedData.quiz.filter((item: any) => {
      return (
        item.question &&
        typeof item.question === 'string' &&
        item.options &&
        Array.isArray(item.options) &&
        item.answer &&
        typeof item.answer === 'string'
      );
    });
    return validQuizItems;
  } catch (error) {
    console.error("Error parsing quiz data:", error);
    console.error("Quiz Data:", quizData); // Log the problematic quiz data
    return []; // Return empty array if parsing fails
  }
};

// POST endpoint to create or update a course
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await req.formData();
    const year = formData.get("year") as string;
    const branch = formData.get("branch") as string;
    const subjects = JSON.parse(formData.get("subjects") as string);

    if (!year || !branch || !subjects || !Array.isArray(subjects)) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const processedSubjects = await Promise.all(
      subjects.map(async (subject: any, subjectIndex: number) => {
        if (!subject.name.trim()) {
          return null;
        }

        const notesFile = formData.get(`notes-file-${subjectIndex}`) as File | null;
        if (!notesFile) {
          return null;
        }

        const notesFileBuffer = Buffer.from(await notesFile.arrayBuffer());
        const folderPath = `engineering-notes/${year.replace(/\s+/g, '-').toLowerCase()}/${branch.replace(/\s+/g, '-').toLowerCase()}`;
        const fileName = `${subject.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;

        let notesFileUrl: string;
        try {
          notesFileUrl = await uploadToCloudinary(
            notesFileBuffer,
            folderPath,
            fileName
          );
        } catch (error) {
          console.error("Failed to upload notes:", error);
          throw new Error("Failed to upload notes");
        }

        const response = await axios.get(notesFileUrl, { responseType: "arraybuffer" });
        const pdfText = await extractTextFromPDF(Buffer.from(response.data));

        const quizData = await generateQuiz(`Generate a multiple-choice quiz from this content:\n\n${pdfText} return in json format like this {
          "quiz": [
            {
              "question": "What is the capital of France?",
              "options": ["Berlin", "Madrid", "Paris", "Rome"],
              "answer": "Paris"
            },
            {
              "question": "Which planet is known as the Red Planet?",
              "options": ["Earth", "Mars", "Jupiter", "Venus"],
              "answer": "Mars"
            }
          ]
        }
        no other things`);

        const quiz = parseQuizData(quizData);
        const publicId = `${folderPath}/${fileName}`;

        return {
          name: subject.name.trim(),
          notesFileUrl,
          publicId,
          quiz,
        };
      })
    );

    const validSubjects = processedSubjects.filter((subject) => subject !== null);

    if (validSubjects.length === 0) {
      return NextResponse.json(
        { message: "No valid subjects provided" },
        { status: 400 }
      );
    }

    const existingCourse = await Course.findOne({ year, branch });

    if (existingCourse) {
      const existingSubjectNames = existingCourse.subjects.map((s: any) => s.name);
      const newValidSubjects = validSubjects.filter(
        (subject: any) => !existingSubjectNames.includes(subject.name)
      );

      if (newValidSubjects.length === 0) {
        return NextResponse.json(
          {
            message: "All subjects already exist for this course!",
            course: existingCourse,
          },
          { status: 200 }
        );
      }

      existingCourse.subjects = [...existingCourse.subjects, ...newValidSubjects];
      await existingCourse.save();

      return NextResponse.json(
        {
          message: "Subjects added to existing course!",
          course: existingCourse,
        },
        { status: 200 }
      );
    } else {
      const newCourse = new Course({
        year,
        branch,
        subjects: validSubjects,
      });

      const savedCourse = await newCourse.save();

      return NextResponse.json(
        {
          message: "Course added successfully!",
          course: savedCourse,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error saving course:", error);
    return NextResponse.json(
      {
        message: "Error saving course",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch courses or quizzes
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const year = url.searchParams.get("year");
    const branch = url.searchParams.get("branch");
    const subjectName = url.searchParams.get("subject");
    const quizOnly = url.searchParams.get("quizOnly") === "true";

    const query: any = {};
    if (year) query.year = year;
    if (branch) query.branch = branch;

    const courses = await Course.find(query);

    if (quizOnly && subjectName) {
      const quizzes = [];
      for (const course of courses) {
        const matchedSubject = course.subjects.find(
          (subject: any) => subject.name === subjectName
        );
        if (matchedSubject && matchedSubject.quiz && matchedSubject.quiz.length > 0) {
          quizzes.push({
            courseId: course._id,
            year: course.year,
            branch: course.branch,
            subjectName: matchedSubject.name,
            quiz: matchedSubject.quiz,
          });
        }
      }
      return NextResponse.json({ quizzes }, { status: 200 });
    }

    if (subjectName) {
      const filteredCourses = courses.map((course) => ({
        ...course.toObject(),
        subjects: course.subjects.filter((subject: any) => subject.name === subjectName),
      }));
      return NextResponse.json({ courses: filteredCourses }, { status: 200 });
    }

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      {
        message: "Error fetching courses",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}