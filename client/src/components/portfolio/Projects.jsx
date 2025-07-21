import { useState, useEffect } from "react";
import api from "../../api";

const Projects = ({ userData, onUpdate }) => {
  const [projects, setProjects] = useState(userData?.projects || []);
  const [technologies, setTechnologies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologiesUsed: [],
    keyFeatures: [""],
    githubLink: "",
    liveLink: "",
    image: null,
  });

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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      technologiesUsed: [],
      keyFeatures: [""],
      githubLink: "",
      liveLink: "",
      image: null,
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleTechnologyChange = (techId) => {
    setFormData((prev) => ({
      ...prev,
      technologiesUsed: prev.technologiesUsed.includes(techId)
        ? prev.technologiesUsed.filter((id) => id !== techId)
        : [...prev.technologiesUsed, techId],
    }));
  };

  const handleKeyFeatureChange = (index, value) => {
    const newFeatures = [...formData.keyFeatures];
    newFeatures[index] = value;
    setFormData((prev) => ({
      ...prev,
      keyFeatures: newFeatures,
    }));
  };

  const addKeyFeature = () => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, ""],
    }));
  };

  const removeKeyFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validation
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.githubLink.trim() ||
      formData.technologiesUsed.length === 0
    ) {
      setMessage("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const filteredFeatures = formData.keyFeatures.filter(
      (feature) => feature.trim() !== ""
    );
    if (filteredFeatures.length === 0) {
      setMessage("Please add at least one key feature");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append(
        "technologiesUsed",
        JSON.stringify(formData.technologiesUsed)
      );
      formDataToSend.append("keyFeatures", JSON.stringify(filteredFeatures));
      formDataToSend.append("githubLink", formData.githubLink);
      formDataToSend.append("liveLink", formData.liveLink);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = editingProject
        ? await api.put(`/project/${editingProject._id}`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await api.post("/project", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      setMessage(
        `Project ${editingProject ? "updated" : "added"} successfully!`
      );
      onUpdate(); // Refresh the user data
      resetForm();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          `Error ${editingProject ? "updating" : "adding"} project`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologiesUsed: project.technologiesUsed.map((tech) => tech._id),
      keyFeatures: project.keyFeatures,
      githubLink: project.githubLink,
      liveLink: project.liveLink || "",
      image: null,
    });
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await api.delete(`/project/${projectId}`);
      setMessage("Project deleted successfully!");
      onUpdate(); // Refresh the user data
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting project");
    }
  };

  const filteredTechnologies = technologies.filter(
    (tech) => !formData.technologiesUsed.includes(tech._id)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="mt-1 text-sm text-gray-600">
            Showcase your work and accomplishments.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add Project
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

      {/* Project Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Technologies Used *
                  </label>
                  <div className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {technologies.map((tech) => (
                      <label
                        key={tech._id}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.technologiesUsed.includes(tech._id)}
                          onChange={() => handleTechnologyChange(tech._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{tech.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Key Features *
                  </label>
                  {formData.keyFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mt-2"
                    >
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleKeyFeatureChange(index, e.target.value)
                        }
                        placeholder="Enter a key feature"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.keyFeatures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeKeyFeature(index)}
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
                    onClick={addKeyFeature}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Feature
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      GitHub Link *
                    </label>
                    <input
                      type="url"
                      name="githubLink"
                      value={formData.githubLink}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Live Link (Optional)
                    </label>
                    <input
                      type="url"
                      name="liveLink"
                      value={formData.liveLink}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : (editingProject ? "Update" : "Add") + " Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userData?.projects?.map((project) => (
          <div
            key={project._id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {project.imageURL && (
              <img
                src={project.imageURL}
                alt={project.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologiesUsed?.slice(0, 3).map((tech) => (
                  <span
                    key={tech._id}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tech.name}
                  </span>
                ))}
                {project.technologiesUsed?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{project.technologiesUsed.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    GitHub
                  </a>
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-gray-600 hover:text-gray-800 cursor-pointer"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!userData?.projects || userData.projects.length === 0) && (
        <div className="text-center py-12">
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No projects
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first project.
          </p>
        </div>
      )}
    </div>
  );
};

export default Projects;
