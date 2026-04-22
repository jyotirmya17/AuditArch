import { createContext, useState, useEffect, useContext } from 'react';
import { getMe, login as loginAPI, signup as signupAPI } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then(res => setUser(res.data.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await loginAPI({ email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data.data);
    } catch(e) {
      console.error("Failed to refresh user context:", e);
    }
  };

  const isProfileComplete = !!(user && user.profile && user.profile.firmName && user.profile.ifscCode);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, isProfileComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
