import { useState, useEffect, useRef } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const Projects = ({ userData, onUpdate }) => {
  const [technologies, setTechnologies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    projectId: null,
    projectTitle: "",
  });

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
    const project = userData?.projects?.find((p) => p._id === projectId);
    setDeleteConfirmation({
      show: true,
      projectId: projectId,
      projectTitle: project?.title || "this project",
    });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/project/${deleteConfirmation.projectId}`);
      toast.success("Project deleted successfully!");
      onUpdate(); // Refresh the user data
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting project");
    } finally {
      setDeleteConfirmation({ show: false, projectId: null, projectTitle: "" });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, projectId: null, projectTitle: "" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-white"
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
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Showcase your work and accomplishments. Add projects that
            demonstrate your skills and expertise.
          </p>
          {userData?.projects && userData.projects.length > 0 && (
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              {userData.projects.length} project
              {userData.projects.length !== 1 ? "s" : ""} added
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Project
        </button>
      </div>

      {/* Project Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm h-[100vh] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingProject ? "Edit Project" : "Add New Project"}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {editingProject
                      ? "Update your project details"
                      : "Share your latest work with the world"}
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
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
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your project title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Project Image
                    </label>

                    {/* Show current image when editing */}
                    {editingProject && editingProject.imageURL && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-2">
                          Current image:
                        </p>
                        <img
                          src={editingProject.imageURL}
                          alt={editingProject.title}
                          loading="lazy"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                    />

                    {editingProject && editingProject.imageURL && (
                      <p className="text-xs text-gray-500 mt-2">
                        Upload a new image to replace the current one, or leave
                        empty to keep the existing image.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Describe your project, its purpose, and what makes it special..."
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
                            className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-600 cursor-pointer"
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
                          className="text-red-600 hover:text-red-800 cursor-pointer"
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
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                    >
                      + Add Feature
                    </button>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.keyFeatures.length}/3 features added
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      GitHub Repository *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        name="githubLink"
                        value={formData.githubLink}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="https://github.com/username/repo"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Live Demo (Optional)
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
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                      <input
                        type="url"
                        name="liveLink"
                        value={formData.liveLink}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="https://your-demo-site.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !hasChanges}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
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
                        Saving...
                      </div>
                    ) : (
                      (editingProject ? "Update" : "Add") + " Project"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.084 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Project
                  </h3>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  "{deleteConfirmation.projectTitle}"
                </span>
                ? This will permanently remove the project and all its
                associated data.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {userData?.projects?.map((project) => (
          <div
            key={project._id}
            className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            {/* Project Image */}
            <div className="relative overflow-hidden h-56">
              {project.imageURL ? (
                <img
                  src={project.imageURL}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              )}

              {/* Overlay with actions */}
              <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors cursor-pointer"
                  title="Edit project"
                >
                  <svg
                    className="w-4 h-4 text-gray-700"
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
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete project"
                >
                  <svg
                    className="w-4 h-4 text-red-600"
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

            {/* Project Content */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologiesUsed?.slice(0, 3).map((tech) => (
                    <span
                      key={tech._id}
                      className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                    >
                      {tech.name}
                    </span>
                  ))}
                  {project.technologiesUsed?.length > 3 && (
                    <div className="relative">
                      <span className="px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200 cursor-pointer hover:from-gray-100 hover:to-gray-150 transition-all group/tooltip">
                        +{project.technologiesUsed.length - 3}
                        {/* Tooltip with remaining technologies */}
                        <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                            <div className="flex flex-wrap gap-1 max-w-48">
                              {project.technologiesUsed
                                .slice(3)
                                .map((tech, index) => (
                                  <span key={tech._id} className="inline-block">
                                    {tech.name}
                                    {index <
                                      project.technologiesUsed.slice(3).length -
                                        1 && ", "}
                                  </span>
                                ))}
                            </div>
                            {/* Arrow pointing down */}
                            <div className="absolute top-full left-3 w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Features */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Key Features
                  </h4>
                  <ul className="space-y-1">
                    {project.keyFeatures.slice(0, 3).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start text-sm text-gray-600"
                      >
                        <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Links */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-4">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    Code
                  </a>
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm"
                    >
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
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!userData?.projects || userData.projects.length === 0) && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Start building your portfolio by adding your first project.
              Showcase your skills and accomplishments to potential employers.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm cursor-pointer"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Your First Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
