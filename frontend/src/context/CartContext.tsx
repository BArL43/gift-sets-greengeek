import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { CartItem, CartContextType } from '../types/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { isAuthenticated, user } = useAuth();

  // Загрузка корзины при монтировании компонента или изменении пользователя
  useEffect(() => {
    if (isAuthenticated && user) {
      // Загружаем корзину пользователя
      const userCart = localStorage.getItem(`cart_${user.email}`);
      if (userCart) {
        setItems(JSON.parse(userCart));
      } else {
        setItems([]);
      }
    } else {
      // Загружаем анонимную корзину
      const anonymousCart = localStorage.getItem('anonymous_cart');
      if (anonymousCart) {
        setItems(JSON.parse(anonymousCart));
      } else {
        setItems([]);
      }
    }
  }, [isAuthenticated, user]);

  // Сохранение корзины при изменении items
  useEffect(() => {
    if (isAuthenticated && user) {
      // Сохраняем корзину пользователя
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(items));
    } else {
      // Сохраняем анонимную корзину
      localStorage.setItem('anonymous_cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated, user]);

  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (isAuthenticated && user) {
      localStorage.removeItem(`cart_${user.email}`);
    } else {
      localStorage.removeItem('anonymous_cart');
    }
  };

  const value = {
    items,
    totalPrice,
    totalItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 