export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  isCustomSet?: boolean;
  items?: {
    id: number;
    name: string;
    price: number;
    image: string;
  }[];
}

export interface CartContextType {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
} 