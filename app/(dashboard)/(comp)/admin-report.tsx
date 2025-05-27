"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

export default function AdminPanel() {
  const { isLoaded, user } = useUser();
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<
    StudentActivity[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin based on Clerk public metadata
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/student-activity?isAdmin=${isAdmin}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        const data = await response.json();
        if (data.activities) {
          setActivities(data.activities);
          setFilteredActivities(data.activities); // Initialize filtered activities
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

    if (isLoaded && isAdmin) {
      fetchActivities();
    } else if (isLoaded && !isAdmin) {
      setError("Unauthorized access. Admin role required.");
      setIsLoading(false);
    }
  }, [isLoaded, isAdmin]);

  // Filter activities based on search query
  useEffect(() => {
    const filtered = activities.filter((activity) =>
      (activity.userName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredActivities(filtered);
  }, [searchQuery, activities]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">
          Admin Panel: Student Activity
        </h1>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-md mx-auto"
          />
        </div>
        <Card className="p-6 bg-white shadow-md rounded-xl">
          {filteredActivities.length === 0 ? (
            <p className="text-center text-gray-600">
              No activities match the search query.
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">User Name</th>
                  {/* <th className="py-2">User ID</th> */}
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
                {filteredActivities.map((activity) => (
                  <tr key={activity._id} className="border-b">
                    <td className="py-2">{activity.userName || "Unknown"}</td>
                    {/* <td className="py-2">{activity.userId}</td> */}
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
