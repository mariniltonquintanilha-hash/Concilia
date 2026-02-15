import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/auth.service';
import { AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  const authService = new AuthService();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd validate the token with the backend
      setAuthState({
        user: authService.currentUser, // Mock user for now
        token,
        isAuthenticated: true,
      });
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: any) => {
    setLoading(true);
    try {
      const result = await authService.login(credentials);
      setAuthState(result);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState({ user: null, token: null, isAuthenticated: false });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAuthState({ user: null, token: null, isAuthenticated: false });
  }, []);

  return { authState, loading, login, logout };
};
