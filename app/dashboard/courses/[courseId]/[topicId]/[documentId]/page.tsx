"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, ChevronRight, Lock } from 'lucide-react';
import Quiz from '@/components/Quiz';
import { userProgress } from '../page'; // Import userProgress from the topic page

// TypeScript interfaces
interface Document {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  preview: string;
  downloadUrl: string;
  pdfUrl: string;
  uploadDate: string;
  unitNumber: number;
  content: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  documents: Document[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizData {
  [documentId: string]: QuizQuestion[];
}

// Sample quiz questions for each unit
const quizQuestions: QuizData = {
  'thermo-1': [
    {
      id: 1,
      question: "What is the First Law of Thermodynamics?",
      options: [
        "Energy cannot be created or destroyed, only transferred or converted",
        "Heat flows from hot to cold bodies",
        "Entropy of an isolated system always increases",
        "Work equals force times distance"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Which of the following is a state function?",
      options: [
        "Heat",
        "Work",
        "Internal Energy",
        "Power"
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "What is the SI unit of temperature?",
      options: [
        "Fahrenheit",
        "Celsius",
        "Kelvin",
        "Rankine"
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "What does the Second Law of Thermodynamics state?",
      options: [
        "Energy is conserved",
        "Entropy of an isolated system always increases",
        "Heat flows from cold to hot bodies",
        "Temperature is constant in phase changes"
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "Which cycle is used in refrigerators?",
      options: [
        "Otto cycle",
        "Diesel cycle",
        "Carnot cycle",
        "Vapor-compression cycle"
      ],
      correctAnswer: 3
    }
  ],
  'thermo-2': [
    {
      id: 1,
      question: "What is conduction?",
      options: [
        "Heat transfer through fluid motion",
        "Heat transfer through electromagnetic waves",
        "Heat transfer through direct contact",
        "Heat transfer through phase changes"
      ],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "Which material has the highest thermal conductivity?",
      options: [
        "Wood",
        "Silver",
        "Glass",
        "Plastic"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "What is the formula for heat transfer by conduction?",
      options: [
        "Q = mcΔT",
        "Q = hA(Ts - T∞)",
        "Q = -kA(dT/dx)",
        "Q = εσAT⁴"
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "What is convection?",
      options: [
        "Heat transfer through direct contact",
        "Heat transfer through fluid motion",
        "Heat transfer through electromagnetic waves",
        "Heat transfer through phase changes"
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "What is radiation?",
      options: [
        "Heat transfer through direct contact",
        "Heat transfer through fluid motion",
        "Heat transfer through electromagnetic waves",
        "Heat transfer through phase changes"
      ],
      correctAnswer: 2
    }
  ],
  // Add more quizzes for other documents as needed
};

// Enhanced sample document data with unit numbers and content
const topicsData: { [key: string]: { [key: string]: Topic } } = {
  'mech-eng': {
    'thermodynamics': {
      id: 'thermodynamics',
      title: 'Thermodynamics',
      description: 'Study of heat, work, and energy systems',
      icon: '🔥',
      documents: [
        {
          id: 'thermo-1',
          title: 'Unit 1: Introduction to Thermodynamics',
          description: 'Basic principles and laws of thermodynamics',
          fileType: 'PDF',
          fileSize: '2.4 MB',
          preview: '/images/PYTHON.jpeg',
          downloadUrl: '#',
          pdfUrl: '#',
          uploadDate: '2025-02-15',
          unitNumber: 1,
          content: `# Introduction to Thermodynamics

## Basic Concepts

Thermodynamics is the branch of physics that deals with heat, work, and temperature, and their relation to energy, radiation, and physical properties of matter. The behavior of these quantities is governed by the four laws of thermodynamics which define fundamental physical quantities that characterize thermodynamic systems.

## The First Law of Thermodynamics

The First Law of Thermodynamics states that energy cannot be created or destroyed in an isolated system. It can only be transformed from one form to another or transferred from one object to another.

Mathematically, it can be expressed as:
ΔU = Q - W

Where:
- ΔU is the change in internal energy
- Q is the heat added to the system
- W is the work done by the system

## The Second Law of Thermodynamics

The Second Law of Thermodynamics states that the entropy of an isolated system always increases over time. It explains why certain processes occur spontaneously while their time reversals do not.

## The Third Law of Thermodynamics

The Third Law of Thermodynamics states that as the temperature approaches absolute zero, the entropy of a system approaches a constant minimum.

## Applications of Thermodynamics

Thermodynamics has numerous applications in various fields:
- Power generation
- Refrigeration and air conditioning
- Chemical reactions
- Material science
- Environmental science

Understanding thermodynamics is crucial for designing efficient energy systems and addressing global challenges like climate change.`
        },
        {
          id: 'thermo-2',
          title: 'Unit 2: Heat Transfer Fundamentals',
          description: 'Comprehensive guide to heat transfer mechanisms',
          fileType: 'PDF',
          fileSize: '3.1 MB',
          preview: '/images/CS.png',
          downloadUrl: '#',
          pdfUrl: '#',
          uploadDate: '2025-02-20',
          unitNumber: 2,
          content: `# Heat Transfer Fundamentals

## Introduction to Heat Transfer

Heat transfer is the discipline of thermal engineering that concerns the generation, use, conversion, and exchange of thermal energy and heat between physical systems. Heat transfer is classified into various mechanisms, such as thermal conduction, thermal convection, thermal radiation, and transfer of energy by phase changes.

## Conduction

Conduction is the transfer of heat through direct contact between particles of matter, without bulk motion of the matter. In solids, it's due to the combination of vibrations of molecules and the movement of free electrons.

The rate of heat transfer by conduction is given by Fourier's Law:
q = -k∇T

Where:
- q is the heat flux
- k is the thermal conductivity
- ∇T is the temperature gradient

## Convection

Convection is the transfer of heat by the movement of fluids (liquids or gases). It can be forced (when the fluid is forced to flow by external means) or natural (when the fluid motion is caused by buoyancy forces).

The rate of heat transfer by convection is given by Newton's Law of Cooling:
q = h(Ts - T∞)

Where:
- q is the heat flux
- h is the convection heat transfer coefficient
- Ts is the surface temperature
- T∞ is the fluid temperature

## Radiation

Radiation is the transfer of heat through electromagnetic waves. All objects emit thermal radiation, with the amount depending on their temperature and surface properties.

The rate of heat transfer by radiation is given by the Stefan-Boltzmann Law:
q = εσ(T₁⁴ - T₂⁴)

Where:
- q is the heat flux
- ε is the emissivity
- σ is the Stefan-Boltzmann constant
- T₁ and T₂ are the temperatures of the objects

## Applications of Heat Transfer

Heat transfer principles are applied in various fields:
- HVAC systems
- Power plants
- Electronic cooling
- Building insulation
- Food processing`
        },
        {
          id: 'thermo-3',
          title: 'Unit 3: Thermodynamic Cycles',
          description: 'Analysis of common thermodynamic cycles',
          fileType: 'PDF',
          fileSize: '1.8 MB',
          preview: '/images/JAVA.jpeg',
          downloadUrl: '#',
          pdfUrl: '#',
          uploadDate: '2025-03-05',
          unitNumber: 3,
          content: `# Thermodynamic Cycles

## Introduction to Thermodynamic Cycles

A thermodynamic cycle is a series of thermodynamic processes that returns a system to its initial state. Cycles are used in heat engines, heat pumps, and refrigeration systems.

## Carnot Cycle

The Carnot cycle is a theoretical thermodynamic cycle proposed by Nicolas Léonard Sadi Carnot. It provides an upper limit on the efficiency that any classical thermodynamic engine can achieve during the conversion of heat into work.

The efficiency of a Carnot cycle is given by:
η = 1 - Tc/Th

Where:
- η is the efficiency
- Tc is the cold reservoir temperature
- Th is the hot reservoir temperature

## Rankine Cycle

The Rankine cycle is a model used to predict the performance of steam turbine systems. It's the ideal cycle for vapor power plants.

## Otto Cycle

The Otto cycle is the ideal cycle for spark-ignition internal combustion engines. It consists of isentropic compression, heat addition at constant volume, isentropic expansion, and heat rejection at constant volume.

## Diesel Cycle

The Diesel cycle is the ideal cycle for compression-ignition internal combustion engines. It differs from the Otto cycle in that the heat addition occurs at constant pressure rather than constant volume.

## Brayton Cycle

The Brayton cycle is the ideal cycle for gas turbine engines. It consists of isentropic compression, heat addition at constant pressure, isentropic expansion, and heat rejection at constant pressure.

## Applications of Thermodynamic Cycles

Understanding thermodynamic cycles is crucial for:
- Power plant design
- Engine efficiency improvement
- Refrigeration and air conditioning systems
- Heat pump optimization`
        }
      ]
    }
  }
};

// This is the main component for the document page
export default function DocumentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const topicId = params.topicId as string;
  const documentId = params.documentId as string;
  
  const [document, setDocument] = useState<Document | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [nextDocument, setNextDocument] = useState<Document | null>(null);
  const [isNextDocumentLocked, setIsNextDocumentLocked] = useState<boolean>(true);
  const [completedUnits, setCompletedUnits] = useState<string[]>(userProgress[courseId]?.[topicId]?.completedUnits || []);

  const handleQuizComplete = (passed: boolean) => {
    if (passed) {
      // Update user progress
      const newCompletedUnits = [...completedUnits];
      if (!newCompletedUnits.includes(documentId)) {
        newCompletedUnits.push(documentId);
      }
      setCompletedUnits(newCompletedUnits);
      
      // In a real app, you would save this to a database
      if (userProgress[courseId]?.[topicId]) {
        userProgress[courseId][topicId].completedUnits = newCompletedUnits;
        
        // Log the updated progress (for testing purposes)
        console.log("Updated user progress:", userProgress);
      }
      
      // Unlock next document
      setIsNextDocumentLocked(false);
    }
    
    // Hide quiz after completion
    setShowQuiz(false);
  };

  useEffect(() => {
    // Fetch document data
    const fetchDocument = async () => {
      setLoading(true);
      try {
        // Simulate API fetch with a timeout
        setTimeout(() => {
          if (courseId && topicId && documentId && topicsData[courseId]?.[topicId]) {
            const topic = topicsData[courseId][topicId];
            setTopic(topic);
            
            // Find the current document
            const docIndex = topic.documents.findIndex(doc => doc.id === documentId);
            if (docIndex !== -1) {
              const doc = topic.documents[docIndex];
              setDocument(doc);
              
              // Check if there's a next document
              if (docIndex < topic.documents.length - 1) {
                const nextDoc = topic.documents[docIndex + 1];
                setNextDocument(nextDoc);
                
                // Check if the next document is locked
                if (userProgress[courseId]?.[topicId]) {
                  const completedUnits = userProgress[courseId][topicId].completedUnits;
                  setCompletedUnits(completedUnits);
                  
                  // Next document is locked if current document is not in completed units
                  setIsNextDocumentLocked(!completedUnits.includes(documentId));
                }
              } else {
                setNextDocument(null);
              }
              
              setError(null);
            } else {
              setError('Document not found');
            }
          } else {
            setError('Document not found');
          }
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError('Failed to load document');
        setLoading(false);
      }
    };

    fetchDocument();
  }, [courseId, topicId, documentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !document || !topic) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-slate-600 mb-6">{error || 'Document not found'}</p>
          <Link href={`/dashboard/courses/${courseId}/${topicId}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2" size={16} />
            Back to Topic
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb navigation */}
        <div className="flex flex-wrap items-center text-sm text-slate-500 mb-6">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <span className="mx-2">›</span>
          <Link href={`/dashboard/courses/${courseId}`} className="hover:text-blue-600">
            {courseId === 'mech-eng' ? 'Mechanical Engineering' : courseId}
          </Link>
          <span className="mx-2">›</span>
          <Link href={`/dashboard/courses/${courseId}/${topicId}`} className="hover:text-blue-600">
            {topic.title}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-slate-800">{document.title}</span>
        </div>

        {/* Document header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-start">
            <div className="text-4xl mr-4">📄</div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{document.title}</h1>
              <p className="text-slate-500 mt-1">{document.description}</p>
              <div className="flex items-center mt-3 text-sm text-slate-400">
                <FileText size={16} className="mr-1" />
                <span>{document.fileType} • {document.fileSize}</span>
                <span className="mx-2">•</span>
                <span>Uploaded on {new Date(document.uploadDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document content */}
        {!showQuiz ? (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="prose max-w-none">
                {document.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl font-bold mb-6">{paragraph.substring(2)}</h1>;
                  } else if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-semibold mt-8 mb-4">{paragraph.substring(3)}</h2>;
                  } else if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={index} className="list-disc pl-5 my-4">
                        {paragraph.split('\n').map((item, i) => (
                          <li key={i} className="mb-2">{item.substring(2)}</li>
                        ))}
                      </ul>
                    );
                  } else {
                    return <p key={index} className="mb-4">{paragraph}</p>;
                  }
                })}
              </div>
            </div>

            {/* Quiz button */}
            <div className="bg-blue-50 rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-blue-800">Ready to test your knowledge?</h3>
                  <p className="text-blue-600 mt-1">
                    Complete the quiz to unlock the next unit.
                  </p>
                </div>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Take Quiz
                </button>
              </div>
            </div>
          </>
        ) : (
          // Quiz component
          <Quiz
            unitTitle={document.title}
            questions={quizQuestions[documentId] || []}
            onComplete={handleQuizComplete}
            passingScore={70}
          />
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <Link 
            href={`/dashboard/courses/${courseId}/${topicId}`}
            className="inline-flex items-center px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Topic
          </Link>
          
          {nextDocument && (
            <div>
              {isNextDocumentLocked ? (
                <div className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed">
                  <Lock size={16} className="mr-2" />
                  Next Unit (Locked)
                </div>
              ) : (
                <Link 
                  href={`/dashboard/courses/${courseId}/${topicId}/${nextDocument.id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next Unit
                  <ChevronRight size={16} className="ml-2" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
