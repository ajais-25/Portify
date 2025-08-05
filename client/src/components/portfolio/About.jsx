import { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const About = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    tagline: userData?.tagline || "",
    description: userData?.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes when userData is updated
  useEffect(() => {
    setFormData({
      tagline: userData?.tagline || "",
      description: userData?.description || "",
    });
    setHasChanges(false);
  }, [userData]);

  // Check for changes whenever formData changes
  useEffect(() => {
    const hasModifications =
      formData.tagline !== (userData?.tagline || "") ||
      formData.description !== (userData?.description || "");
    setHasChanges(hasModifications);
  }, [formData, userData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put("/users/profile/about", formData);
      onUpdate("about", response.data.data);
      toast.success("About section updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating about section"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="bg-blue-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              About Me
            </h2>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
              Share your story and let the world know who you are
            </p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2 sm:gap-3">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-1">
              Tips for a great About section:
            </h4>
            <ul className="text-xs text-blue-700 space-y-0.5 sm:space-y-1">
              <li>• Keep your tagline concise and impactful</li>
              <li>• Share your passion and what motivates you</li>
              <li>• Mention your key skills and experience</li>
              <li>• Be authentic and let your personality shine</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            Edit Information
          </h3>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          {/* Tagline Field */}
          <div className="space-y-2">
            <label
              htmlFor="tagline"
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Professional Tagline
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="tagline"
                id="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g., Full Stack Developer • UI/UX Designer • Problem Solver"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 bg-gray-50 focus:bg-white"
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              A catchy one-liner that describes what you do
            </p>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0"
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
              About Description
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell your story... What drives you? What are your passions? What makes you unique as a professional?"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 bg-gray-50 focus:bg-white resize-none"
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Share your background, skills, and what you're passionate about
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 gap-3 sm:gap-0">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              {hasChanges && (
                <>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse flex-shrink-0"></div>
                  <span>You have unsaved changes</span>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              {hasChanges && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      tagline: userData?.tagline || "",
                      description: userData?.description || "",
                    });
                  }}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto text-center font-medium"
                >
                  Reset
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !hasChanges}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium cursor-pointer text-xs sm:text-sm w-full sm:w-auto"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
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
                    Save Changes
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default About;
