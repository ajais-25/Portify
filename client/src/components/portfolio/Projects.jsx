import { useState, useEffect, useRef } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const Projects = ({ userData, onUpdate }) => {
  const [technologies, setTechnologies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologiesUsed: [],
    keyFeatures: [""],
    githubLink: "",
    liveLink: "",
    image: null,
  });

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

  // Track changes in form data
  useEffect(() => {
    if (!editingProject) {
      // For new projects, check if any field has data
      const hasData =
        formData.title.trim() !== "" ||
        formData.description.trim() !== "" ||
        formData.technologiesUsed.length > 0 ||
        formData.keyFeatures.some((feature) => feature.trim() !== "") ||
        formData.githubLink.trim() !== "" ||
        formData.liveLink.trim() !== "" ||
        formData.image !== null;
      setHasChanges(hasData);
    } else {
      // For editing projects, check if any field has changed
      const hasModifications =
        formData.title !== editingProject.title ||
        formData.description !== editingProject.description ||
        JSON.stringify(formData.technologiesUsed.sort()) !==
          JSON.stringify(
            editingProject.technologiesUsed.map((tech) => tech._id).sort()
          ) ||
        JSON.stringify(formData.keyFeatures) !==
          JSON.stringify(editingProject.keyFeatures) ||
        formData.githubLink !== editingProject.githubLink ||
        formData.liveLink !== (editingProject.liveLink || "") ||
        formData.image !== null;
      setHasChanges(hasModifications);
    }
  }, [formData, editingProject]);

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
    setHasChanges(false);
    // Reset tech filter states
    setTechFilter("");
    setShowTechDropdown(false);
    setFocusedTechIndex(-1);
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

  // Filter technologies based on search input and exclude already selected ones
  const filteredTechnologies = technologies.filter(
    (tech) =>
      tech.name.toLowerCase().includes(techFilter.toLowerCase()) &&
      !formData.technologiesUsed.includes(tech._id)
  );

  // Get selected technology objects for display
  const selectedTechnologies = technologies.filter((tech) =>
    formData.technologiesUsed.includes(tech._id)
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
          handleTechnologyChange(filteredTechnologies[focusedTechIndex]._id);
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

  const removeTechnology = (techId) => {
    setFormData((prev) => ({
      ...prev,
      technologiesUsed: prev.technologiesUsed.filter((id) => id !== techId),
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
    if (formData.keyFeatures.length < 3) {
      setFormData((prev) => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, ""],
      }));
    }
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

    // Validation
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.githubLink.trim()
    ) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.technologiesUsed.length === 0) {
      toast.error("Please select at least one technology");
      setLoading(false);
      return;
    }

    const filteredFeatures = formData.keyFeatures.filter(
      (feature) => feature.trim() !== ""
    );
    if (filteredFeatures.length === 0) {
      toast.error("Please add at least one key feature");
      setLoading(false);
      return;
    }

    if (filteredFeatures.length > 3) {
      toast.error("Key features cannot exceed 3 items");
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

      editingProject
        ? await api.put(`/project/${editingProject._id}`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await api.post("/project", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      toast.success(
        `Project ${editingProject ? "updated" : "added"} successfully!`
      );
      onUpdate(); // Refresh the user data
      resetForm();
    } catch (error) {
      toast.error(
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
    // Reset tech filter states
    setTechFilter("");
    setShowTechDropdown(false);
    setFocusedTechIndex(-1);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await api.delete(`/project/${projectId}`);
      toast.success("Project deleted successfully!");
      onUpdate(); // Refresh the user data
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting project");
    }
  };

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

      {/* Project Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 h-[100vh] flex items-center justify-center p-4 z-50">
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

                  {/* Selected Technologies Display */}
                  {selectedTechnologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedTechnologies.map((tech) => (
                        <span
                          key={tech._id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {tech.name}
                          <button
                            type="button"
                            onClick={() => removeTechnology(tech._id)}
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
                  )}

                  {/* Technology Filter Input */}
                  <div className="mt-2 relative">
                    <input
                      type="text"
                      value={techFilter}
                      onChange={handleTechFilterChange}
                      onKeyDown={handleTechFilterKeyDown}
                      onFocus={() => setShowTechDropdown(true)}
                      onBlur={() => {
                        // Delay hiding dropdown to allow clicks
                        setTimeout(() => setShowTechDropdown(false), 150);
                      }}
                      placeholder="Search and select technologies..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Technology Dropdown */}
                    {showTechDropdown && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                      >
                        {filteredTechnologies.length > 0 ? (
                          filteredTechnologies.map((tech, index) => {
                            const isSelected =
                              formData.technologiesUsed.includes(tech._id);
                            const isFocused = index === focusedTechIndex;

                            return (
                              <div
                                key={tech._id}
                                ref={(el) =>
                                  (focusedItemRefs.current[index] = el)
                                }
                                onClick={() => {
                                  handleTechnologyChange(tech._id);
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
                            No technologies found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Use ↑↓ arrow keys to navigate, Enter to select, Esc to close
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Key Features * (Maximum 3)
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
                  {formData.keyFeatures.length < 3 && (
                    <button
                      type="button"
                      onClick={addKeyFeature}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Feature
                    </button>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.keyFeatures.length}/3 features added
                  </p>
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

                  {/* Show current image when editing */}
                  {editingProject && editingProject.imageURL && (
                    <div className="mt-2 mb-3">
                      <p className="text-sm text-gray-600 mb-2">
                        Current image:
                      </p>
                      <img
                        src={editingProject.imageURL}
                        alt={editingProject.title}
                        loading="lazy"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />

                  {editingProject && editingProject.imageURL && (
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a new image to replace the current one, or leave
                      empty to keep the existing image.
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !hasChanges}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
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
                {project.technologiesUsed?.map((tech) => (
                  <span
                    key={tech._id}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>

              {/* Key Features */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Key Features:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {project.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
