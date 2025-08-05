import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import About from "../components/portfolio/About";
import SocialLinks from "../components/portfolio/SocialLinks";
import Projects from "../components/portfolio/Projects";
import SkillsResume from "../components/portfolio/SkillsResume";
import Experience from "../components/portfolio/Experience";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("about");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "about", label: "About" },
    { id: "social", label: "Social Links" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills & Resume" },
    { id: "experience", label: "Experience" },
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/users/profile");
      setUserData(response.data.data);
    } catch (error) {
      toast.error("Error fetching user profile");
      console.error("Error fetching user profile:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = (section, data) => {
    setUserData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out. Please try again.");
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Dashboard
              </h1>
            </div>
            <div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-red-300 text-xs sm:text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Portfolio URL Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Portfolio URL
            </h2>
            <div className="flex items-center space-x-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-600 flex-1 truncate">
                    {window.location.origin}/portfolio/{user?.username}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/portfolio/${user?.username}`;
                  navigator.clipboard
                    .writeText(url)
                    .then(() => {
                      toast.success("Portfolio URL copied to clipboard!");
                    })
                    .catch(() => {
                      toast.error("Failed to copy URL");
                    });
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </button>
              <button
                onClick={() =>
                  window.open(`/portfolio/${user?.username}`, "_blank")
                }
                className="inline-flex items-center px-3 py-2 border border-blue-500 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Open
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap overflow-x-auto space-x-4 sm:space-x-8 px-4 sm:px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === "about" && (
              <About userData={userData} onUpdate={handleDataUpdate} />
            )}
            {activeTab === "social" && (
              <SocialLinks userData={userData} onUpdate={handleDataUpdate} />
            )}
            {activeTab === "projects" && (
              <Projects userData={userData} onUpdate={fetchUserProfile} />
            )}
            {activeTab === "skills" && (
              <SkillsResume userData={userData} onUpdate={handleDataUpdate} />
            )}
            {activeTab === "experience" && (
              <Experience userData={userData} onUpdate={handleDataUpdate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
