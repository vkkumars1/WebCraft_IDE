import React, { useState, useEffect,useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from "@monaco-editor/react";
import { Sun, Moon, Download, Home, Menu, X, Save } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../utils/constant';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import toast, { Toaster } from 'react-hot-toast';
const defaultCode = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebCraft IDE</title>
</head>
<body>
  <div class="hello">Hello, WebCraft IDE!</div>
  <button onclick="alert('Hello from WebCraft IDE!')">Click Me</button>
</body>
</html>
`,
  css: `
body { 
  font-family: Arial, sans-serif; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #f0f0f0;
}
.hello {
  font-size: 24px;
  color: #333;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #007BFF;
  color: white;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}`,
  js: `
console.log("Welcome to WebCraft IDE!");
`
};
export default function WebCraftIDE() {
  const [activeTab, setActiveTab] = useState('html');
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // If it's part of state
  const [projectTitle, setProjectTitle] = useState('');
  const iframeRef = useRef(null);
  // Generate combined output for iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const document = iframe.contentDocument || iframe.contentWindow.document;
      const combinedCode = `
        <html>
          <head>
            <style>${code.css}</style>
          </head>
          <body>
            ${code.html}
            <script>${code.js}<\/script>
          </body>
        </html>
      `;
      document.open();
      document.write(combinedCode);
      document.close();
    }
  }, [code]);

  let { id } = useParams();
  const handleSave = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId"));
      if (!userId) {
        console.error("userId not found");
        return;
      }

      const response = await axios.post(
        `${baseURL}/create/updateCode`,
        { userId, projId: id, html: code.html, css: code.css, js: code.js },
        { withCredentials: true }
      );
      toast.success('File Saved!', {
        style: {
          borderRadius: '10px',
          padding: '16px',
        },
        duration: 3000, // Duration in milliseconds (3000ms = 3 seconds)
      });
      console.log("Project Saved Successfully:", response.data.project);
     
      // You might want to add a visual feedback here, like a toast notification
    } catch (err) {
      console.error("Error saving project:", err.response?.data || err.message);
      // You might want to add an error notification here
    }
  };


  // Fetch existing code for the project
  useEffect(() => {
    const fetchCode = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("userId"));
        if (!userId) {
          console.error("userId not found");
          return;
        }

        const response = await axios.post(
          `${baseURL}/create/getCode`,
          { userId, projId: id },
          { withCredentials: true }
        );

        setCode({
          html: response.data.project.html || defaultCode.html,
          css: response.data.project.css || defaultCode.css,
          js: response.data.project.js || defaultCode.js,
        });
        setProjectTitle(response.data.project.title || 'Untitled');
      } catch (err) {
        console.error("Error fetching code:", err.response?.data || err.message);
      }
    };

    fetchCode();
  }, [id]);
  
  useEffect(() => {
    const combinedOutput = `
      <html>
        <head>
          <style>${code.css}</style>
        </head>
        <body>
          ${code.html}
          <script>${code.js}</script>
        </body>
      </html>
    `;
    setOutput(combinedOutput);
  }, [code]);

  // Save the project on `Ctrl + S`
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        try {
          const userId = JSON.parse(localStorage.getItem("userId"));
          if (!userId) {
            console.error("userId not found");
            return;
          }

          const response = await axios.post(
            `${baseURL}/create/updateCode`,
            { userId, projId: id, html: code.html, css: code.css, js: code.js },
            { withCredentials: true }
          );
          
          toast.success('File Saved!', {
            style: {
              borderRadius: '10px',
              padding: '16px',
            },
            duration: 3000, // Duration in milliseconds (3000ms = 3 seconds)
          });
          console.log("Project Updated Successfully:", response.data.project);
        } catch (err) {
          console.error("Error saving project:", err.response?.data || err.message);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [code, id]);

  // Update the code state when the editor changes
  const handleEditorChange = (value) => {
    setCode((prevCode) => ({
      ...prevCode,
      [activeTab]: value || '',
    }));
  };
  
    const handleDownload = () => {
      const zip = new JSZip();
  
      // Add HTML file
      zip.file("index.html", code.html);
  
      // Add CSS file
      zip.file("styles.css", code.css);
  
      // Add JavaScript file
      zip.file("script.js", code.js);
  
      // Generate zip file
      zip.generateAsync({ type: "blob" })
        .then(function (content) {
          // Save the zip file
          FileSaver.saveAs(content, `${projectTitle || 'webcraft-project'}.zip`);
        });
    };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
       <Toaster position="top-center" reverseOrder={false} />
      <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-2xl sm:text-4xl font-extrabold">
                  <motion.span
                    initial={{ display: 'inline-block' }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ delay: 1, duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
                    className="text-indigo-500"
                  >
                    WebCraft
                  </motion.span>{' '}
                  <motion.span
                    initial={{ display: 'inline-block', opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className={isDarkMode ? "text-indigo-300" : "text-indigo-700"}
                  >
                    IDE
                  </motion.span>
                </h1>
              </motion.div>
            </div>
            </Link>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="hidden md:flex items-center justify-center flex-1"
            >
              <div className="relative">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className={`text-lg font-semibold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}
                >
                  File/
                </motion.span>
                <motion.span
                  key={projectTitle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {projectTitle}
                </motion.span>
              </div>
            </motion.div>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'} hover:text-indigo-500 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-300`}
                >
                  <Home className="h-5 w-5" />
                  Home
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'} hover:text-indigo-500 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-300`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'} hover:text-indigo-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300`}
              >
                <Download className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'} hover:text-indigo-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300`}
              >
                <Save className="h-5 w-5" />
              </motion.button>
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300`}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

      
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className={`px-3 py-2 rounded-md text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  File/{projectTitle}
                </motion.div>
                <Link to="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center gap-2 transition-colors duration-300`}
                  >
                    <Home className="h-5 w-5" />
                    Home
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center gap-2 transition-colors duration-300`}
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center gap-2 transition-colors duration-300`}
                >
                  <Download className="h-5 w-5" />
                  Download
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'} block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center gap-2 transition-colors duration-300`}
                >
                  <Save className="h-5 w-5" />
                  Save
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

       <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <motion.div
            className={`w-full ${isExpanded ? 'lg:w-full' : 'lg:w-1/2'} transition-all duration-300 ease-in-out`}
            layout
          >
            <div className="flex mb-4 items-center">
              {['html', 'css', 'js'].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-semibold rounded-t-lg mr-2 transition-colors duration-200 tab ${
                    activeTab === tab
                      ? 'bg-indigo-500 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tab.toUpperCase()}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleExpand}
                className={`ml-auto ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} p-2 rounded-full transition-colors duration-300`}
              >
                {isExpanded ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                )}
              </motion.button>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`rounded-lg overflow-hidden ${isDarkMode ? 'border border-gray-600' : 'border border-gray-300'}`}
              style={{ height: 'calc(100vh - 200px)' }}
            >
              <Editor
                height="100%"
                defaultLanguage={activeTab}
                value={code[activeTab]}
                onChange={handleEditorChange}
                theme={isDarkMode ? "vs-dark" : "light"}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  scrollbar: {
                    vertical: 'hidden',
                    horizontal: 'hidden',
                  },
                }}
              />
            </motion.div>
          </motion.div>
          <AnimatePresence>
            {!isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full lg:w-1/2 mt-4 lg:mt-0"
              >
                <h2 className="text-xl font-semibold mb-2">Output</h2>
                <div 
                  className={`border rounded-lg ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`} 
                  style={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}
                >
                  <iframe
                    ref={iframeRef}
                    srcDoc={output}
                    title="output"
                    sandbox="allow-scripts allow-same-origin"
                    className="w-full h-full rounded-lg transition-all duration-300 ease-in-out"
                    style={{ transform: 'scale(0.99)', transformOrigin: 'center center' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}