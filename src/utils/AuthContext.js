import React, { createContext, useContext, useState, useEffect } from 'react';
import Router from 'next/router';

const AuthContext = createContext();

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize: Load token and user info on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('aira_access_token');
      const refreshToken = localStorage.getItem('aira_refresh_token');
      const savedUser = localStorage.getItem('aira_user');
      
      if (accessToken && savedUser) {
        setToken(accessToken);
        setUser(JSON.parse(savedUser));
        
        // Optionally verify token validity or refresh it immediately
        try {
          // Verify access token or try a silent refresh
          await refreshAccessToken(refreshToken);
        } catch (e) {
          console.error("Token verification / refresh failed on startup", e);
          clearAuth();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('aira_access_token');
    localStorage.removeItem('aira_refresh_token');
    localStorage.removeItem('aira_user');
    setToken(null);
    setUser(null);
  };

  const refreshAccessToken = async (rToken) => {
    const refreshUrl = `${API_BASE}/api/auth/refresh`;
    const response = await fetch(refreshUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: rToken || localStorage.getItem('aira_refresh_token') }),
    });

    if (!response.ok) {
      throw new Error("Session expired. Please log in again.");
    }

    const data = await response.json();
    localStorage.setItem('aira_access_token', data.access_token);
    setToken(data.access_token);
    return data.access_token;
  };

  // Main login handler
  const login = async (email, password) => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Authentication failed");
    }

    const data = await response.json();
    
    // Save details to state & localstorage
    const loggedUser = {
      email,
      role: data.role,
      firstName: data.first_name,
      lastName: data.last_name
    };
    
    localStorage.setItem('aira_access_token', data.access_token);
    localStorage.setItem('aira_refresh_token', data.refresh_token);
    localStorage.setItem('aira_user', JSON.stringify(loggedUser));
    
    setToken(data.access_token);
    setUser(loggedUser);
    
    // Role-based redirect
    redirectUser(data.role);
    return loggedUser;
  };

  const redirectUser = (role) => {
    if (role === 'super_admin') {
      Router.push('/dashboard/super-admin');
    } else if (role === 'institution_admin') {
      Router.push('/dashboard/institution-admin');
    } else {
      Router.push('/dashboard/doctor');
    }
  };

  const logout = async () => {
    const rToken = localStorage.getItem('aira_refresh_token');
    if (rToken) {
      try {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: rToken }),
        });
      } catch (e) {
        console.error("Logout request failed", e);
      }
    }
    clearAuth();
    Router.push('/login');
  };

  // Helper function to handle API calls with automatic headers and refresh retry logic
  const apiRequest = async (endpoint, options = {}) => {
    let currentToken = localStorage.getItem('aira_access_token');
    
    const headers = {
      ...options.headers,
    };
    
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }
    
    // Determine content type (Multipart files should not have application/json)
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    let response = await fetch(url, { ...options, headers });

    // Handle Token Expiry
    if (response.status === 401) {
      const rToken = localStorage.getItem('aira_refresh_token');
      if (rToken) {
        try {
          // Try to refresh token
          currentToken = await refreshAccessToken(rToken);
          headers['Authorization'] = `Bearer ${currentToken}`;
          
          // Retry the request
          response = await fetch(url, { ...options, headers });
        } catch (refreshErr) {
          // Refresh failed, force logout
          clearAuth();
          Router.push('/login');
          throw new Error("Session expired. Please log in again.");
        }
      } else {
        clearAuth();
        Router.push('/login');
        throw new Error("Authorization token missing.");
      }
    }

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Request failed");
    }

    // Check if it is a file download (like clinical reports)
    const contentType = response.headers.get("content-type");
    if (contentType && (contentType.includes("text/plain") || contentType.includes("application/octet-stream") || contentType.includes("application/pdf"))) {
      return response; // Return raw response for downloads
    }

    return response.json();
  };

  const registerDoctor = async (fields) => {
    const response = await fetch(`${API_BASE}/api/auth/register-doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Doctor registration failed");
    }
    return response.json();
  };

  const registerInstitution = async (fields) => {
    const response = await fetch(`${API_BASE}/api/institutions/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Institution registration failed");
    }
    return response.json();
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, loading, login, logout, apiRequest, registerDoctor, registerInstitution, redirectUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { API_BASE };
