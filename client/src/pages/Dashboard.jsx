import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import About from "../components/portfolio/About";
import SocialLinks from "../components/portfolio/SocialLinks";
import Projects from "../components/portfolio/Projects";
import SkillsResume from "../components/portfolio/SkillsResume";
import Education from "../components/portfolio/Education";
import Experience from "../components/portfolio/Experience";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("about");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "about", label: "About" },
    { id: "social", label: "Social Links" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills & Resume" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/users/profile");
      setUserData(response.data.data);
      console.log("User profile data:", response.data.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
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
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Portfolio Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your portfolio information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user?.name}
              </span>
              <button
                onClick={() =>
                  window.open(`/portfolio/${user?.username}`, "_blank")
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
          <div className="p-6">
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
            {activeTab === "education" && (
              <Education userData={userData} onUpdate={handleDataUpdate} />
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
