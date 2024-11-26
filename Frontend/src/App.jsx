import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Editor from './components/ui/Editor';
import Home from './components/ui/Home';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  // Retrieve login status from localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  // Function to handle protected routes
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  // Dynamic script management for the BotPenguin widget
  const DynamicScriptLoader = () => {
    const location = useLocation();

    useEffect(() => {
      const path = location.pathname;
      const isEditorRoute = path.startsWith('/editor/');
      const scriptId = 'messenger-widget-b';

      if (isEditorRoute) {
        // Add script dynamically if not already present
        if (!document.getElementById(scriptId)) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = 'https://cdn.botpenguin.com/website-bot.js';
          script.defer = true;
          script.textContent =
            '67458bfc7c9416a9d7cd6f87,67458455a59380e8fe295761';
          document.body.appendChild(script);
        }
      } else {
        // Remove script if it exists and we're not on the /editor/:id route
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
          existingScript.remove();
        }
      }
    }, [location]);

    return null; // This component doesn't render anything
  };

  return (
    <BrowserRouter>
      <DynamicScriptLoader />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Secure routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
        {/* Default route: Redirect to /login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
