"use client";

import React, { useEffect, useState } from "react";
import Quiz from "./Quiz";
import { useSearchParams } from "next/navigation";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const QuizPage: React.FC = ({ unitTitle, questions, onComplete, passingScore = 70 }) => {
  const searchParams = useSearchParams();
//   const pdfUrl = searchParams.get("pdfUrl"); // Get PDF URL from query params
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pdfUrl = "https://www3.nd.edu/~powers/ame.20231/notes.pdf";

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!pdfUrl) {
        setError("No PDF URL provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/generatequiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfUrl }),
        });

        console.log(quizData);
        if (!response.ok) {
          throw new Error("Failed to fetch quiz");
        }

        const data = await response.json();
        setQuizData(data.questions); // Assuming API response has `{ questions: QuizQuestion[] }`
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [pdfUrl]);

  const handleQuizComplete = (passed: boolean, score: number) => {
    alert(`Quiz completed! Score: ${score}% ${passed ? "✅ Passed!" : "❌ Failed."}`);
  };

  if (loading) return <p className="text-center text-gray-600">Loading quiz...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return <Quiz unitTitle={unitTitle} questions={quizData} onComplete={handleQuizComplete} passingScore={passingScore} />;
};

export default QuizPage;
