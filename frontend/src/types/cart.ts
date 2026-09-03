export interface CartSubItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

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
  items?: CartSubItem[];
}

export interface CartContextType {
  items: CartItem[];
  totalPrice: number;
  deliveryCost: number;
  totalPriceWithDelivery: number;
  totalItems: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}
