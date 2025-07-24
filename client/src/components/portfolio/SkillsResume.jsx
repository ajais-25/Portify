import { useState, useEffect, useRef } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const SkillsResume = ({ userData, onUpdate }) => {
  const [technologies, setTechnologies] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(
    userData?.skills?.map((skill) => skill._id) || []
  );
  const [resume, setResume] = useState(userData?.resume || "");
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Technology filter states
  const [techFilter, setTechFilter] = useState("");
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const [focusedTechIndex, setFocusedTechIndex] = useState(-1);

  // Refs for dropdown scrolling
  const dropdownRef = useRef(null);
  const focusedItemRefs = useRef([]);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  // Track changes when userData is updated
  useEffect(() => {
    setSelectedSkills(userData?.skills?.map((skill) => skill._id) || []);
    setResume(userData?.resume || "");
    setHasChanges(false);
  }, [userData]);

  // Check for changes whenever selectedSkills or resume changes
  useEffect(() => {
    const originalSkills = userData?.skills?.map((skill) => skill._id) || [];
    const hasSkillChanges =
      selectedSkills.length !== originalSkills.length ||
      selectedSkills.some((skill) => !originalSkills.includes(skill)) ||
      originalSkills.some((skill) => !selectedSkills.includes(skill));

    const hasResumeChanges = resume !== (userData?.resume || "");

    setHasChanges(hasSkillChanges || hasResumeChanges);
  }, [selectedSkills, resume, userData]);

  // Scroll focused item into view
  useEffect(() => {
    if (
      focusedTechIndex >= 0 &&
      showTechDropdown &&
      focusedItemRefs.current[focusedTechIndex]
    ) {
      focusedItemRefs.current[focusedTechIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [focusedTechIndex, showTechDropdown]);

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

  // Filter technologies based on search input and exclude already selected ones
  const filteredTechnologies = technologies.filter(
    (tech) =>
      tech.name.toLowerCase().includes(techFilter.toLowerCase()) &&
      !selectedSkills.includes(tech._id)
  );

  // Handle technology filter input and keyboard navigation
  const handleTechFilterChange = (e) => {
    setTechFilter(e.target.value);
    setShowTechDropdown(true);
    setFocusedTechIndex(-1);
  };

  const handleTechFilterKeyDown = (e) => {
    if (!showTechDropdown) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedTechIndex((prev) =>
          prev < filteredTechnologies.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedTechIndex((prev) =>
          prev > 0 ? prev - 1 : filteredTechnologies.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (focusedTechIndex >= 0 && filteredTechnologies[focusedTechIndex]) {
          handleSkillToggle(filteredTechnologies[focusedTechIndex]._id);
          setTechFilter("");
          setShowTechDropdown(false);
          setFocusedTechIndex(-1);
        }
        break;
      case "Escape":
        setShowTechDropdown(false);
        setFocusedTechIndex(-1);
        break;
    }
  };

  const removeSkill = (skillId) => {
    setSelectedSkills((prev) => prev.filter((id) => id !== skillId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put("/users/profile/skills-resume", {
        skills: selectedSkills,
        resume: resume,
      });

      onUpdate("skills", {
        skills: response.data.data.skills,
        resume: response.data.data.resume,
      });
      toast.success("Skills and resume updated successfully!");

      // Reset filter states
      setTechFilter("");
      setShowTechDropdown(false);
      setFocusedTechIndex(-1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating skills and resume"
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedTechnologies = technologies.filter((tech) =>
    selectedSkills.includes(tech._id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Skills & Resume</h2>
        <p className="mt-1 text-sm text-gray-600">
          Select your skills and add your resume link.
        </p>
      </div>

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
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tech.name}
                    <button
                      type="button"
                      onClick={() => removeSkill(tech._id)}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-600"
                    >
                      <svg
                        className="w-3 h-3"
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
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Technology Filter Input */}
          <div className="relative">
            <label
              htmlFor="skills-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Add Skills
            </label>
            <input
              id="skills-filter"
              type="text"
              value={techFilter}
              onChange={handleTechFilterChange}
              onKeyDown={handleTechFilterKeyDown}
              onFocus={() => setShowTechDropdown(true)}
              onBlur={() => {
                // Delay hiding dropdown to allow clicks
                setTimeout(() => setShowTechDropdown(false), 150);
              }}
              placeholder="Search and select skills..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Technology Dropdown */}
            {showTechDropdown && (
              <div
                ref={dropdownRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
              >
                {filteredTechnologies.length > 0 ? (
                  filteredTechnologies.map((tech, index) => {
                    const isSelected = selectedSkills.includes(tech._id);
                    const isFocused = index === focusedTechIndex;

                    return (
                      <div
                        key={tech._id}
                        ref={(el) => (focusedItemRefs.current[index] = el)}
                        onClick={() => {
                          handleSkillToggle(tech._id);
                          setTechFilter("");
                          setShowTechDropdown(false);
                          setFocusedTechIndex(-1);
                        }}
                        className={`px-3 py-2 cursor-pointer flex items-center justify-between ${
                          isFocused ? "bg-blue-50" : "hover:bg-gray-50"
                        } ${isSelected ? "bg-blue-100" : ""}`}
                      >
                        <span
                          className={`text-sm ${
                            isSelected
                              ? "text-blue-800 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {tech.name}
                        </span>
                        {isSelected && (
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No skills found
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-1">
              Use ↑↓ arrow keys to navigate, Enter to select, Esc to close
            </p>
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
            disabled={loading || !hasChanges}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillsResume;
