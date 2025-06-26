
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  position: number;
  exactPredictions: number;
  roundsWon: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: '',
          points: 0,
          position: 0,
          exactPredictions: 0,
          roundsWon: 0
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      setLoading(false);
      throw new Error('Invalid credentials');
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    setUser({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      avatar: '',
      points: 0,
      position: 0,
      exactPredictions: 0,
      roundsWon: 0
    });
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
      setLoading(false);
      throw new Error('Registration failed');
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    setUser({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      avatar: '',
      points: 0,
      position: 0,
      exactPredictions: 0,
      roundsWon: 0
    });
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
