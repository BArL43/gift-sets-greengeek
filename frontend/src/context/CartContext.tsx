import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem, CartContextType } from '../types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'greengeek_cart';

const loadCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalPrice = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const deliveryCost = useMemo(() => (totalPrice > 0 ? 120 : 0), [totalPrice]);
  const totalPriceWithDelivery = totalPrice + deliveryCost;
  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const addItem = (item: CartItem) => {
    setItems((current) => {
      const existing = current.find((candidate) => candidate.id === item.id);
      if (!existing) {
        return [...current, { ...item, quantity: 1 }];
      }
      return current.map((candidate) =>
        candidate.id === item.id
          ? { ...candidate, quantity: candidate.quantity + 1 }
          : candidate,
      );
    });
  };

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalPrice,
        deliveryCost,
        totalPriceWithDelivery,
        totalItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
