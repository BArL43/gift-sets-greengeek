export interface WishlistItem {
  id: number;
  user_id: number;
  item_id: number;
  item_type: 'gift_set' | 'item';
  created_at: string;
  item: GiftSet | Item;
}

export interface GiftSet {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  created_at: string;
  updated_at: string;
} 