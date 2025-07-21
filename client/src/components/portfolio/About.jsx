import { useState } from "react";
import api from "../../api";

const About = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    bio: userData?.bio || "",
    description: userData?.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.put("/users/profile/about", formData);
      onUpdate("about", response.data.data);
      setMessage("About section updated successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error updating about section"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">About</h2>
        <p className="mt-1 text-sm text-gray-600">
          Tell people about yourself and your professional background.
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
        <div>
          <label
            htmlFor="whatAreYou"
            className="block text-sm font-medium text-gray-700"
          >
            Bio*
          </label>
          <input
            type="text"
            name="bio"
            id="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="e.g., Full Stack Developer, UI/UX Designer"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description*
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe yourself, your skills, and what you do..."
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
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
    </div>
  );
};

export default About;
