import React, { createContext, useState,useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    // Fetch user data from localStorage or an API
    const storedUser = localStorage.getItem("userName");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
