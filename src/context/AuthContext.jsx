import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    localStorage.setItem('token', data.access_token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await api.post('/signup', payload);
    // Auto-login after signup
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const requestPasswordReset = async (email) => {
    await api.post('/forgot-password', { email });
  };

  const resetPassword = async ({ email, code, newPassword, confirmNewPassword }) => {
    await api.post('/reset-password', { email, code, newPassword, confirmNewPassword });
  };

  const changePassword = async ({ currentPassword, newPassword, confirmNewPassword }) => {
    await api.post('/change-password', { currentPassword, newPassword, confirmNewPassword });
  };

  const value = useMemo(() => ({ user, loading, login, signup, logout, requestPasswordReset, resetPassword, changePassword }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


