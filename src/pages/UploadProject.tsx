import React, { useState } from "react";
import axios from "axios";

// Types
type Image = {
  file?: File;
  caption: string;
};

type FormData = {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status:
    | "Planning"
    | "Under Construction"
    | "Completed"
    | "On Hold"
    | "Cancelled";
  projectType: "Residential" | "Commercial" | "Mixed-Use" | "Industrial" | "";
  estimatedCompletionDate: string;
  totalUnits: string;
  priceMin: string;
  priceMax: string;
  features: string[];
  images: Image[];
};

const UploadProject = () => {
  const [formData, setFormData] = useState<FormData>({
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
    images: [{ file: undefined, caption: "" }],
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const API_BASE_URL = import.meta.env.VITE_APP_API_URL || "/api";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index?: number,
    key?: keyof Image,
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change

    if (name === "features" && index !== undefined) {
      const updatedFeatures = [...formData.features];
      updatedFeatures[index] = value;
      setFormData((prev) => ({ ...prev, features: updatedFeatures }));
    } else if (name === "images" && index !== undefined && key) {
      const updatedImages = [...formData.images];
      updatedImages[index] = { ...updatedImages[index], [key]: value };
      setFormData((prev) => ({ ...prev, images: updatedImages }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      const updatedImages = [...formData.images];
      updatedImages[index] = { ...updatedImages[index], file: files[0] };
      setFormData((prev) => ({ ...prev, images: updatedImages }));
    }
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { file: undefined, caption: "" }],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name) newErrors.name = "Project name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage("");
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("location[address]", formData.address);
    formDataToSend.append("location[city]", formData.city);
    formDataToSend.append("location[state]", formData.state);
    if (formData.zipCode)
      formDataToSend.append("location[zipCode]", formData.zipCode);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("projectType", formData.projectType);
    if (formData.estimatedCompletionDate)
      formDataToSend.append(
        "estimatedCompletionDate",
        formData.estimatedCompletionDate,
      );
    if (formData.totalUnits)
      formDataToSend.append("totalUnits", formData.totalUnits);
    if (formData.priceMin)
      formDataToSend.append("priceRange[min]", formData.priceMin);
    if (formData.priceMax)
      formDataToSend.append("priceRange[max]", formData.priceMax);
    formData.features.forEach((feature) => {
      if (feature) formDataToSend.append("features[]", feature);
    });
    formData.images.forEach((image) => {
      if (image.file) formDataToSend.append("images", image.file);
      if (image.caption)
        formDataToSend.append("imageCaptions[]", image.caption);
    });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/projects/create`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setSubmitMessage(res.data.message);
      setFormData({
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
        images: [{ file: undefined, caption: "" }],
      });
    } catch (err: any) {
      setSubmitMessage(
        `Error: ${err.response?.data?.error || "Something went wrong"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upload New Project
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 space-y-6"
      >
        {/* Submit Message */}
        {submitMessage && (
          <div
            className={`p-4 rounded ${
              submitMessage.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {submitMessage}
          </div>
        )}

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
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              className={`mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the project"
              className={`mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              rows={4}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className={`mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className={`mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                className={`mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
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
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              >
                <option value="Planning">Planning</option>
                <option value="Under Construction">Under Construction</option>
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
                value={formData.projectType}
                onChange={handleChange}
                className={`mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.projectType ? "border-red-500" : "border-gray-300"
                }`}
                required
              >
                <option value="">Select Project Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Mixed-Use">Mixed-Use</option>
                <option value="Industrial">Industrial</option>
              </select>
              {errors.projectType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.projectType}
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
                value={formData.estimatedCompletionDate}
                onChange={handleChange}
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
                value={formData.totalUnits}
                onChange={handleChange}
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
                value={formData.priceMin}
                onChange={handleChange}
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
                value={formData.priceMax}
                onChange={handleChange}
                placeholder="Enter max price"
                className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Features</h3>
          {formData.features.map((feat, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                name="features"
                value={feat}
                onChange={(e) => handleChange(e, i)}
                placeholder={`Feature ${i + 1} (e.g., Pool)`}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              />
              {formData.features.length > 1 && (
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
          <h3 className="text-lg font-semibold text-gray-700">Images</h3>
          {formData.images.map((img, i) => (
            <div key={i} className="space-y-2 border p-4 rounded bg-gray-50">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Image File
                </label>
                <input
                  type="file"
                  name="images"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleFileChange(e, i)}
                  className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                />
                {img.file && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {img.file.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Image Caption
                </label>
                <input
                  type="text"
                  name="images"
                  value={img.caption}
                  onChange={(e) => handleChange(e, i, "caption")}
                  placeholder="Enter image caption"
                  className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                />
              </div>
              {formData.images.length > 1 && (
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
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-3 rounded font-medium text-white ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Uploading..." : "Upload Project"}
        </button>
      </form>
    </div>
  );
};

export default UploadProject;
