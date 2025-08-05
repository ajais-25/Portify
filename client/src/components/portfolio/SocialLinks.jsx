import { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const SocialLinks = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    github: userData?.socialLinks?.github || "",
    linkedin: userData?.socialLinks?.linkedin || "",
    twitter: userData?.socialLinks?.twitter || "",
    website: userData?.socialLinks?.website || "",
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes when userData is updated
  useEffect(() => {
    setFormData({
      github: userData?.socialLinks?.github || "",
      linkedin: userData?.socialLinks?.linkedin || "",
      twitter: userData?.socialLinks?.twitter || "",
      website: userData?.socialLinks?.website || "",
    });
    setHasChanges(false);
  }, [userData]);

  // Check for changes whenever formData changes
  useEffect(() => {
    const hasModifications =
      formData.github !== (userData?.socialLinks?.github || "") ||
      formData.linkedin !== (userData?.socialLinks?.linkedin || "") ||
      formData.twitter !== (userData?.socialLinks?.twitter || "") ||
      formData.website !== (userData?.socialLinks?.website || "");
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

    if (!formData.github.trim()) {
      toast.error("GitHub link is required");
      setLoading(false);
      return;
    }

    try {
      const response = await api.put("/users/profile/social-links", formData);
      onUpdate("socialLinks", { socialLinks: response.data.data });
      toast.success("Social links updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating social links"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-3 sm:mb-4">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 text-white"
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
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Social Links
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-4">
          Connect your social media profiles and personal website to showcase
          your online presence.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Social Links Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* GitHub */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                <svg
                  className="h-4 w-4 sm:h-6 sm:w-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="github"
                  className="block text-base sm:text-lg font-semibold text-gray-900"
                >
                  GitHub
                </label>
                <p className="text-xs sm:text-sm text-gray-500">
                  Your code repositories
                </p>
              </div>
            </div>
            <input
              type="url"
              name="github"
              id="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* LinkedIn */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                <svg
                  className="h-4 w-4 sm:h-6 sm:w-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="linkedin"
                  className="block text-base sm:text-lg font-semibold text-gray-900"
                >
                  LinkedIn
                </label>
                <p className="text-xs sm:text-sm text-gray-500">
                  Professional network
                </p>
              </div>
            </div>
            <input
              type="url"
              name="linkedin"
              id="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full border-2 border-blue-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Twitter */}
          <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 sm:p-6 rounded-xl border border-sky-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-sky-500 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                <svg
                  className="h-4 w-4 sm:h-6 sm:w-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="twitter"
                  className="block text-base sm:text-lg font-semibold text-gray-900"
                >
                  Twitter
                </label>
                <p className="text-xs sm:text-sm text-gray-500">
                  Thoughts and updates
                </p>
              </div>
            </div>
            <input
              type="url"
              name="twitter"
              id="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
              className="w-full border-2 border-sky-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Website */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg mr-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="website"
                  className="block text-base sm:text-lg font-semibold text-gray-900"
                >
                  Personal Website
                </label>
                <p className="text-xs sm:text-sm text-gray-500">
                  Your online presence
                </p>
              </div>
            </div>
            <input
              type="url"
              name="website"
              id="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
              className="w-full border-2 border-purple-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Save Button */}
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
                    ? "Click save to update your social links information"
                    : "Your social links section is up to date"}
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

export default SocialLinks;
