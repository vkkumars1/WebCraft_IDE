import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
export const LogoutPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
   
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('isLoggedIn');
 
    onClose();
    toast.success('LoggedOut!', {   
      style: {
          borderRadius: '10px',
        
      },
  });

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Logout</h2>
        <p className="mb-4 dark:text-gray-300">Are you sure you want to logout?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
