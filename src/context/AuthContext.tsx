// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/UserSlice';
import { config } from '../common/config';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
const dispatch = useDispatch();
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.jwtToken);
        localStorage.setItem('userId', data.id);
        setIsAuthenticated(true);
        navigate('/');
      } else {
        alert('Authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(clearUser());
    setIsAuthenticated(false);
    navigate('/auth/signin');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
