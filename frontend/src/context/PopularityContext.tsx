import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { giftSets } from '../data/giftSets';

interface PopularityItem {
  id: number;
  title: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  composition: string[];
  popularity: number;
}

interface PopularityContextType {
  items: PopularityItem[];
  incrementPopularity: (item: Omit<PopularityItem, 'popularity'>) => void;
  getPopularItems: (limit?: number) => PopularityItem[];
}

const imageById: Record<number, string> = {
  2: '/photo_2025-07-25_13-55-20.jpg',
  3: '/набор_для_мальчика.jpg',
  4: '/набор_для_мамы.jpg',
  5: '/летний_набор.jpg',
  8: '/набор_со_свечей.jpg',
};

const initialPopularItems: PopularityItem[] = giftSets.map(set => ({
  id: set.id,
  title: set.title,
  price: set.price,
  image: imageById[set.id] ?? set.image_url,
  rating: 5,
  reviews: 10,
  description: set.description,
  composition: set.composition,
  popularity: 100 - set.id * 10 // или другое значение, чтобы сортировать
}));

const PopularityContext = createContext<PopularityContextType | undefined>(undefined);

export const PopularityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<PopularityItem[]>(() => {
    const savedItems = localStorage.getItem('popularItems');
    return savedItems ? JSON.parse(savedItems) : initialPopularItems;
  });

  useEffect(() => {
    localStorage.setItem('popularItems', JSON.stringify(items));
  }, [items]);

  const incrementPopularity = useCallback((item: Omit<PopularityItem, 'popularity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, popularity: i.popularity + 1 } : i
        );
      }
      return [...prevItems, { ...item, popularity: 1 }];
    });
  }, []);

  const getPopularItems = useCallback((limit: number = 4) => {
    const sortedItems = [...items].sort((a, b) => b.popularity - a.popularity);
    return sortedItems.slice(0, limit);
  }, [items]);

  const value = React.useMemo(() => ({
    items,
    incrementPopularity,
    getPopularItems,
  }), [items, incrementPopularity, getPopularItems]);

  return (
    <PopularityContext.Provider value={value}>
      {children}
    </PopularityContext.Provider>
  );
};

export const usePopularity = () => {
  const context = useContext(PopularityContext);
  if (context === undefined) {
    throw new Error('usePopularity must be used within a PopularityProvider');
  }
  return context;
};

// Очищаю localStorage для popularItems, чтобы сбросить старые популярные товары
localStorage.removeItem('popularItems'); 