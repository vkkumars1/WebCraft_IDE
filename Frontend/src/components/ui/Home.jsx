import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Search, Plus, Trash2, LogOut, X, ArrowLeft } from 'lucide-react';
import { UserContext } from '../../Context/contextApi';
import axios from 'axios';
import { baseURL } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { LogoutPopup } from './LogoutPopup';
import toast, { Toaster } from 'react-hot-toast';

function Avatar({ initials }) {
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
      {initials}
    </div>
  );
}

function LogoutButton({ mobile = false }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${
        mobile
          ? 'text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
      } transition duration-300 flex items-center gap-2`}
    >
      <LogOut className="h-5 w-5" />
      {mobile && 'Logout'}
    </motion.button>
  );
}

function ProjectCard({ project, isDarkMode, isActive = false, onDelete }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/editor/${project._id}`);
    window.location.reload();  // This reloads the page
  };
  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };
  return (
    <div
      onClick={handleClick}
      className={`p-4 rounded-lg border ${
        isDarkMode
          ? isActive
            ? 'bg-gray-800 border-gray-700'
            : 'bg-gray-900 border-gray-800'
          : isActive
          ? 'bg-gray-200 border-gray-300'
          : 'bg-white border-gray-200'
      } shadow-lg transition duration-300 hover:shadow-xl cursor-pointer hover:bg-opacity-80`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatDate(project.createdAt)} {/* Updated to use the formatDate function */}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full transition duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project._id);
          }}
        >
          <Trash2
            className={`h-5 w-5 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400 hover:text-red-500' : 'text-gray-600 hover:text-red-600'
            }`}
          />
        </motion.button>
      </div>
    </div>
  );
}

function CreateProjectModal({ isOpen, onClose }) {
  const [projectTitle, setProjectTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = JSON.parse(localStorage.getItem("userId"));
      

      if (!userId) {
        console.log("userId not found");
        return;
      }

      const response = await axios.post(
        `${baseURL}/create/project`,
        {
          userId,
          title: projectTitle,
        },
        { withCredentials: true }
      );
      toast.success('File Created!', {
        style: {
          borderRadius: '10px',
          padding: '16px',
        },
        duration: 3000, // Duration in milliseconds (3000ms = 3 seconds)
      });
  
      setTimeout(() => {
        window.location.href = `/editor/${response.data.newProject.id}`;
      }, 1000);

      setProjectTitle('');
      console.log("Project created successfully:", response.data);
    } catch (err) {
      
      console.error("Error:", err.response?.data || err.message);
    } 
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Create New Project
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Project Title"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
function DeleteProjectModal({ isOpen, onClose, onConfirmDelete }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Delete Project</h2>
            <p className="mb-4 dark:text-gray-300">Are you sure you want to delete this project?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-300"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [initial, setInitial] = useState('');
  const { userData } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  function LogoutButton({ mobile = false }) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${
          mobile
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
        } transition duration-300 flex items-center gap-2`}
        onClick={() => setIsLogoutPopupOpen(true)}
      >
        <LogOut className="h-5 w-5" />
        {mobile && 'Logout'}
      </motion.button>
    );
  }
  const navigate = useNavigate();
  const formatDate = (date) => {
    if (!date) {
      const now = new Date();
      return `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.getFullYear()} ${now.toLocaleString('default', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      const now = new Date();
      return `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.getFullYear()} ${now.toLocaleString('default', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()} ${d.toLocaleString('default', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getProjects = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId"));
      
      if (!userId) {
        console.log("userId not found");
        return;
      }

      const response = await axios.post(
        `${baseURL}/create/getProjects`,
        { userId },
        { withCredentials: true }
      );
      
      setProjects(response.data.projects);
      setFilteredProjects(response.data.projects);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
    } 
  };

  useEffect(() => {
    getProjects();
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setInitial(storedName.charAt(1).toUpperCase());
    }
  }, []);

  useEffect(() => {
    const filtered = projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleCreateProject = async (title) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId"));
      
      if (!userId) {
        console.log("userId not found");
        return;
      }

      const response = await axios.post(
        `${baseURL}/create/project`,
        {
          userId,
          title: title,
        },
        { withCredentials: true }
      );

      setProjects(prevProjects => [...prevProjects, response.data.newProject]);
      setFilteredProjects(prevProjects => [...prevProjects, response.data.newProject]);
      setIsCreateModalOpen(false);

      // Show success toast
      toast.success('File Created!', {   
        style: {
            borderRadius: '10px',
          
        },
    });
      setTimeout(() => {
       
        navigate(`/editor/${response.data.newProject._id}`);
      }, 2000);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
    }
  };

  const handleDeleteProject = (projId) => {
    setProjectToDelete(projId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProject = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId"));
  
      if (!userId) {
        console.log("userId not found");
        return;
      }
  
      await axios.post(
        `${baseURL}/create/delProjects`,
        { userId, projId: projectToDelete },
        { withCredentials: true }
      );
  
      setProjects(prevProjects => prevProjects.filter(project => project._id !== projectToDelete));
      setFilteredProjects(prevProjects => prevProjects.filter(project => project._id !== projectToDelete));
      setIsDeleteModalOpen(false);
      toast.success('File Deleted!', {
        style: {
          borderRadius: '10px',
          padding: '16px',
        },
        duration: 3000, // Duration in milliseconds (3000ms = 3 seconds)
      });
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
    }
  };
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
       <Toaster position="top-center" reverseOrder={false} />
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                  <motion.span
                    initial={{ display: 'inline-block' }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ delay: 1, duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
                    className="text-indigo-400"
                  >
                    WebCraft
                  </motion.span>{' '}
                  <motion.span
                    initial={{ display: 'inline-block', opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-indigo-200"
                  >
                    IDE
                  </motion.span>
                </h1>
              </motion.div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <LogoutButton />
              <button
                onClick={toggleDarkMode}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Avatar initials={initial} />
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open user menu</span>
                <Avatar initials={initial} />
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <LogoutButton mobile />
              <button
                onClick={toggleDarkMode}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center gap-2"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
        <motion.h2
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="text-2xl font-semibold mb-4"
>
  <motion.span
    initial={{ display: 'inline-block' }}
    animate={{ rotate: [0, 20, -20, 10, -10, 0] }}
    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
    style={{ display: 'inline-block', transformOrigin: '70% 70%' }} // Sets a better pivot point for waving
  >
    👋
  </motion.span>{' '}
  Hi, {userData}
</motion.h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search your projects"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-300 focus:outline-none focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
            <button
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              New Project
            </button>
          </div>
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                isDarkMode={isDarkMode}
                isActive={project.isActive}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        </div>
      </main>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={confirmDeleteProject}
      />
       <LogoutPopup
        isOpen={isLogoutPopupOpen}
        onClose={() => setIsLogoutPopupOpen(false)}
      />
      
    </div>
  );
}