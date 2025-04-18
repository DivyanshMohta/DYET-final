"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface StudentActivity {
  _id: string;
  userId: string;
  userName: string;
  year: string;
  branch: string;
  subject: string;
  unitNumber: number;
  activityType: "notes_access" | "quiz_submission";
  quizResult?: {
    score: number;
    totalQuestions: number;
    answers: { [key: string]: string };
  };
  timestamp: string;
}

export default function StudentDashboard() {
  const { isLoaded, user } = useUser();
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get userId from Clerk
  const userId = user?.id || null;

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/student-activity?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        const data = await response.json();
        if (data.activities) {
          setActivities(data.activities);
        } else {
          setError("No activities found.");
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
        setError("Failed to load activities.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded && userId) {
      fetchActivities();
    } else if (isLoaded && !userId) {
      setError("Please sign in to view your activity.");
      setIsLoading(false);
    }
  }, [isLoaded, userId]);

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard/courses"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Courses
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">
          My Activity Dashboard
        </h1>
        <Card className="p-6 bg-white shadow-md rounded-xl">
          {activities.length === 0 ? (
            <p className="text-center text-gray-600">
              No activities recorded yet. Start exploring courses!
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Year</th>
                  <th className="py-2">Branch</th>
                  <th className="py-2">Subject</th>
                  <th className="py-2">Unit</th>
                  <th className="py-2">Activity</th>
                  <th className="py-2">Details</th>
                  <th className="py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id} className="border-b">
                    <td className="py-2">{activity.year}</td>
                    <td className="py-2">{activity.branch}</td>
                    <td className="py-2">{activity.subject}</td>
                    <td className="py-2">{activity.unitNumber}</td>
                    <td className="py-2">
                      {activity.activityType.replace("_", " ")}
                    </td>
                    <td className="py-2">
                      {activity.activityType === "quiz_submission" &&
                      activity.quizResult ? (
                        <span>
                          Score: {activity.quizResult.score}/
                          {activity.quizResult.totalQuestions}
                        </span>
                      ) : (
                        "Notes viewed"
                      )}
                    </td>
                    <td className="py-2">
                      {new Date(activity.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}
