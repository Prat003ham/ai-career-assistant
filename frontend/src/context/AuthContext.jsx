import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          setUser(res.data.user);
        } catch (err) {
          console.error('Failed to verify session token:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { token: authToken, user: userData } = res.data;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    const { token: authToken, user: userData } = res.data;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
