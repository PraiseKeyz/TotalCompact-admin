import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import axios from 'axios';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState<any>(null);


  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

  const isActiveRoute = (path: string) => {
    return location.pathname === path ? 'bg-tertiary text-white' : 'text-gray-300 hover:bg-tertiary/90 hover:text-white';
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [])


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 p-4 z-30">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`p-2 bg-white rounded-lg shadow-md ${isSidebarOpen? 'hidden' : 'block'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#263238]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black-100 bg-opacity-100 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-primary z-40
          transition-transform duration-300 ease-in-out
          ${isMobile ? 'w-64' : (isSidebarOpen ? 'w-64' : 'w-20')}
          ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className={`text-white font-bold ${!isSidebarOpen && !isMobile ? 'hidden' : 'block'}`}>
            Total Compact Admin
          </h1>
          {isSidebarOpen && isMobile && (
            <button onClick={() => setIsSidebarOpen(false)}  className="text-tertiary p-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 text-tertiary w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {!isMobile && (
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2">
              {isSidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </button>
          )}
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {[
  { path: '/dashboard', name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/dashboard/upload', name: 'Upload', icon: 'M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4m0 0L8 8m4-4v12' },
  { path: '/dashboard/manage', name: 'Manage', icon: 'M13.615 4.385a1 1 0 011.77 0l1.414 2.828a1 1 0 00.894.554h2.828a1 1 0 010 2h-2.828a1 1 0 00-.894.554l-1.414 2.828a1 1 0 01-1.77 0l-1.414-2.828a1 1 0 00-.894-.554h-2.828a1 1 0 010-2h2.828a1 1 0 00.894-.554l1.414-2.828z' }
].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${isActiveRoute(item.path)}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {(isSidebarOpen || isMobile) && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`
        transition-all duration-300
        ${isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-64' : 'ml-20')}
      `}>
        {/* Header */}
        <div className={`
          fixed top-0 right-0 bg-white border-b border-gray-200 h-16
          transition-all duration-300
          ${isMobile ? 'left-0' : (isSidebarOpen ? 'left-64' : 'left-20')} // Dynamically sets left offset
          ${isMobile ? 'pl-16 pr-4 sm:pr-6' : 'px-8'} // Dynamically sets padding: more left padding on mobile to clear menu icon, less right padding for content space. Desktop uses symmetrical padding.
          flex items-center justify-between z-20
        `}>
          <div className="flex items-center space-x-4">
            {/* Added optional chaining for user properties */}
            <h2 className="text-xl font-semibold text-[#263238] truncate">Welcome, {user?.name}</h2>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4"> {/* Adjusted spacing for smaller screens */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            {/* Added optional chaining for user properties */}
            <div className="h-8 w-8 rounded-full bg-tertiary flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-[#E53935] transition-colors flex-shrink-0">
              {user?.name?.[0]}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="pt-16">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;