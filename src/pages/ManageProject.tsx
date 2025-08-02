import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import {
  FaMapMarkerAlt,
  FaStar,
  FaBuilding,
  FaTimes,
  FaFileAlt,
  FaCalendarAlt,
  FaHome,
  FaDollarSign,
} from "react-icons/fa";

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  projectType: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  estimatedCompletionDate?: string;
  totalUnits?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  features: string[];
  images: {
    url: string;
    caption: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

const ManageProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    caption: string;
    _id: string;
  } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    status: "Planning" as
      | "Planning"
      | "Under Construction"
      | "Completed"
      | "On Hold"
      | "Cancelled",
    projectType: "" as
      | "Residential"
      | "Commercial"
      | "Mixed-Use"
      | "Industrial"
      | "",
    estimatedCompletionDate: "",
    totalUnits: "",
    priceMin: "",
    priceMax: "",
    features: [""],
    images: [] as Array<{
      file?: File;
      caption: string;
      url?: string;
      _id?: string;
      isExisting?: boolean;
    }>,
  });
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/v1/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data.data || []);
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        setError(error.response?.data?.message || "Failed to fetch projects");
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/projects/${id}`);
      setProjects((prev) => prev.filter((proj) => proj._id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setSelectedImage(null);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setEditFormData({
      name: project.name,
      description: project.description,
      address: project.location.address,
      city: project.location.city,
      state: project.location.state,
      zipCode: project.location.zipCode || "",
      status: project.status as any,
      projectType: project.projectType as any,
      estimatedCompletionDate: project.estimatedCompletionDate
        ? new Date(project.estimatedCompletionDate).toISOString().split("T")[0]
        : "",
      totalUnits: project.totalUnits ? project.totalUnits.toString() : "",
      priceMin: project.priceRange?.min
        ? project.priceRange.min.toString()
        : "",
      priceMax: project.priceRange?.max
        ? project.priceRange.max.toString()
        : "",
      features: project.features.length > 0 ? project.features : [""],
      images: project.images.map((img) => ({
        url: img.url,
        caption: img.caption,
        _id: img._id,
        isExisting: true,
      })),
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProject(null);
    setEditFormData({
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      status: "Planning",
      projectType: "",
      estimatedCompletionDate: "",
      totalUnits: "",
      priceMin: "",
      priceMax: "",
      features: [""],
      images: [],
    });
    setEditErrors({});
    setSubmitMessage("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index?: number,
  ) => {
    const { name, value } = e.target;
    setEditErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "features" && index !== undefined) {
      const updatedFeatures = [...editFormData.features];
      updatedFeatures[index] = value;
      setEditFormData((prev) => ({ ...prev, features: updatedFeatures }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addFeature = () => {
    setEditFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index: number) => {
    setEditFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleEditImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      const updatedImages = [...editFormData.images];
      updatedImages[index] = { ...updatedImages[index], file: files[0] };
      setEditFormData((prev) => ({ ...prev, images: updatedImages }));
    }
  };

  const addImage = () => {
    setEditFormData((prev) => ({
      ...prev,
      images: [...prev.images, { file: undefined, caption: "" }],
    }));
  };

  const removeImage = (index: number) => {
    setEditFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateEditForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!editFormData.name) newErrors.name = "Project name is required";
    if (!editFormData.description)
      newErrors.description = "Description is required";
    if (!editFormData.address) newErrors.address = "Address is required";
    if (!editFormData.city) newErrors.city = "City is required";
    if (!editFormData.state) newErrors.state = "State is required";
    return newErrors;
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage("");
    setIsSubmitting(true);

    const validationErrors = validateEditForm();
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    if (!editingProject) {
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", editFormData.name);
    formDataToSend.append("description", editFormData.description);
    formDataToSend.append("location[address]", editFormData.address);
    formDataToSend.append("location[city]", editFormData.city);
    formDataToSend.append("location[state]", editFormData.state);
    if (editFormData.zipCode)
      formDataToSend.append("location[zipCode]", editFormData.zipCode);
    formDataToSend.append("status", editFormData.status);
    formDataToSend.append("projectType", editFormData.projectType);
    if (editFormData.estimatedCompletionDate)
      formDataToSend.append(
        "estimatedCompletionDate",
        editFormData.estimatedCompletionDate,
      );
    if (editFormData.totalUnits)
      formDataToSend.append("totalUnits", editFormData.totalUnits);
    if (editFormData.priceMin)
      formDataToSend.append("priceRange[min]", editFormData.priceMin);
    if (editFormData.priceMax)
      formDataToSend.append("priceRange[max]", editFormData.priceMax);
    editFormData.features.forEach((feature) => {
      if (feature) formDataToSend.append("features[]", feature);
    });

    // Handle images
    editFormData.images.forEach((image) => {
      if (image.file) {
        formDataToSend.append("images", image.file);
        if (image.caption)
          formDataToSend.append("imageCaptions[]", image.caption);
      } else if (image.isExisting && image._id) {
        // Keep existing image
        formDataToSend.append("existingImages[]", image._id);
        if (image.caption)
          formDataToSend.append("existingImageCaptions[]", image.caption);
      }
    });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/projects/${editingProject._id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setSubmitMessage("Project updated successfully!");

      // Debug: Log the response to see the structure
      console.log("API Response:", response.data);

      // Update the projects list with the updated project
      const updatedProject = response.data.data;

      // Ensure images have the correct structure
      if (updatedProject.images) {
        updatedProject.images = updatedProject.images.map((img: any) => ({
          url: img.url || img.path || img,
          caption: img.caption || "",
          _id: img._id || img.id || "",
        }));
      }

      setProjects((prev) =>
        prev.map((project) =>
          project._id === editingProject._id
            ? { ...project, ...updatedProject }
            : project,
        ),
      );

      setTimeout(() => {
        closeEditModal();
      }, 2000);
    } catch (err: any) {
      console.error("Error updating project", err);
      setSubmitMessage(
        `Error: ${err.response?.data?.error || "Something went wrong"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Projects</h2>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                id={project._id}
                className="border rounded-lg p-4 shadow-sm"
              >
                <img
                  src={
                    project.images && project.images.length > 0
                      ? `${project.images[0].url.replace(/\\\\/g, "/")}`
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={project.name}
                  className="h-40 w-full object-cover rounded mb-2"
                />
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <p className="text-sm text-gray-600">{project.projectType}</p>
                <p className="text-xs text-gray-500 mb-2">{project.status}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => openModal(project)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openEditModal(project)}
                    className="text-yellow-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No projects found.</p>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Modal for viewing project */}
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-2 sm:p-4">
          <Dialog.Panel className="bg-white rounded-2xl w-full max-w-7xl h-[95vh] sm:h-[90vh] overflow-hidden shadow-2xl">
            {/* Header with Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={closeModal}
                className="bg-white/90 backdrop-blur-sm text-gray-700 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                aria-label="Close modal"
              >
                <FaTimes className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </div>
            {/* Mobile Layout - Column */}
            <div className="flex flex-col h-full lg:hidden">
              {/* Hero Image Section */}
              <div className="relative h-64 sm:h-80">
                <img
                  src={`${selectedProject?.images[0]?.url}`}
                  alt={selectedProject?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Project Info Overlay - Simplified */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <span className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                      {selectedProject?.projectType}
                    </span>
                    <span className="px-2 py-1 sm:px-3 sm:py-1 bg-green-500/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                      {selectedProject?.status}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {selectedProject?.name}
                  </h2>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Description Section */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <FaFileAlt className="text-purple-600 text-lg sm:text-xl" />
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      About This Project
                    </h3>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-purple-100">
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                      {selectedProject?.description}
                    </p>
                  </div>
                </div>

                {/* Location Section */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <FaMapMarkerAlt className="text-blue-600 text-lg sm:text-xl" />
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Location
                    </h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                    <p className="text-gray-700 text-base sm:text-lg">
                      {`${selectedProject?.location.address}, ${selectedProject?.location.city}, ${selectedProject?.location.state}`}
                    </p>
                  </div>
                </div>

                {/* Project Details */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Project Details
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Project Type */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <FaBuilding className="text-blue-600 text-lg sm:text-xl" />
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                          Project Type
                        </h4>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">
                        {selectedProject?.projectType}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <FaStar className="text-green-600 text-lg sm:text-xl" />
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                          Status
                        </h4>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        {selectedProject?.status}
                      </p>
                    </div>

                    {/* Estimated Completion Date */}
                    {selectedProject?.estimatedCompletionDate && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-yellow-100">
                        <div className="flex items-center gap-3 mb-2">
                          <FaCalendarAlt className="text-yellow-600 text-lg sm:text-xl" />
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                            Estimated Completion
                          </h4>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                          {formatDate(selectedProject.estimatedCompletionDate)}
                        </p>
                      </div>
                    )}

                    {/* Total Units */}
                    {selectedProject?.totalUnits && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <FaHome className="text-purple-600 text-lg sm:text-xl" />
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                            Total Units
                          </h4>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-purple-600">
                          {selectedProject.totalUnits.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Price Range */}
                    {selectedProject?.priceRange && (
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 sm:p-6 border border-emerald-100">
                        <div className="flex items-center gap-3 mb-2">
                          <FaDollarSign className="text-emerald-600 text-lg sm:text-xl" />
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                            Price Range
                          </h4>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-emerald-600">
                          ${selectedProject.priceRange.min.toLocaleString()} - $
                          {selectedProject.priceRange.max.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Features */}
                    {selectedProject?.features &&
                      selectedProject.features.length > 0 && (
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-indigo-100">
                          <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <FaBuilding className="text-indigo-600 text-lg sm:text-xl" />
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                              Features
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.features.map((feature, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 sm:px-3 sm:py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-medium"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Image Gallery */}
                {selectedProject?.images &&
                  selectedProject.images.length > 1 && (
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                        Gallery
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {selectedProject.images.slice(1).map((image, index) => (
                          <div
                            key={image._id}
                            className="relative cursor-pointer group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={() => setSelectedImage(image)}
                          >
                            <img
                              src={`${image.url}`}
                              alt={
                                image.caption || `Project image ${index + 2}`
                              }
                              className="h-24 sm:h-32 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                            {image.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-3">
                                <p className="text-white text-xs sm:text-sm font-medium truncate">
                                  {image.caption}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Project Timeline */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Project Timeline
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">
                          {formatDate(selectedProject?.createdAt || "")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">
                          {formatDate(selectedProject?.updatedAt || "")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout - Row */}
            <div className="hidden lg:flex h-full">
              {/* Left Side - Hero Image */}
              <div className="w-1/2 relative">
                <img
                  src={`${selectedProject?.images[0]?.url}`}
                  alt={selectedProject?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Project Info Overlay - Simplified */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm rounded-full text-sm font-medium">
                      {selectedProject?.projectType}
                    </span>
                    <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm rounded-full text-sm font-medium">
                      {selectedProject?.status}
                    </span>
                  </div>
                  <h2 className="text-4xl font-bold">
                    {selectedProject?.name}
                  </h2>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="w-1/2 flex flex-col">
                <div className="flex-1 overflow-y-auto p-8">
                  {/* Description Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <FaFileAlt className="text-purple-600 text-xl" />
                      <h3 className="text-2xl font-bold text-gray-900">
                        About This Project
                      </h3>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {selectedProject?.description}
                      </p>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <FaMapMarkerAlt className="text-blue-600 text-xl" />
                      <h3 className="text-2xl font-bold text-gray-900">
                        Location
                      </h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <p className="text-gray-700 text-lg">
                        {`${selectedProject?.location.address}, ${selectedProject?.location.city}, ${selectedProject?.location.state}`}
                      </p>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Project Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Project Type */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <FaBuilding className="text-blue-600 text-xl" />
                          <h4 className="text-lg font-semibold text-gray-900">
                            Project Type
                          </h4>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                          {selectedProject?.projectType}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                        <div className="flex items-center gap-3 mb-2">
                          <FaStar className="text-green-600 text-xl" />
                          <h4 className="text-lg font-semibold text-gray-900">
                            Status
                          </h4>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                          {selectedProject?.status}
                        </p>
                      </div>

                      {/* Estimated Completion Date */}
                      {selectedProject?.estimatedCompletionDate && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
                          <div className="flex items-center gap-3 mb-2">
                            <FaCalendarAlt className="text-yellow-600 text-xl" />
                            <h4 className="text-lg font-semibold text-gray-900">
                              Estimated Completion
                            </h4>
                          </div>
                          <p className="text-2xl font-bold text-yellow-600">
                            {formatDate(
                              selectedProject.estimatedCompletionDate,
                            )}
                          </p>
                        </div>
                      )}

                      {/* Total Units */}
                      {selectedProject?.totalUnits && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                          <div className="flex items-center gap-3 mb-2">
                            <FaHome className="text-purple-600 text-xl" />
                            <h4 className="text-lg font-semibold text-gray-900">
                              Total Units
                            </h4>
                          </div>
                          <p className="text-2xl font-bold text-purple-600">
                            {selectedProject.totalUnits.toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Price Range */}
                      {selectedProject?.priceRange && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                          <div className="flex items-center gap-3 mb-2">
                            <FaDollarSign className="text-emerald-600 text-xl" />
                            <h4 className="text-lg font-semibold text-gray-900">
                              Price Range
                            </h4>
                          </div>
                          <p className="text-2xl font-bold text-emerald-600">
                            ${selectedProject.priceRange.min.toLocaleString()} -
                            ${selectedProject.priceRange.max.toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Features */}
                      {selectedProject?.features &&
                        selectedProject.features.length > 0 && (
                          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                            <div className="flex items-center gap-3 mb-4">
                              <FaBuilding className="text-indigo-600 text-xl" />
                              <h4 className="text-lg font-semibold text-gray-900">
                                Features
                              </h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.features.map(
                                (feature, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                                  >
                                    {feature}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Image Gallery */}
                  {selectedProject?.images &&
                    selectedProject.images.length > 1 && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                          Gallery
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedProject.images
                            .slice(1)
                            .map((image, index) => (
                              <div
                                key={image._id}
                                className="relative cursor-pointer group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => setSelectedImage(image)}
                              >
                                <img
                                  src={`${image.url}`}
                                  alt={
                                    image.caption ||
                                    `Project image ${index + 2}`
                                  }
                                  className="h-32 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                                {image.caption && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                    <p className="text-white text-sm font-medium truncate">
                                      {image.caption}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Project Timeline */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Project Timeline
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">
                            {formatDate(selectedProject?.createdAt || "")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="font-medium">
                            {formatDate(selectedProject?.updatedAt || "")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Image Sub-Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-60 p-2 sm:p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="relative">
              <img
                src={`${selectedImage.url}`}
                alt={selectedImage.caption}
                className="w-full max-h-[70vh] object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm text-gray-700 w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
                aria-label="Close image modal"
              >
                <FaTimes className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </div>
            {selectedImage.caption && (
              <div className="p-4 sm:p-6 bg-gray-50">
                <p className="text-center text-gray-700 text-base sm:text-lg font-medium">
                  {selectedImage.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={closeEditModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Project
                </h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>

              {/* Submit Message */}
              {submitMessage && (
                <div
                  className={`p-4 rounded mb-6 ${
                    submitMessage.includes("successfully")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-6">
                {/* Project Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Project Details
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Project Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      placeholder="Enter project name"
                      className={`mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        editErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {editErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {editErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      placeholder="Describe the project"
                      className={`mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        editErrors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      rows={4}
                      required
                    />
                    {editErrors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {editErrors.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Location
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={editFormData.address}
                        onChange={handleEditChange}
                        placeholder="Enter address"
                        className={`mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          editErrors.address
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        required
                      />
                      {editErrors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {editErrors.address}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={editFormData.city}
                        onChange={handleEditChange}
                        placeholder="Enter city"
                        className={`mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          editErrors.city ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                      {editErrors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {editErrors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={editFormData.state}
                        onChange={handleEditChange}
                        placeholder="Enter state"
                        className={`mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          editErrors.state
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        required
                      />
                      {editErrors.state && (
                        <p className="text-red-500 text-sm mt-1">
                          {editErrors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={editFormData.zipCode}
                        onChange={handleEditChange}
                        placeholder="Enter zip code"
                        className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Status
                      </label>
                      <select
                        name="status"
                        value={editFormData.status}
                        onChange={handleEditChange}
                        className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                      >
                        <option value="Planning">Planning</option>
                        <option value="Under Construction">
                          Under Construction
                        </option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Project Type
                      </label>
                      <select
                        name="projectType"
                        value={editFormData.projectType}
                        onChange={handleEditChange}
                        className={`mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          editErrors.projectType
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        required
                      >
                        <option value="">Select Project Type</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Mixed-Use">Mixed-Use</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                      {editErrors.projectType && (
                        <p className="text-red-500 text-sm mt-1">
                          {editErrors.projectType}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Estimated Completion Date
                      </label>
                      <input
                        type="date"
                        name="estimatedCompletionDate"
                        value={editFormData.estimatedCompletionDate}
                        onChange={handleEditChange}
                        className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Total Units
                      </label>
                      <input
                        type="number"
                        name="totalUnits"
                        value={editFormData.totalUnits}
                        onChange={handleEditChange}
                        placeholder="Enter total units"
                        className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Min Price
                      </label>
                      <input
                        type="number"
                        name="priceMin"
                        value={editFormData.priceMin}
                        onChange={handleEditChange}
                        placeholder="Enter min price"
                        className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Max Price
                      </label>
                      <input
                        type="number"
                        name="priceMax"
                        value={editFormData.priceMax}
                        onChange={handleEditChange}
                        placeholder="Enter max price"
                        className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Features
                  </h3>
                  {editFormData.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        name="features"
                        value={feat}
                        onChange={(e) => handleEditChange(e, i)}
                        placeholder={`Feature ${i + 1} (e.g., Pool)`}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                      />
                      {editFormData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    + Add Feature
                  </button>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Images
                  </h3>
                  {editFormData.images.map((img, i) => (
                    <div
                      key={i}
                      className="space-y-2 border p-4 rounded bg-gray-50"
                    >
                      {img.isExisting && img.url ? (
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Current Image
                          </label>
                          <img
                            src={`${img.url}`}
                            alt={img.caption}
                            className="h-32 w-32 object-cover rounded border"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Image File
                          </label>
                          <input
                            type="file"
                            name="images"
                            accept="image/jpeg,image/png"
                            onChange={(e) => handleEditImageChange(e, i)}
                            className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                          />
                          {img.file && (
                            <p className="text-sm text-gray-500 mt-1">
                              Selected: {img.file.name}
                            </p>
                          )}
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Image Caption
                        </label>
                        <input
                          type="text"
                          name="images"
                          value={img.caption}
                          onChange={(e) => handleEditChange(e, i)}
                          placeholder="Enter image caption"
                          className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                        />
                      </div>
                      {editFormData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImage}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    + Add Image
                  </button>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 p-3 rounded font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 p-3 rounded font-medium text-white ${
                      isSubmitting
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "Updating..." : "Update Project"}
                  </button>
                </div>
              </form>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ManageProjects;
