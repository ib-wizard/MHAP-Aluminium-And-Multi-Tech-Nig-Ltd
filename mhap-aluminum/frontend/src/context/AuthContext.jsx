import React, { createContext, useContext, useEffect, useState } from 'react';
import { adminLogin, adminMe } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mhap_admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    adminMe()
      .then(setAdmin)
      .catch(() => localStorage.removeItem('mhap_admin_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { token, admin: adminData } = await adminLogin(email, password);
    localStorage.setItem('mhap_admin_token', token);
    setAdmin(adminData);
    return adminData;
  }

  function logout() {
    localStorage.removeItem('mhap_admin_token');
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
