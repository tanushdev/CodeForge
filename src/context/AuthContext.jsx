import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, setAuthToken, getAuthToken, clearAuthToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getAuthToken();
    if (!t) { setLoading(false); return; }
    apiGet('/api/auth/me')
      .then((data) => setUser(data))
      .catch(() => clearAuthToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiPost('/api/auth/login', { email, password });
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const signup = useCallback(async (email, password) => {
    const data = await apiPost('/api/auth/signup', { email, password });
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
  }, []);

  const saveProgress = useCallback(async (checked, lessonProgress) => {
    try {
      await apiPut('/api/progress', { checked, lessonProgress });
    } catch { /* silent */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, saveProgress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
