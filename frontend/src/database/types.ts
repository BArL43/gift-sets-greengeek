export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Item {
  id: number;
  name: string;
  price: number;
  image: string | null;
  description: string | null;
  quantity?: number;
}

export interface GiftSet {
  id: number;
  title: string;
  price: number;
  image: string;
  category_id: number;
  category_slug: string;
  category_name: string;
  rating: number;
  reviews: number;
  description: string | null;
  items: Item[];
}

export interface Popularity {
  item_id: number;
  item_type: 'gift_set' | 'item';
  views: number;
  purchases: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface UserAddress {
  id: number;
  user_id: number;
  address: string;
  city: string;
  postal_code: string;
  is_default: boolean;
}

export interface UserOrder {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  item_id: number;
  item_type: 'gift_set' | 'item';
  quantity: number;
  price: number;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  item_id: number;
  item_type: 'gift_set' | 'item';
  created_at: string;
  item?: GiftSet | Item;
} 