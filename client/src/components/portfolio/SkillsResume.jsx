import { useState, useEffect } from "react";
import api from "../../api";

const SkillsResume = ({ userData, onUpdate }) => {
  const [technologies, setTechnologies] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(
    userData?.skills?.map((skill) => skill._id) || []
  );
  const [resume, setResume] = useState(userData?.resume || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      const response = await api.get("/technologies");
      setTechnologies(response.data.data);
    } catch (error) {
      console.error("Error fetching technologies:", error);
    }
  };

  const handleSkillToggle = (skillId) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.put("/users/profile/skills-resume", {
        skills: selectedSkills,
        resume: resume,
      });

      onUpdate("skills", {
        skills: response.data.data.skills,
        resume: response.data.data.resume,
      });
      setMessage("Skills and resume updated successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error updating skills and resume"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTechnologies = technologies.filter((tech) =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTechnologies = technologies.filter((tech) =>
    selectedSkills.includes(tech._id)
  );
  const availableTechnologies = technologies.filter(
    (tech) => !selectedSkills.includes(tech._id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Skills & Resume</h2>
        <p className="mt-1 text-sm text-gray-600">
          Select your skills and add your resume link.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md ${
            message.includes("successfully")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Skills Section */}
        <div>
          {/* Selected Skills */}
          {selectedTechnologies.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Selected Skills:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTechnologies.map((tech) => (
                  <span
                    key={tech._id}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => handleSkillToggle(tech._id)}
                  >
                    {tech.name}
                    <svg
                      className="ml-1 w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Search Input */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Available Skills */}
          <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Available Skills:
            </h4>
            {filteredTechnologies.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredTechnologies.map((tech) => (
                  <label
                    key={tech._id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(tech._id)}
                      onChange={() => handleSkillToggle(tech._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{tech.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No skills found matching your search.
              </p>
            )}
          </div>
        </div>

        {/* Resume Section */}
        <div>
          <label
            htmlFor="resume"
            className="block text-sm font-medium text-gray-700"
          >
            Resume (Google Drive Link)
          </label>
          <div className="mt-1">
            <input
              type="url"
              name="resume"
              id="resume"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="https://drive.google.com/file/d/your-file-id/view"
              className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Make sure your Google Drive link is set to "Anyone with the link
              can view"
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Skills Preview */}
      {selectedTechnologies.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Skills Preview
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedTechnologies.map((tech) => (
              <div
                key={tech._id}
                className="inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
              >
                {tech.image && (
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="w-4 h-4 mr-2 rounded"
                  />
                )}
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsResume;
