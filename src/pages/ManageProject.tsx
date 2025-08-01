import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";

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
  };
  images: {
    url: string;
    _id: string;
  }[];
  createdAt: string;
}

const ManageProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/v1/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchProject();
  }, [])

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
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="border rounded-lg p-4 shadow-sm">
            <img
              src={`${API_BASE_URL}/${project.images[0]?.url.replace(/\\/g, '/')}`}
              alt={project.name}
              crossOrigin="anonymous"
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
                onClick={() => {
                  // You'll programmatically navigate to the Upload/Edit page with this data
                  localStorage.setItem("editProject", JSON.stringify(project));
                  window.location.href = "/dashboard/upload"; // Adjust if using router
                }}
                className="text-yellow-600 hover:underline text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for viewing project */}
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg bg-white rounded p-6">
            <Dialog.Title className="text-xl font-semibold mb-2">
              {selectedProject?.name}
            </Dialog.Title>
            <p className="text-gray-600">{selectedProject?.description}</p>
            <div className="mt-4">
              <strong>Location:</strong>
              <p>{selectedProject?.location.address}, {selectedProject?.location.city}, {selectedProject?.location.state}</p>
            </div>
            <div className="mt-2">
              <strong>Status:</strong> {selectedProject?.status}
            </div>
            <div className="mt-2">
              <strong>Type:</strong> {selectedProject?.projectType}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {selectedProject?.images.map((img) => (
                <img
                  key={img._id}
                  src={`http://localhost:3000/${img.url.replace("\\", "/")}`}
                  crossOrigin="anonymous"
                  alt="project"
                  className="rounded object-cover h-32 w-full"
                />
              ))}
            </div>
            <button onClick={closeModal} className="mt-6 px-4 py-2 bg-gray-700 text-white rounded">
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ManageProjects;
