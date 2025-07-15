import axios from 'axios';
import { Product, GiftSet, CreateProductDto, CreateGiftSetDto } from '../types/api';
import { User, LoginResponse, RegisterData, LoginData } from '../types/auth';

const api = axios.create({
     baseURL: 'https://gift-sets-greengeek.onrender.com',
     headers: { 'Content-Type': 'application/json' },
   });

   export default api;

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface WishlistCheckResponse {
  isInWishlist: boolean;
}

// Wishlist API
export const wishlistApi = {
  isInWishlist: async (userId: number, itemId: number, itemType: 'gift_set' | 'item'): Promise<boolean> => {
    const response = await api.get<WishlistCheckResponse>(`/wishlist/check/${userId}/${itemId}/${itemType}`);
    return response.data.isInWishlist;
  },

  addToWishlist: async (userId: number, itemId: number, itemType: 'gift_set' | 'item'): Promise<void> => {
    await api.post('/wishlist/add', { userId, itemId, itemType });
  },

  removeFromWishlist: async (userId: number, itemId: number, itemType: 'gift_set' | 'item'): Promise<void> => {
    await api.delete(`/wishlist/remove/${userId}/${itemId}/${itemType}`);
  },
};

export const productsApi = {
    getAll: async (): Promise<Product[]> => {
        const response = await api.get('/admin/products');
        return response.data;
    },

    getById: async (id: number): Promise<Product> => {
        const response = await api.get(`/admin/products/${id}`);
        return response.data;
    },

    create: async (product: CreateProductDto): Promise<Product> => {
        const response = await api.post('/admin/products', product);
        return response.data;
    },

    update: async (id: number, product: CreateProductDto): Promise<Product> => {
        const response = await api.put(`/admin/products/${id}`, product);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/admin/products/${id}`);
    },
};

export const giftSetsApi = {
    getAll: async (): Promise<GiftSet[]> => {
        const response = await api.get('/gift-sets/');
        return response.data;
    },

    getById: async (id: number): Promise<GiftSet> => {
        const response = await api.get(`/gift-sets/${id}`);
        return response.data;
    },

    create: async (giftSet: CreateGiftSetDto): Promise<GiftSet> => {
        const response = await api.post('/gift-sets/', giftSet);
        return response.data;
    },

    update: async (id: number, giftSet: CreateGiftSetDto): Promise<GiftSet> => {
        const response = await api.put(`/gift-sets/${id}`, giftSet);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/gift-sets/${id}`);
    },
};

interface AuthApi {
    login: (data: LoginData) => Promise<LoginResponse>;
    register: (data: RegisterData) => Promise<User>;
    getMe: () => Promise<User>;
    updateProfile: (data: Partial<User>) => Promise<User>;
}

export const authApi: AuthApi = {
    login: async (data) => {
        const response = await api.post<LoginResponse>('/auth/login', data);
        return response.data;
    },
    register: async (data) => {
        const response = await api.post<User>('/auth/register', data);
        return response.data;
    },
    getMe: async () => {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await api.put<User>('/auth/profile', data);
        return response.data;
    },
};

export default api; 
