export interface UserOrder {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  item_id: number;
  item_type: 'gift_set' | 'item';
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
} 