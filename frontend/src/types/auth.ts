export interface User {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
  is_admin: boolean;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
} 