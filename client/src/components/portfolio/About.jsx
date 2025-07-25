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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">About</h2>
        <p className="mt-1 text-sm text-gray-600">
          Tell people about yourself and your professional background.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="whatAreYou"
            className="block text-sm font-medium text-gray-700"
          >
            Tagline*
          </label>
          <input
            type="text"
            name="tagline"
            id="tagline"
            value={formData.tagline}
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

export default About;
