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
          JSON.stringify(exp.responsibilities) !==
            JSON.stringify(original.responsibilities)
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
    updatedExperience[experienceIndex].responsibilities.push("");
    setExperience(updatedExperience);
  };

  const removeResponsibility = (experienceIndex, responsibilityIndex) => {
    const updatedExperience = [...experience];
    updatedExperience[experienceIndex].responsibilities = updatedExperience[
      experienceIndex
    ].responsibilities.filter((_, i) => i !== responsibilityIndex);
    setExperience(updatedExperience);
  };

  const updateResponsibility = (
    experienceIndex,
    responsibilityIndex,
    value
  ) => {
    const updatedExperience = [...experience];
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
          <p className="mt-1 text-sm text-gray-600">
            Add your work experience and professional background.
          </p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add Experience
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {experience.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No experience entries
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your work experience.
            </p>
            <button
              type="button"
              onClick={addExperience}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Add Experience
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg relative">
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-800"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Company *
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(index, "company", e.target.value)
                      }
                      placeholder="Company name"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Position *
                    </label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(index, "position", e.target.value)
                      }
                      placeholder="Job title/position"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
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
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date (Optional)
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
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
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Responsibilities */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Responsibilities
                  </label>
                  {exp.responsibilities.map((responsibility, respIndex) => (
                    <div
                      key={respIndex}
                      className="flex items-center space-x-2 mb-3"
                    >
                      <input
                        type="text"
                        value={responsibility}
                        onChange={(e) =>
                          updateResponsibility(index, respIndex, e.target.value)
                        }
                        placeholder="Describe your responsibilities..."
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {exp.responsibilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeResponsibility(index, respIndex)}
                          className="text-red-600 hover:text-red-800"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addResponsibility(index)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Responsibility
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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

export default Experience;
