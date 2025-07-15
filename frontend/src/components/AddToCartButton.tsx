import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useCart } from '../context/CartContext';
import { usePopularity } from '../context/PopularityContext';

interface AddToCartButtonProps extends ButtonProps {
  item: {
    id: number;
    title: string;
    price: number;
    image: string;
    rating?: number;
    reviews?: number;
    description?: string;
    composition?: string[];
  };
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ item, ...props }) => {
  const { addItem } = useCart();
  const { incrementPopularity } = usePopularity();

  const handleAddToCart = () => {
    const itemWithDescription = {
      ...item,
      quantity: 1,
      description: item.description || (item.composition ? item.composition.join(', ') : 'Состав не указан')
    };
    addItem(itemWithDescription);
    incrementPopularity({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      rating: item.rating || 0,
      reviews: item.reviews || 0,
      description: item.description || (item.composition ? item.composition.join(', ') : 'Состав не указан'),
    });
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleAddToCart}
      {...props}
    >
      В корзину
    </Button>
  );
};

export default AddToCartButton; 