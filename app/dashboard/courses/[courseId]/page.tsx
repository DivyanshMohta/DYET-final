"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

// TypeScript interfaces
interface Topic {
  id: string;
  title: string;
  description: string;
  documentsCount: number;
  icon: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  topics: Topic[];
}

// Sample course data - in a real app, you'd fetch this from an API
const coursesData: { [key: string]: Course } = {
  'mech-eng': {
    id: 'mech-eng',
    title: 'Mechanical Engineering',
    description: 'Comprehensive course covering key concepts in mechanical engineering.',
    image: '/images/math.jpg',
    topics: [
      {
        id: 'thermodynamics',
        title: 'Thermodynamics',
        description: 'Study of heat, work, and energy systems',
        documentsCount: 8,
        icon: '🔥'
      },
      {
        id: 'fluid-mechanics',
        title: 'Fluid Mechanics',
        description: 'Properties and mechanisms of fluids',
        documentsCount: 6,
        icon: '💧'
      },
      {
        id: 'machine-design',
        title: 'Machine Design',
        description: 'Principles of designing mechanical systems',
        documentsCount: 5,
        icon: '⚙️'
      },
      {
        id: 'materials-science',
        title: 'Materials Science',
        description: 'Study of materials and their properties',
        documentsCount: 4,
        icon: '🧪'
      }
    ]
  },
  'cs': {
    id: 'cs',
    title: 'Computer Science',
    description: 'Explore the fundamentals of computer science and programming.',
    image: '/images/CS.png',
    topics: [
      {
        id: 'algorithms',
        title: 'Algorithms',
        description: 'Study of computational problem-solving methods',
        documentsCount: 7,
        icon: '🧮'
      },
      {
        id: 'data-structures',
        title: 'Data Structures',
        description: 'Organization and storage of data',
        documentsCount: 6,
        icon: '📊'
      },
      {
        id: 'operating-systems',
        title: 'Operating Systems',
        description: 'Software that manages computer hardware',
        documentsCount: 5,
        icon: '💻'
      },
      {
        id: 'databases',
        title: 'Databases',
        description: 'Systems for storing and retrieving data',
        documentsCount: 4,
        icon: '🗄️'
      }
    ]
  },
  'ee': {
    id: 'ee',
    title: 'Electrical Engineering',
    description: 'Study of electricity, electronics, and electromagnetism.',
    image: '/images/JAVA.jpeg',
    topics: [
      {
        id: 'circuit-analysis',
        title: 'Circuit Analysis',
        description: 'Study of electrical circuits and networks',
        documentsCount: 6,
        icon: '⚡'
      },
      {
        id: 'electromagnetics',
        title: 'Electromagnetics',
        description: 'Study of electromagnetic fields and waves',
        documentsCount: 5,
        icon: '🧲'
      },
      {
        id: 'power-systems',
        title: 'Power Systems',
        description: 'Generation, transmission, and distribution of electrical power',
        documentsCount: 4,
        icon: '🔌'
      },
      {
        id: 'control-systems',
        title: 'Control Systems',
        description: 'Analysis and design of control systems',
        documentsCount: 3,
        icon: '🎮'
      }
    ]
  },
  'civil': {
    id: 'civil',
    title: 'Civil Engineering',
    description: 'Design and construction of the physical and built environment.',
    image: '/images/CN.jpeg',
    topics: [
      {
        id: 'structural-engineering',
        title: 'Structural Engineering',
        description: 'Analysis and design of structures',
        documentsCount: 5,
        icon: '🏗️'
      },
      {
        id: 'geotechnical-engineering',
        title: 'Geotechnical Engineering',
        description: 'Study of soil and rock mechanics',
        documentsCount: 4,
        icon: '🌋'
      },
      {
        id: 'transportation-engineering',
        title: 'Transportation Engineering',
        description: 'Planning, design, and operation of transportation systems',
        documentsCount: 3,
        icon: '🚗'
      },
      {
        id: 'environmental-engineering',
        title: 'Environmental Engineering',
        description: 'Protection and improvement of environmental quality',
        documentsCount: 3,
        icon: '🌱'
      }
    ]
  }
};

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch with a timeout
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch this data from an API
        // For now, we're using the static data
        setTimeout(() => {
          const foundCourse = coursesData[courseId];
          if (foundCourse) {
            setCourse(foundCourse);
            setError(null);
          } else {
            setError('Course not found');
          }
          setLoading(false);
        }, 500);
      } catch {
        setError('Failed to load course');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-slate-600 mb-6">{error || 'Course not found'}</p>
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2" size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2" size={16} />
          Back to Dashboard
        </Link>

        {/* Course header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="h-48 bg-slate-200 relative">
            <Image 
              src={course.image} 
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <p className="mt-2 text-white/80">{course.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Topics list */}
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course.topics.map((topic) => (
            <Link 
              key={topic.id} 
              href={`/dashboard/courses/${courseId}/${topic.id}`}
              className="block"
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="text-4xl mr-4">{topic.icon}</div>
                    <div>
                      <h3 className="font-medium text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-slate-500 mt-1">{topic.description}</p>
                      <div className="mt-3 text-sm text-slate-400">
                        {topic.documentsCount} document{topic.documentsCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
