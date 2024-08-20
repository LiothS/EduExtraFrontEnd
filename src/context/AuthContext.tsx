// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../common/config';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../redux/UserSlice';
import { User } from '../types/common';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store token in session storage
        sessionStorage.setItem('token', data.jwtToken);

        // Store user info in Redux store
        const user: User = {
          id: data.id,
          username: data.username,
          roles: data.user.roles,
          fullName: data.user.fullName,
          email: data.user.email,
          phone: data.user.phone,
          address: data.user.address,
          nickname: data.user.nickname,
          birthday: data.user.birthday,
          image: data.user.image,
          identityCard: data.user.identityCard,
          active: data.user.active,
          createdBy: data.user.createdBy,
          updatedBy: data.user.updatedBy,
          createdDate: data.user.createdDate,
          updatedDate: data.user.updatedDate,
        };

        dispatch(setUser(user));
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
    sessionStorage.removeItem('token');
    dispatch(clearUser());
    setIsAuthenticated(false);
    navigate('/auth/signin');
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
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
