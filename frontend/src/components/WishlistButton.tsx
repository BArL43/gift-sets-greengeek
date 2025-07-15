import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../context/AuthContext';
import { wishlistApi } from '../services/api';

interface WishlistButtonProps {
  itemId: number;
  itemType: 'gift_set' | 'item';
  onToggle?: (isInWishlist: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ itemId, itemType, onToggle }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      if (user) {
        try {
          const inWishlist = await wishlistApi.isInWishlist(Number(user.id), itemId, itemType);
          setIsFavorite(inWishlist);
        } catch (error) {
          console.error('Error checking wishlist:', error);
        }
      }
    };
    checkWishlist();
  }, [user, itemId, itemType]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      // Можно добавить редирект на страницу входа или показать модальное окно
      return;
    }

    try {
      if (isFavorite) {
        await wishlistApi.removeFromWishlist(Number(user.id), itemId, itemType);
      } else {
        await wishlistApi.addToWishlist(Number(user.id), itemId, itemType);
      }
      setIsFavorite(!isFavorite);
      if (onToggle) {
        onToggle(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return (
    <Tooltip title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}>
      <IconButton
        onClick={handleToggle}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
      >
        {isFavorite ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default WishlistButton; 