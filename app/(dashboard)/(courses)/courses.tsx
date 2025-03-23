"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, GraduationCap, BookOpen, Library } from "lucide-react";

const engineeringYears = [
  "First Year",
  "Second Year",
  "Third Year",
  "Final Year",
];

const branches = [
  "Computer Engineering",
  "Information Technology",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
];

export default function Courses() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [subjects, setSubjects] = useState<
    { name: string; notesFileUrl: string; subjectId?: string }[]
  >([]);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string>("");
  const [quiz, setQuiz] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedYear && selectedBranch) {
      fetchSubjects(selectedYear, selectedBranch);
    }
  }, [selectedYear, selectedBranch]);

  const fetchSubjects = async (year: string, branch: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/course?year=${encodeURIComponent(
          year
        )}&branch=${encodeURIComponent(branch)}`
      );
      const data = await response.json();
      console.log("API Response:", data);

      if (data.courses && data.courses.length > 0) {
        // Get all subjects from all matching courses
        let allSubjects: {
          name: string;
          notesFileUrl: string;
          subjectId?: string;
        }[] = [];

        data.courses.forEach((course: any) => {
          if (course.subjects && Array.isArray(course.subjects)) {
            allSubjects = [...allSubjects, ...course.subjects];
          }
        });

        // Deduplicate subjects (in case there are any with the same name)
        const uniqueSubjects = Array.from(
          new Map(
            allSubjects.map((subject) => [subject.name, subject])
          ).values()
        );

        setSubjects(uniqueSubjects);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setSelectedBranch("");
    setSelectedSubject("");
    setSubjects([]);
    setSelectedPdfUrl("");
    setQuiz([]);
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    setSelectedSubject("");
    setSubjects([]);
    setSelectedPdfUrl("");
    setQuiz([]);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    const selectedSubjectData = subjects.find(
      (subject) => subject.name === value
    );
    if (selectedSubjectData) {
      setSelectedPdfUrl(selectedSubjectData.notesFileUrl);
    } else {
      setSelectedPdfUrl("");
    }
    setQuiz([]);
  };

  const handleProceed = async () => {
    try {
      setIsLoading(true);
      // Step 1: Generate quiz from the PDF
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfUrl: selectedPdfUrl }),
      });
      const data = await response.json();
      if (data.quiz) {
        const quizData = JSON.parse(data.quiz); // Parse the quiz JSON
        setQuiz(quizData);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = () => {
    // Evaluate user answers
    const score = quiz.reduce((acc, question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);

    alert(`You scored ${score} out of ${quiz.length}`);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Course Selection
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Select Year</h2>
            </div>
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your year" />
              </SelectTrigger>
              <SelectContent>
                {engineeringYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          <Card className={`p-6 ${!selectedYear ? "opacity-50" : ""}`}>
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Select Branch</h2>
            </div>
            <Select
              value={selectedBranch}
              onValueChange={handleBranchChange}
              disabled={!selectedYear}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose your branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          <Card className={`p-6 ${!selectedBranch ? "opacity-50" : ""}`}>
            <div className="flex items-center gap-3 mb-4">
              <Library className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Select Subject</h2>
            </div>
            <Select
              value={selectedSubject}
              onValueChange={handleSubjectChange}
              disabled={!selectedBranch || isLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoading ? "Loading subjects..." : "Choose your subject"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject, index) => (
                  <SelectItem
                    key={subject.subjectId || `${subject.name}-${index}`}
                    value={subject.name}
                  >
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        </div>

        {selectedSubject && (
          <Button
            className="w-full mt-8 py-6 text-lg"
            onClick={handleProceed}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Proceed to Learn & Assessment"}
            {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        )}

        {selectedPdfUrl && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Subject Notes</h2>
            <iframe
              src={selectedPdfUrl}
              width="100%"
              height="600px"
              style={{ border: "none" }}
              title="PDF Viewer"
            />
          </div>
        )}

        {quiz.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Quiz</h2>
            {quiz.map((question, index) => (
              <div key={`question-${index}`} className="mb-6">
                <h3 className="text-lg font-semibold">{question.question}</h3>
                <div className="space-y-2">
                  {question.options.map(
                    (option: string, optionIndex: number) => (
                      <div
                        key={`option-${index}-${optionIndex}`}
                        className="flex items-center"
                      >
                        <input
                          type="radio"
                          id={`question-${index}-option-${optionIndex}`}
                          name={`question-${index}`}
                          value={option}
                          onChange={() =>
                            handleAnswerChange(index.toString(), option)
                          }
                          className="mr-2"
                        />
                        <label
                          htmlFor={`question-${index}-option-${optionIndex}`}
                        >
                          {option}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
            <Button
              className="w-full mt-8 py-6 text-lg"
              onClick={handleSubmitQuiz}
            >
              Submit Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
