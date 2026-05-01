import React, { createContext, useContext, useState, useEffect } from "react";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  
  useEffect(() => {
      checkAuthStatus();
  }, []);

  const processUserData = (userData) => {
    if (!userData) return null;
    const processed = { ...userData };

    if (!processed.avatar) {
      const displayName = processed.companyName || processed.name || "User";
      processed.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&bold=true&size=200`;
    }
    return processed;
  };

  const checkAuthStatus = async () => {
    try{
      const token = localStorage.getItem('token');
      const userStr=localStorage.getItem('user');
      if(token && userStr){
        const userData=JSON.parse(userStr);
        setUser(processUserData(userData));
        setIsAuthenticated(true);
      }
    }catch(error){
      console.error('Auth check failed:', error);
      logout();
    }finally{
      setLoading(false);
    }
  };
  const login = (userData, token) => {
    const processedAuth = processUserData(userData);
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(processedAuth));
    setUser(processedAuth);
    setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href='/'
  };
  const updateUser = (updatedUserData) => {
    const newUserData = processUserData({ ...user, ...updatedUserData });
    localStorage.setItem('user',JSON.stringify(newUserData));
    setUser(newUserData);
  };
  const value = {user, loading, isAuthenticated, login, logout, updateUser, checkAuthStatus};
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};