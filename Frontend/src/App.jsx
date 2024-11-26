import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Editor from './components/ui/Editor';
import Home from './components/ui/Home';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  // Retrieve login status from localStorage
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Function to handle protected routes
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
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
