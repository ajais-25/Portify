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
      toast.success("Skills and Resume updated successfully!");

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
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Skills & Resume
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-blue-600">
              Showcase your technical expertise and share your resume
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Skills Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6">
            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Technical Skills
            </h3>
          </div>

          {/* Selected Skills */}
          {selectedTechnologies.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold text-gray-800">
                    Selected Skills
                  </h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedTechnologies.length}{" "}
                    {selectedTechnologies.length === 1 ? "skill" : "skills"}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Click × to remove
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedTechnologies.map((tech, index) => (
                  <div
                    key={tech._id}
                    className="group relative bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {tech.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800 text-sm">
                          {tech.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkill(tech._id)}
                        className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer"
                        title="Remove skill"
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
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills summary */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-blue-700">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="font-medium">Skills Portfolio</span>
                  </div>
                  <span className="text-blue-600 font-semibold">
                    {selectedTechnologies.length} technologies mastered
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Technology Filter Input */}
          <div className="relative">
            <label
              htmlFor="skills-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search & Add New Skills
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                id="skills-filter"
                type="text"
                value={techFilter}
                onChange={handleTechFilterChange}
                onKeyDown={handleTechFilterKeyDown}
                onFocus={() => setShowTechDropdown(true)}
                onBlur={(e) => {
                  if (!dropdownRef.current?.contains(e.relatedTarget)) {
                    setTimeout(() => setShowTechDropdown(false), 200);
                  }
                }}
                placeholder="Search for skills (React, Python, JavaScript...)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Technology Dropdown */}
            {showTechDropdown && (
              <div
                ref={dropdownRef}
                className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
              >
                {filteredTechnologies.length > 0 ? (
                  <div className="py-2">
                    {filteredTechnologies.map((tech, index) => {
                      const isSelected = selectedSkills.includes(tech._id);
                      const isFocused = index === focusedTechIndex;

                      return (
                        <div
                          key={tech._id}
                          ref={(el) => (focusedItemRefs.current[index] = el)}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSkillToggle(tech._id);
                            setTechFilter("");
                            setShowTechDropdown(false);
                            setFocusedTechIndex(-1);
                          }}
                          className={`mx-2 px-3 py-2 cursor-pointer flex items-center justify-between rounded-lg transition-colors ${
                            isFocused
                              ? "bg-blue-50 border border-blue-200"
                              : "hover:bg-gray-50"
                          } ${
                            isSelected
                              ? "bg-blue-100 border border-blue-200"
                              : ""
                          }`}
                        >
                          <span
                            className={`text-sm font-medium ${
                              isSelected ? "text-blue-800" : "text-gray-700"
                            }`}
                          >
                            {tech.name}
                          </span>
                          {isSelected && (
                            <div className="flex items-center">
                              <span className="text-xs text-blue-600 mr-2">
                                Added
                              </span>
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
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    {techFilter
                      ? "No matching skills found"
                      : "Start typing to search skills"}
                  </div>
                )}
              </div>
            )}

            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↑↓</kbd>
                <span className="ml-1">Navigate</span>
              </span>
              <span className="flex items-center">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                  Enter
                </kbd>
                <span className="ml-1">Select</span>
              </span>
              <span className="flex items-center">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
                <span className="ml-1">Close</span>
              </span>
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Resume Document
              </h3>
              <p className="text-sm text-gray-600">
                Share your professional resume
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-gray-700"
            >
              Google Drive Resume Link
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <input
                type="url"
                name="resume"
                id="resume"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="https://drive.google.com/file/d/your-file-id/view"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-amber-600 mt-0.5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Important:
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Make sure your Google Drive link is set to "Anyone with the
                    link can view" for public access.
                  </p>
                </div>
              </div>
            </div>
            {resume && (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
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
                  <span className="text-sm font-medium text-green-800">
                    Resume link added
                  </span>
                </div>
                <a
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-700 hover:text-green-800 underline"
                >
                  Preview
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Save Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
              <div className="bg-blue-100 p-2 sm:p-2 rounded-lg flex-shrink-0">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
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
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {hasChanges
                    ? "You have unsaved changes"
                    : "All changes saved"}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {hasChanges
                    ? "Click save to update your skills and resume information"
                    : "Your skills and resume section is up to date"}
                </p>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !hasChanges}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center sm:justify-start space-x-2 cursor-pointer text-sm sm:text-base w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SkillsResume;
