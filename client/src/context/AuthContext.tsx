import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  isTrainer: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('apex_token') || 'demo_token_admin');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('apex_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default fallback demo user for presentation
    return {
      id: 'demo-admin-id',
      username: 'admin',
      email: 'admin@gymdemo.com',
      role: 'admin',
      first_name: 'Demo',
      last_name: 'Admin',
      status: 'active',
    };
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCurrentUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.getMe();
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem('apex_user', JSON.stringify(res.user));
      }
    } catch (err) {
      // Retain local demo user in static hosting mode
      console.warn('API getMe unavailable, continuing with demo user session');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser();
    }
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('apex_token', newToken);
    localStorage.setItem('apex_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('apex_token');
    localStorage.removeItem('apex_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const isAdmin = user?.role === 'superadmin' || user?.role === 'admin';
  const isTrainer = user?.role === 'trainer';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
        isAdmin,
        isTrainer,
        isCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
