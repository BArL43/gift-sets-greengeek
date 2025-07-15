export interface User {
  id: number;
  email: string;
  is_admin: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
}

export interface GiftSet {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  products: Product[];
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

export interface CreateGiftSetDto {
  name: string;
  description: string;
  price: number;
  image_url: string;
  products: number[];
} 