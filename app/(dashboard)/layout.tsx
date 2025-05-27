"use client";
import { useState } from "react";
import Navbar from "./(comp)/navbar";
import Sidebar from "./(comp)/sidebar";
import EngineeringNewsFeed from "./(comp)/newfeed";
import { Menu } from "lucide-react";
import Courses from "./(courses)/courses";
import UploadNotes from "./(courses)/uploadcourse";
import AdminPanel from "./(comp)/admin-report";
import StudentDashboard from "./(comp)/Student-report";
import CareerCounseling from "./(comp)/careerCoun"

export default function RootLayout() {
  const [activeButton, setActiveButton] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeButton) {
      case "DashBoard":
        return <Courses />;
      case "Study Lists":
        return <UploadNotes />;
      case "Newsfeed":
        return <EngineeringNewsFeed />;
      case "Chat":
        return <AdminPanel />;
      case "My Activity":
        return <StudentDashboard />;
      case "Career Corner":
        return <CareerCounseling />
      default:
        return <h1 className="text-3xl font-bold">Welcome!</h1>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        setActiveButton={setActiveButton}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar with sidebar toggle for mobile */}
        <div className="sticky top-0 z-30">
          <div className="md:hidden absolute left-4 top-4 z-50">
            <button
              onClick={toggleSidebar}
              className="p-2 bg-white rounded-lg shadow-md"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
          </div>
          <Navbar />
        </div>

        {/* Main content area */}
        <main className="flex-1 p-4 pt-20 md:pt-16 md:ml-64">
          <div className=" p-4 md:p-6  w-full">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
