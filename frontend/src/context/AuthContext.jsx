import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import { decodeJwt, isTokenExpired } from '../utils/jwt';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Starts true: on first mount we don't yet know whether a stored token
  // is valid, so route guards must wait for this instead of assuming
  // "no user yet" means "logged out".
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session on page load / refresh. Without this, a valid
  // accessToken stays in localStorage (and keeps being sent on every
  // request) but `user` resets to null, so the app looks logged out
  // until the next explicit login.
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    const payload = decodeJwt(token);
    if (!payload || isTokenExpired(payload)) {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsLoading(false);
      return;
    }

    // TODO: once GET /api/v1/auth/me (or similar) exists, call it here to
    // get the full user record (fullName, email, etc). For now the JWT
    // payload only carries { id, roles }, which is enough for route
    // guards and role checks.
    setUser({ id: payload.id, roles: payload.roles || [] });
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
