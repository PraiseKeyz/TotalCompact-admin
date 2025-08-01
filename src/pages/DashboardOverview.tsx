import { useEffect, useState } from "react";
import { ArchiveIcon, UploadIcon, TrashIcon } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

// Dummy data
const recentProjects = [
  {
    id: 1,
    title: "Modern Portfolio UI",
    uploadedAt: "2025-07-28",
    thumbnail: "https://via.placeholder.com/80x60",
  },
  {
    id: 2,
    title: "Business Logo Set",
    uploadedAt: "2025-07-27",
    thumbnail: "https://via.placeholder.com/80x60",
  },
];



const DashboardOverview = () => {
  const [totalProjects, setTotalProjects] = useState("");
  const [recentUploads, setRecentUploads] = useState("");
  const [deletedProjects, setDeletedProjects] = useState("");

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
        const data = response.data.data
        setTotalProjects(data.length);
        setDeletedProjects("3")
        const now = new Date();
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

const recentUploadsCount = data.filter((post: any) => {
  const createdDate = new Date(post.createdAt);
  return createdDate > oneDayAgo;
}).length;
setRecentUploads(recentUploadsCount)
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchProject();
  }, [])

  return (
    <div className="py-6 px-4 lg:px-16 space-y-10">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard title="Total Projects" value={totalProjects} icon={<ArchiveIcon className="w-full h-6" />} />
        <SummaryCard title="Recent Uploads" value={recentUploads} icon={<UploadIcon className="w-full h-6" />} />
        <SummaryCard title="Deleted Projects" value={deletedProjects} icon={<TrashIcon className="w-full h-6" />} />
      </div>

      {/* Recent Projects */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <div key={project.id} className="flex items-center gap-4 p-4 bg-white rounded shadow">
              <img src={project.thumbnail} alt={project.title} className="w-20 h-16 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-gray-500">Uploaded: {project.uploadedAt}</p>
              </div>
              <Link
                to={`/dashboard/manage/${project.id}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Manage
              </Link>
            </div>
          ))}
        </div>
      </div>


      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-6">
        <Link
          to="/dashboard/upload"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload New Project
        </Link>
        <Link
          to="/dashboard/manage"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Manage Projects
        </Link>
      </div>
    </div>
  );
};

export default DashboardOverview;

// Reusable Card
const SummaryCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
    <div className="p-3 rounded-full bg-blue-100 text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-lg font-bold">{value}</h3>
    </div>
  </div>
);
