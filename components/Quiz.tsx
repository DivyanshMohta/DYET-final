"use client";

import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  unitTitle: string;
  questions: QuizQuestion[];
  onComplete: (passed: boolean, score: number) => void;
  passingScore: number;
}

const Quiz: React.FC<QuizProps> = ({ unitTitle, questions, onComplete, passingScore = 70 }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSelect = (optionIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    selectedAnswers.forEach((selectedAnswer, index) => {
      if (selectedAnswer === questions[index].correctAnswer) {
        correctCount++;
      }
    });
    return (correctCount / questions.length) * 100;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call with timeout
    setTimeout(() => {
      setShowResults(true);
      const score = calculateScore();
      const passed = score >= passingScore;
      onComplete(passed, score);
      setIsSubmitting(false);
    }, 1000);
  };

  const isQuizComplete = selectedAnswers.every(answer => answer !== -1);

  if (showResults) {
    const score = calculateScore();
    const passed = score >= passingScore;
    
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Results: {unitTitle}</h2>
        
        <div className="text-center mb-8">
          <div className={`text-5xl mb-4 ${passed ? 'text-green-500' : 'text-red-500'}`}>
            {passed ? <CheckCircle className="inline" size={64} /> : <XCircle className="inline" size={64} />}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {passed ? 'Congratulations! You passed the quiz.' : 'You did not pass the quiz.'}
          </h3>
          <p className="text-lg">
            Your score: <span className={`font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>{score.toFixed(0)}%</span>
          </p>
          <p className="text-sm text-slate-500 mt-2">
            {passed 
              ? 'You can now proceed to the next unit.' 
              : `You need at least ${passingScore}% to pass. Please review the material and try again.`}
          </p>
        </div>
        
        <div className="space-y-6">
          {questions.map((q, index) => {
            const isCorrect = selectedAnswers[index] === q.correctAnswer;
            
            return (
              <div key={q.id} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {isCorrect 
                      ? <CheckCircle className="text-green-500" size={20} /> 
                      : <XCircle className="text-red-500" size={20} />}
                  </div>
                  <div>
                    <p className="font-medium mb-2">Question {index + 1}: {q.question}</p>
                    <ul className="space-y-2">
                      {q.options.map((option, optionIndex) => (
                        <li 
                          key={optionIndex}
                          className={`pl-3 py-1 rounded ${
                            optionIndex === q.correctAnswer 
                              ? 'bg-green-100 text-green-800' 
                              : optionIndex === selectedAnswers[index]
                                ? 'bg-red-100 text-red-800'
                                : ''
                          }`}
                        >
                          {option} {optionIndex === q.correctAnswer && '✓'}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setShowResults(false);
              setSelectedAnswers(Array(questions.length).fill(-1));
              setCurrentQuestion(0);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-center mb-6">Unit Quiz: {unitTitle}</h2>
      
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-slate-500">Question {currentQuestion + 1} of {questions.length}</span>
        <span className="text-sm text-slate-500">
          {selectedAnswers.filter(a => a !== -1).length} of {questions.length} answered
        </span>
      </div>
      
      <div className="h-2 w-full bg-slate-200 rounded-full mb-6">
        <div 
          className="h-2 bg-blue-600 rounded-full" 
          style={{ width: `${(currentQuestion + 1) / questions.length * 100}%` }}
        ></div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">
          {questions[currentQuestion].question}
        </h3>
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswers[currentQuestion] === index 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  selectedAnswers[currentQuestion] === index 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-slate-300'
                }`}>
                  {selectedAnswers[currentQuestion] === index && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span>{option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-lg ${
            currentQuestion === 0 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Previous
        </button>
        
        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === -1}
            className={`px-4 py-2 rounded-lg ${
              selectedAnswers[currentQuestion] === -1 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isQuizComplete || isSubmitting}
            className={`px-6 py-2 rounded-lg ${
              !isQuizComplete || isSubmitting
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>
      
      {!isQuizComplete && currentQuestion === questions.length - 1 && (
        <p className="text-sm text-amber-600 mt-4 text-center">
          Please answer all questions before submitting the quiz.
        </p>
      )}
    </div>
  );
};

export default Quiz;
