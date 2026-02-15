import { api } from './api';
import { User, AuthState } from '../types';

export class AuthService {
  async login(credentials: any): Promise<AuthState> {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, user } = response.data;
    localStorage.setItem('token', accessToken);
    return { user, token: accessToken, isAuthenticated: true };
  }

  async register(userData: any): Promise<User> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    // Optionally clear user state
  }

  get currentUser(): User | null {
    // In a real app, decode JWT or fetch user profile
    return {
      id: 'mock-user-id',
      email: 'user@example.com',
      fullName: 'Mock User',
      role: 'ANALYST',
      isActive: true,
    };
  }
}
