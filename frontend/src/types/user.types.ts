// Defines types related to users and authentication
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'MANAGER' | 'ANALYST' | 'AUDITOR';
  isActive: boolean;
  // Add more user-related fields as needed
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
