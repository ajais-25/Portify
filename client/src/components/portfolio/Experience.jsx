import { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const Experience = ({ userData, onUpdate }) => {
  const [experience, setExperience] = useState(userData?.experience || []);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes when userData is updated
  useEffect(() => {
    setExperience(userData?.experience || []);
    setHasChanges(false);
  }, [userData]);

  // Check for changes whenever experience changes
  useEffect(() => {
    const originalExperience = userData?.experience || [];

    // Helper function to compare responsibility arrays
    const areResponsibilitiesEqual = (arr1, arr2) => {
      if (!arr1 || !arr2) return arr1 === arr2;
      if (arr1.length !== arr2.length) return false;
      return arr1.every((item, index) => item === arr2[index]);
    };

    // Check if the arrays are different in length or content
    const hasModifications =
      experience.length !== originalExperience.length ||
      experience.some((exp, index) => {
        const original = originalExperience[index];
        if (!original) return true;

        return (
          exp.company !== original.company ||
          exp.position !== original.position ||
          exp.startDate !== original.startDate ||
          exp.endDate !== original.endDate ||
          !areResponsibilitiesEqual(
            exp.responsibilities,
            original.responsibilities
          )
        );
      });

    setHasChanges(hasModifications);
  }, [experience, userData]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        responsibilities: [""],
      },
    ]);

    // Scroll to bottom after adding new experience
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const updatedExperience = [...experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };
    setExperience(updatedExperience);
  };

  const handleDateChange = (index, type, dateType, value) => {
    const currentExperience = experience[index];
    const currentDate = currentExperience[type] || "";

    let newDate;
    if (dateType === "month") {
      const year = currentDate.split("/")[1] || "";
      newDate = year ? `${value}/${year}` : value;
    } else {
      const month = currentDate.split("/")[0] || "01";
      newDate = `${month}/${value}`;
    }

    updateExperience(index, type, newDate);
  };

  const addResponsibility = (experienceIndex) => {
    const updatedExperience = [...experience];
    updatedExperience[experienceIndex] = {
      ...updatedExperience[experienceIndex],
      responsibilities: [
        ...updatedExperience[experienceIndex].responsibilities,
        "",
      ],
    };
    setExperience(updatedExperience);
  };

  const removeResponsibility = (experienceIndex, responsibilityIndex) => {
    const updatedExperience = [...experience];
    updatedExperience[experienceIndex] = {
      ...updatedExperience[experienceIndex],
      responsibilities: updatedExperience[
        experienceIndex
      ].responsibilities.filter((_, i) => i !== responsibilityIndex),
    };
    setExperience(updatedExperience);
  };

  const updateResponsibility = (
    experienceIndex,
    responsibilityIndex,
    value
  ) => {
    const updatedExperience = [...experience];
    updatedExperience[experienceIndex] = {
      ...updatedExperience[experienceIndex],
      responsibilities: [
        ...updatedExperience[experienceIndex].responsibilities,
      ],
    };
    updatedExperience[experienceIndex].responsibilities[responsibilityIndex] =
      value;
    setExperience(updatedExperience);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Filter out empty experience entries and clean responsibilities
    const validExperience = experience
      .filter((exp) => exp.company.trim() && exp.position.trim())
      .map((exp) => ({
        ...exp,
        responsibilities: exp.responsibilities.filter(
          (resp) => resp.trim() !== ""
        ),
      }));

    try {
      const response = await api.put("/users/profile/experience", {
        experience: validExperience,
      });

      onUpdate("experience", { experience: response.data.data });
      toast.success("Experience updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Professional Experience
              </h2>
              <p className="mt-2 text-gray-600 max-w-2xl">
                Showcase your career journey and professional accomplishments to
                highlight your expertise and growth.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={addExperience}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Experience</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {experience.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="bg-gray-200 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No experience entries yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your professional story by adding your work
              experience, internships, and career highlights.
            </p>
            <button
              type="button"
              onClick={addExperience}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center space-x-2 cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add Your First Experience</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Experience Header */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-6 border-b border-gray-100 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Experience #{index + 1}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Complete your professional details
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                    >
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
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
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <span>Company Name *</span>
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(index, "company", e.target.value)
                        }
                        placeholder="e.g., Google, Microsoft, Apple"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Position/Role *</span>
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(index, "position", e.target.value)
                        }
                        placeholder="e.g., Software Engineer, Product Manager"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Date Section */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Employment Duration</span>
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Start Date */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={exp.startDate.split("/")[0] || ""}
                            onChange={(e) =>
                              handleDateChange(
                                index,
                                "startDate",
                                "month",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                          >
                            <option value="">Month</option>
                            {months.map((month) => (
                              <option key={month.value} value={month.value}>
                                {month.label}
                              </option>
                            ))}
                          </select>
                          <select
                            value={exp.startDate.split("/")[1] || ""}
                            onChange={(e) =>
                              handleDateChange(
                                index,
                                "startDate",
                                "year",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                          >
                            <option value="">Year</option>
                            {years.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* End Date */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                          <span className="text-gray-400 text-xs ml-1">
                            (Leave empty if current)
                          </span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={exp.endDate.split("/")[0] || ""}
                            onChange={(e) =>
                              handleDateChange(
                                index,
                                "endDate",
                                "month",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                          >
                            <option value="">Month</option>
                            {months.map((month) => (
                              <option key={month.value} value={month.value}>
                                {month.label}
                              </option>
                            ))}
                          </select>
                          <select
                            value={exp.endDate.split("/")[1] || ""}
                            onChange={(e) =>
                              handleDateChange(
                                index,
                                "endDate",
                                "year",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                          >
                            <option value="">Year</option>
                            {years.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Responsibilities Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                        <span>Key Responsibilities & Achievements</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => addResponsibility(index)}
                        className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span>Add Responsibility</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {exp.responsibilities.map((responsibility, respIndex) => (
                        <div
                          key={respIndex}
                          className="flex items-start space-x-3 group"
                        >
                          <div className="bg-blue-100 p-2 rounded-lg mt-1 flex-shrink-0">
                            <span className="text-blue-600 font-semibold text-sm">
                              {respIndex + 1}
                            </span>
                          </div>
                          <textarea
                            value={responsibility}
                            onChange={(e) =>
                              updateResponsibility(
                                index,
                                respIndex,
                                e.target.value
                              )
                            }
                            placeholder="Describe your key responsibilities, achievements, or impact in this role..."
                            rows={2}
                            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                          />
                          {exp.responsibilities.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeResponsibility(index, respIndex)
                              }
                              className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0 mt-1 cursor-pointer"
                            >
                              <svg
                                className="w-5 h-5"
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
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save Section */}
        {(experience.length > 0 || hasChanges) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                <div>
                  <p className="font-medium text-gray-900">
                    {hasChanges
                      ? "You have unsaved changes"
                      : "All changes saved"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {hasChanges
                      ? "Click save to update your experience information"
                      : "Your experience section is up to date"}
                  </p>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !hasChanges}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                      className="w-5 h-5"
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
        )}
      </form>
    </div>
  );
};

export default Experience;
