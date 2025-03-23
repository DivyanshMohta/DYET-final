"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText, Download, ExternalLink } from 'lucide-react';

// TypeScript interfaces
interface Document {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  preview: string;
  downloadUrl: string;
  uploadDate: string;
  unitNumber: number;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  documents: Document[];
}

interface Course {
  id: string;
  title: string;
}

// Sample document data for each topic
const topicsData: { [key: string]: { [key: string]: Topic } } = {
  'mech-eng': {
    'thermodynamics': {
      id: 'thermodynamics',
      title: 'Thermodynamics',
      description: 'Study of heat, work, and energy systems',
      icon: '',
      documents: [
        {
          id: 'thermo-1',
          title: 'Introduction to Thermodynamics',
          description: 'Basic principles and laws of thermodynamics',
          fileType: 'PDF',
          fileSize: '2.4 MB',
          preview: '/images/PYTHON.jpeg',
          downloadUrl: '#',
          uploadDate: '2025-02-15',
          unitNumber: 1,
        },
        {
          id: 'thermo-2',
          title: 'Heat Transfer Fundamentals',
          description: 'Comprehensive guide to heat transfer mechanisms',
          fileType: 'PDF',
          fileSize: '3.1 MB',
          preview: '/images/CS.png',
          downloadUrl: '#',
          uploadDate: '2025-02-20',
          unitNumber: 2,
        },
        {
          id: 'thermo-3',
          title: 'Thermodynamic Cycles',
          description: 'Analysis of common thermodynamic cycles',
          fileType: 'PDF',
          fileSize: '1.8 MB',
          preview: '/images/JAVA.jpeg',
          downloadUrl: '#',
          uploadDate: '2025-03-05',
          unitNumber: 3,
        }
      ]
    },
    'fluid-mechanics': {
      id: 'fluid-mechanics',
      title: 'Fluid Mechanics',
      description: 'Properties and mechanisms of fluids',
      icon: '',
      documents: [
        {
          id: 'fluid-1',
          title: 'Fluid Statics and Dynamics',
          description: 'Fundamental principles of fluid behavior',
          fileType: 'PDF',
          fileSize: '2.7 MB',
          preview: '/images/DBMS.jpeg',
          downloadUrl: '#',
          uploadDate: '2025-02-10',
          unitNumber: 1,
        },
        {
          id: 'fluid-2',
          title: 'Boundary Layer Theory',
          description: 'Analysis of fluid flow near boundaries',
          fileType: 'PDF',
          fileSize: '1.9 MB',
          preview: '/images/CN.jpeg',
          downloadUrl: '#',
          uploadDate: '2025-02-25',
          unitNumber: 2,
        }
      ]
    }
  },
  'cs': {
    'algorithms': {
      id: 'algorithms',
      title: 'Algorithms',
      description: 'Study of computational problem-solving methods',
      icon: '',
      documents: [
        {
          id: 'algo-1',
          title: 'Introduction to Algorithms',
          description: 'Fundamental algorithmic concepts and analysis',
          fileType: 'PDF',
          fileSize: '3.2 MB',
          preview: '/images/CS.png',
          downloadUrl: '#',
          uploadDate: '2025-01-20',
          unitNumber: 1,
        },
        {
          id: 'algo-2',
          title: 'Sorting and Searching Algorithms',
          description: 'Comprehensive guide to common sorting and searching techniques',
          fileType: 'PDF',
          fileSize: '2.5 MB',
          preview: '/images/PYTHON.jpeg',
          downloadUrl: '#',
          uploadDate: '2025-02-05',
          unitNumber: 2,
        }
      ]
    },
    'data-structures': {
      id: 'data-structures',
      title: 'Data Structures',
      description: 'Organization and storage of data',
      icon: '',
      documents: [
        {
          id: 'ds-1',
          title: 'Arrays and Linked Lists',
          description: 'Implementation and analysis of basic data structures',
          fileType: 'PDF',
          fileSize: '1.8 MB',
          preview: '/images/JAVA.jpeg',
          downloadUrl: '#',
          uploadDate: '2025-01-15',
          unitNumber: 1,
        },
        {
          id: 'ds-2',
          title: 'Trees and Graphs',
          description: 'Advanced data structures for complex relationships',
          fileType: 'PDF',
          fileSize: '2.3 MB',
          preview: '/images/CS.png',
          downloadUrl: '#',
          uploadDate: '2025-02-10',
          unitNumber: 2,
        }
      ]
    }
  }
};

// Sample course data
const coursesData: { [key: string]: Course } = {
  'mech-eng': {
    id: 'mech-eng',
    title: 'Mechanical Engineering'
  },
  'cs': {
    id: 'cs',
    title: 'Computer Science'
  }
};

// User progress state (in a real app, this would be stored in a database)
interface UserProgressData {
  [courseId: string]: {
    [topicId: string]: {
      completedUnits: string[];
    };
  };
}

// Mock user progress data (this would come from a database in a real app)
export const userProgress: UserProgressData = {
  'mech-eng': {
    'thermodynamics': {
      completedUnits: []
    },
    'fluid-mechanics': {
      completedUnits: []
    }
  },
  'cs': {
    'algorithms': {
      completedUnits: []
    },
    'data-structures': {
      completedUnits: []
    }
  }
};

export default function TopicPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const topicId = params.topicId as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState<string>('');
  const [completedUnits, setCompletedUnits] = useState<string[]>([]);

  // Function to check if a document is accessible based on user progress
  const isDocumentAccessible = (docId: string, unitNumber: number) => {
    // First unit is always accessible
    if (unitNumber === 1) return true;
    
    // For other units, check if previous unit has been completed
    if (userProgress[courseId]?.[topicId]) {
      const completedUnits = userProgress[courseId][topicId].completedUnits;
      
      // To access unit N, unit N-1 must be completed
      if (topic) {
        const previousUnitId = topic.documents.find(doc => doc.unitNumber === unitNumber - 1)?.id;
        
        if (previousUnitId && completedUnits.includes(previousUnitId)) {
          return true;
        }
      }
    }
    
    return false;
  };

  useEffect(() => {
    // Simulate API fetch with a timeout
    const fetchTopic = async () => {
      setLoading(true);
      try {
        // Simulate API fetch with a timeout
        setTimeout(() => {
          if (courseId && topicId && topicsData[courseId] && topicsData[courseId][topicId]) {
            setTopic(topicsData[courseId][topicId]);
            setCourseTitle(coursesData[courseId].title);
            
            // Load user progress for this course and topic
            if (userProgress[courseId]?.[topicId]) {
              setCompletedUnits(userProgress[courseId][topicId].completedUnits);
            }
            
            setError(null);
          } else {
            setError('Topic not found');
          }
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching topic:", err);
        setError('Failed to load topic');
        setLoading(false);
      }
    };

    fetchTopic();
  }, [courseId, topicId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading topic documents...</p>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-slate-600 mb-6">{error || 'Topic not found'}</p>
          <Link href={`/dashboard/courses/${courseId}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2" size={16} />
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb navigation */}
        <div className="flex flex-wrap items-center text-sm text-slate-500 mb-6">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <span className="mx-2">›</span>
          <Link href={`/dashboard/courses/${courseId}`} className="hover:text-blue-600">{courseTitle}</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-800">{topic.title}</span>
        </div>

        {/* Topic header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center">
            <div className="text-4xl mr-4">{topic.icon}</div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{topic.title}</h1>
              <p className="text-slate-500 mt-1">{topic.description}</p>
            </div>
          </div>
        </div>

        {/* Documents list */}
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Documents ({topic.documents.length})</h2>

        <div className="space-y-4">
          {topic.documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:shrink-0 w-48 h-48 relative">
                  <Image
                    src={doc.preview}
                    alt={doc.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-8 w-full">
                  <div className="flex items-center">
                    <h3 className="text-xl font-semibold text-gray-800">{doc.title}</h3>
                    {completedUnits.includes(doc.id) && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-slate-500">{doc.description}</p>
                  <div className="mt-4 flex items-center text-sm text-slate-400">
                    <FileText size={16} className="mr-1" />
                    <span>{doc.fileType}</span>
                    <span className="mx-2">•</span>
                    <span>{doc.fileSize}</span>
                    <span className="mx-2">•</span>
                    <span>Uploaded on {doc.uploadDate}</span>
                  </div>
                  <div className="flex justify-end mt-4 space-x-3">
                    {isDocumentAccessible(doc.id, doc.unitNumber) ? (
                      <>
                        <Link
                          href={doc.downloadUrl}
                          className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Download size={16} className="mr-2" />
                          Download
                        </Link>
                        <Link
                          href={`/dashboard/courses/${courseId}/${topicId}/${doc.id}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink size={16} className="mr-2" />
                          View
                        </Link>
                      </>
                    ) : (
                      <p className="text-slate-500">Document not accessible</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {topic.documents.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-slate-500">No documents available for this topic yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
