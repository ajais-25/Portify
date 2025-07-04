import { useState } from "react";
import api from "../../api";

const Education = ({ userData, onUpdate }) => {
  const [education, setEducation] = useState(userData?.education || []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const addEducation = () => {
    setEducation([
      ...education,
      {
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setEducation(updatedEducation);
  };

  const handleDateChange = (index, type, dateType, value) => {
    const currentEducation = education[index];
    const currentDate = currentEducation[type] || "";

    let newDate;
    if (dateType === "month") {
      const year = currentDate.split("/")[1] || "";
      newDate = year ? `${value}/${year}` : value;
    } else {
      const month = currentDate.split("/")[0] || "01";
      newDate = `${month}/${value}`;
    }

    updateEducation(index, type, newDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Filter out empty education entries
    const validEducation = education.filter(
      (edu) => edu.institution.trim() && edu.degree.trim()
    );

    try {
      const response = await api.put("/users/profile/education", {
        education: validEducation,
      });

      onUpdate("education", { education: response.data.data });
      setMessage("Education updated successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating education");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Education</h2>
          <p className="mt-1 text-sm text-gray-600">
            Add your educational background and qualifications.
          </p>
        </div>
        <button
          type="button"
          onClick={addEducation}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Education
        </button>
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
        {education.length === 0 ? (
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No education entries
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your educational background.
            </p>
            <button
              type="button"
              onClick={addEducation}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Education
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg relative">
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
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
                      Institution *
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(index, "institution", e.target.value)
                      }
                      placeholder="University/College/School name"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Degree *
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(index, "degree", e.target.value)
                      }
                      placeholder="Bachelor of Science, Master of Arts, etc."
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
                        value={edu.startDate.split("/")[0] || ""}
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
                        value={edu.startDate.split("/")[1] || ""}
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
                        value={edu.endDate.split("/")[0] || ""}
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
                        value={edu.endDate.split("/")[1] || ""}
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
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Education;
