import React, { useState } from 'react';
import axios from 'axios';

// Types
type Image = {
  url: string;
  caption: string;
};

type FormData = {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  status: 'Planning' | 'Under Construction' | 'Completed' | 'On Hold' | 'Cancelled';
  projectType: 'Residential' | 'Commercial' | 'Mixed-Use' | 'Industrial' | '';
  estimatedCompletionDate: string;
  totalUnits: string;
  priceMin: string;
  priceMax: string;
  features: string[];
  images: Image[];
};

const UploadProject = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    status: 'Planning',
    projectType: '',
    estimatedCompletionDate: '',
    totalUnits: '',
    priceMin: '',
    priceMax: '',
    features: [''],
    images: [{ url: '', caption: '' }],
  });

  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number,
    key?: keyof Image
  ) => {
    const { name, value } = e.target;

    if (name === 'features' && index !== undefined) {
      const updatedFeatures = [...formData.features];
      updatedFeatures[index] = value;
      setFormData(prev => ({ ...prev, features: updatedFeatures }));
    } else if (name === 'images' && index !== undefined && key) {
      const updatedImages = [...formData.images];
      updatedImages[index] = {
        ...updatedImages[index],
        [key]: value,
      };
      setFormData(prev => ({ ...prev, images: updatedImages }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const addImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, { url: '', caption: '' }] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      location: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
      },
      status: formData.status,
      projectType: formData.projectType,
      estimatedCompletionDate: formData.estimatedCompletionDate,
      totalUnits: parseInt(formData.totalUnits),
      priceRange: {
        min: parseFloat(formData.priceMin),
        max: parseFloat(formData.priceMax),
      },
      features: formData.features,
      images: formData.images,
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/projects/create`, payload);
      console.log('Project uploaded:', res.data);
      alert('Project uploaded successfully');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md space-y-4 my-12 mx-4">
      <h2 className="text-xl font-semibold mb-4">Upload Project</h2>

      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Project Name" required className="input" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Project Description" required className="textarea" />

      <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required className="input" />
      <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required className="input" />
      <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" required className="input" />

      <select name="status" value={formData.status} onChange={handleChange} className="input">
        <option>Planning</option>
        <option>Under Construction</option>
        <option>Completed</option>
        <option>On Hold</option>
        <option>Cancelled</option>
      </select>

      <select name="projectType" value={formData.projectType} onChange={handleChange} required className="input">
        <option value="">Select Project Type</option>
        <option>Residential</option>
        <option>Commercial</option>
        <option>Mixed-Use</option>
        <option>Industrial</option>
      </select>

      <input type="date" name="estimatedCompletionDate" value={formData.estimatedCompletionDate} onChange={handleChange} className="input" />
      <input type="number" name="totalUnits" value={formData.totalUnits} onChange={handleChange} placeholder="Total Units" className="input" />
      <input type="number" name="priceMin" value={formData.priceMin} onChange={handleChange} placeholder="Min Price" className="input" />
      <input type="number" name="priceMax" value={formData.priceMax} onChange={handleChange} placeholder="Max Price" className="input" />

      <div className="space-y-2">
        <label className="font-medium">Features</label>
        {formData.features.map((feat, i) => (
          <input key={i} type="text" name="features" value={feat} onChange={e => handleChange(e, i)} placeholder={`Feature ${i + 1}`} className="input" />
        ))}
        <button type="button" onClick={addFeature} className="text-blue-500">+ Add Feature</button>
      </div>

      <div className="space-y-2">
        <label className="font-medium">Images</label>
        {formData.images.map((img, i) => (
          <div key={i} className="space-y-1">
            <input
              type="text"
              name="images"
              value={img.url}
              onChange={e => handleChange(e, i, 'url')}
              placeholder="Image URL"
              className="input"
            />
            <input
              type="text"
              name="images"
              value={img.caption}
              onChange={e => handleChange(e, i, 'caption')}
              placeholder="Image Caption"
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addImage} className="text-blue-500">+ Add Image</button>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Upload Project
      </button>
    </form>
  );
};

export default UploadProject;
