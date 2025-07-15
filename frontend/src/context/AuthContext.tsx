import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Тип для данных регистрации
export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          console.log('Проверка аутентификации с токеном:', token.substring(0, 10) + '...');
          const response = await api.get('/auth/me');
          console.log('Получены данные пользователя:', response.data);
          setUser(response.data);
        } catch (err) {
          console.error('Auth check error:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const isAuthenticated = !!user;
  const isAdmin = !!user?.is_admin;

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      console.log('Попытка входа с email:', email);
      
      // Создаем URLSearchParams для отправки данных в формате application/x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await api.post('/auth/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const accessToken = response.data.access_token;
      console.log('Получен токен:', accessToken.substring(0, 10) + '...');
      
      // Сохраняем токен в localStorage
      localStorage.setItem('token', accessToken);
      console.log('Токен сохранен в localStorage');
      
      // Проверяем, что токен действительно сохранился
      const savedToken = localStorage.getItem('token');
      console.log('Проверка сохраненного токена:', savedToken ? savedToken.substring(0, 10) + '...' : 'не найден');
      
      // Обновляем состояние
      setToken(accessToken);
      setUser(response.data.user);
      
      console.log('Состояние обновлено, пользователь:', response.data.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      console.error('Ошибка входа:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await api.post('/auth/admin/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      setToken(response.data.access_token);
      setUser(response.data.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during admin login';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data && response.data.access_token) {
        setToken(response.data.access_token);
        localStorage.setItem('token', response.data.access_token);
        // После регистрации не устанавливаем пользователя вручную,
        // а позволяем useEffect сработать и получить пользователя через /auth/me
      } else {
        setError('Ошибка регистрации: токен не получен.');
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Ошибка регистрации. Попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        error,
        login,
        adminLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 