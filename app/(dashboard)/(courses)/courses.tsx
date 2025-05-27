"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2, BookOpen, FileQuestion } from "lucide-react";
import CourseSelectorGrid from "../(comp)/CourseSelectorGrid";
import NotesViewer from "../(comp)/NotesViewer";
import QuizSection from "../(comp)/QuizSection";

interface Unit {
  unitNumber: number;
  notesFileUrl: string;
  summary: string;
  quiz: { question: string; options: string[]; answer: string }[];
}

interface Subject {
  name: string;
  units: Unit[];
}

type ViewMode = "notes" | "quiz";

export default function Courses() {
  const { isLoaded, user } = useUser();
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedUnitData, setSelectedUnitData] = useState<Unit | null>(null);
  const [quiz, setQuiz] = useState<
    { question: string; options: string[]; answer: string }[]
  >([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{
    score: number;
    total: number;
  } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("notes");

  // Get user details from Clerk
  const userId = user?.id || null;
  const userName = user?.fullName || "Unknown User";

  useEffect(() => {
    if (selectedYear && selectedBranch && userId) {
      fetchSubjects(selectedYear, selectedBranch);
    }
  }, [selectedYear, selectedBranch, userId]);

  useEffect(() => {
    if (selectedUnitData && userId && viewMode === "notes") {
      logNotesAccess();
    }
  }, [selectedUnitData, userId, viewMode]);

  const fetchSubjects = async (year: string, branch: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/course?year=${encodeURIComponent(
          year
        )}&branch=${encodeURIComponent(branch)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      if (data.courses && data.courses.length > 0) {
        let allSubjects: Subject[] = [];
        data.courses.forEach((course: any) => {
          if (course.subjects && Array.isArray(course.subjects)) {
            allSubjects = [...allSubjects, ...course.subjects];
          }
        });

        // Deduplicate subjects by name
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

  const logNotesAccess = async () => {
    try {
      const response = await fetch("/api/student-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          year: selectedYear,
          branch: selectedBranch,
          subject: selectedSubject,
          unitNumber: parseInt(selectedUnit),
          activityType: "notes_access",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to log notes access");
      }
    } catch (error) {
      console.error("Error logging notes access:", error);
    }
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setSelectedBranch("");
    setSelectedSubject("");
    setSelectedUnit("");
    setSubjects([]);
    setSelectedUnitData(null);
    setQuiz([]);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setViewMode("notes");
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    setSelectedSubject("");
    setSelectedUnit("");
    setSelectedUnitData(null);
    setQuiz([]);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setViewMode("notes");
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedUnit("");
    setSelectedUnitData(null);
    setQuiz([]);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setViewMode("notes");
  };

  const handleUnitChange = (value: string) => {
    setSelectedUnit(value);
    const subject = subjects.find((s) => s.name === selectedSubject);
    const unit = subject?.units.find((u) => u.unitNumber.toString() === value);
    if (unit) {
      setSelectedUnitData(unit);
      const shuffledQuiz = unit.quiz.sort(() => 0.5 - Math.random());
      setQuiz(shuffledQuiz.slice(0, Math.min(10, shuffledQuiz.length)));
    } else {
      setSelectedUnitData(null);
      setQuiz([]);
    }
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setViewMode("notes");
  };

  const handleAnswerChange = (questionIndex: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmitQuiz = async () => {
    const score = quiz.reduce((acc, question, index) => {
      return userAnswers[index.toString()] === question.answer ? acc + 1 : acc;
    }, 0);

    try {
      const response = await fetch("/api/student-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          year: selectedYear,
          branch: selectedBranch,
          subject: selectedSubject,
          unitNumber: parseInt(selectedUnit),
          activityType: "quiz_submission",
          quizResult: {
            score,
            totalQuestions: quiz.length,
            answers: userAnswers,
          },
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to log quiz submission: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error logging quiz submission:", error);
      alert("Failed to submit quiz. Please try again.");
      return;
    }

    setQuizSubmitted(true);
    setQuizScore({ score, total: quiz.length });
  };

  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="text-blue-800 font-medium">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-600 font-medium mb-4">
            Authentication Required
          </p>
          <p className="text-gray-600">
            Please sign in to access the course materials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-900 tracking-tight">
          Learning Portal
        </h1>
        <p className="text-center text-blue-700 mb-10 max-w-2xl mx-auto">
          Select your course details below to access study materials and
          assessments
        </p>

        <CourseSelectorGrid
          selectedYear={selectedYear}
          selectedBranch={selectedBranch}
          selectedSubject={selectedSubject}
          selectedUnit={selectedUnit}
          subjects={subjects}
          isLoading={isLoading}
          onYearChange={handleYearChange}
          onBranchChange={handleBranchChange}
          onSubjectChange={handleSubjectChange}
          onUnitChange={handleUnitChange}
        />

        {selectedUnitData && (
          <div className="mt-12 space-y-8 transition-all duration-500 ease-in-out animate-fadeIn">
            {/* View Mode Toggle Buttons */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => toggleViewMode("notes")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  viewMode === "notes"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <BookOpen className="h-5 w-5" />
                Study Materials
              </button>
              <button
                onClick={() => toggleViewMode("quiz")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  viewMode === "quiz"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                disabled={quiz.length === 0}
              >
                <FileQuestion className="h-5 w-5" />
                Take Quiz
              </button>
            </div>

            {/* Conditional Content Display */}
            {viewMode === "notes" && (
              <NotesViewer unitData={selectedUnitData} />
            )}

            {viewMode === "quiz" && quiz.length > 0 && (
              <QuizSection
                quiz={quiz}
                userAnswers={userAnswers}
                onAnswerChange={handleAnswerChange}
                onSubmitQuiz={handleSubmitQuiz}
                quizSubmitted={quizSubmitted}
                quizScore={quizScore}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
