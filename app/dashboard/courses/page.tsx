"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

// TypeScript interfaces
interface CourseItem {
  id: string;
  title: string;
  description: string;
  image: string;
  totalDocs: number;
}

// Sample course data
const courses: CourseItem[] = [
  {
    id: "mech-eng",
    title: "Mechanical Engineering",
    description: "Comprehensive course covering key concepts in mechanical engineering.",
    image: "/images/math.jpg",
    totalDocs: 24,
  },
  {
    id: "cs",
    title: "Computer Science",
    description: "Explore the fundamentals of computer science and programming.",
    image: "/images/CS.png",
    totalDocs: 18,
  },
  {
    id: "ee",
    title: "Electrical Engineering",
    description: "Study of electricity, electronics, and electromagnetism.",
    image: "/images/JAVA.jpeg",
    totalDocs: 15,
  },
  {
    id: "civil",
    title: "Civil Engineering",
    description: "Design and construction of the physical and built environment.",
    image: "/images/CN.jpeg",
    totalDocs: 12,
  },
];

// Course card component
const CourseCard: React.FC<{ course: CourseItem }> = ({ course }) => {
  return (
    <Link href={`/dashboard/courses/${course.id}`} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
        <div className="h-40 bg-slate-200 relative">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6">
          <h3 className="font-medium text-xl text-slate-800 group-hover:text-blue-600 transition-colors">{course.title}</h3>
          <p className="text-slate-500 mt-1">{course.description}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-slate-500 text-sm">
              {course.totalDocs} document{course.totalDocs !== 1 ? "s" : ""}
            </span>
            <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2" size={16} />
          Back to Dashboard
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">All Courses</h1>
          <p className="text-slate-500 mt-2">Browse all available courses and their topics</p>
        </div>

        {/* Courses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
