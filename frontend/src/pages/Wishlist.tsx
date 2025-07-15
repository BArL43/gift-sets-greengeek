import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCart } from '../context/CartContext';
import { WishlistItem, GiftSet, Item } from '../types/wishlist';
import type { AxiosError } from 'axios/index';

interface ErrorResponse {
  error: string;
}

const Wishlist: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
        } catch (err) {
          const axiosError = err as AxiosError<ErrorResponse>;
          setError(axiosError.response?.data?.error || 'Ошибка при загрузке избранного');
          console.error('Error fetching wishlist:', axiosError);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWishlist();
  }, [user]);

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Пожалуйста, войдите в систему</Alert>
      </Box>
    );
  }

  const handleRemoveFromWishlist = async (itemId: number, itemType: 'gift_set' | 'item') => {
    try {
      setWishlistItems(items => items.filter(item => 
        !(item.item_id === itemId && item.item_type === itemType)
      ));
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.error || 'Ошибка при удалении из избранного');
      console.error('Error removing from wishlist:', axiosError);
    }
  };

  const handleAddToCart = (item: GiftSet | Item) => {
    const cartItem = {
      id: item.id,
      title: 'title' in item ? item.title : item.name,
      price: item.price,
      image: item.image || '',
      description: item.description || '',
      quantity: 1
    };
    addItem(cartItem);
  };

  const handleItemClick = (itemId: number, itemType: 'gift_set' | 'item') => {
    if (itemType === 'gift_set') {
      navigate(`/gift-set/${itemId}`);
    } else {
      navigate(`/item/${itemId}`);
    }
  };

  const getItemTitle = (item: GiftSet | Item): string => {
    return 'title' in item ? item.title : item.name;
  };

  const getItemDescription = (item: GiftSet | Item): string => {
    return item.description || '';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Избранное
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {wishlistItems.length === 0 ? (
        <Alert severity="info">В избранном пока ничего нет</Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {wishlistItems.map((wishlistItem) => (
            <Card 
              key={`${wishlistItem.item_type}-${wishlistItem.item_id}`}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out'
                }
              }}
              onClick={() => handleItemClick(wishlistItem.item_id, wishlistItem.item_type)}
            >
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                  zIndex: 1
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromWishlist(wishlistItem.item_id, wishlistItem.item_type);
                }}
              >
                <FavoriteIcon color="error" />
              </IconButton>

              <CardMedia
                component="img"
                height="200"
                image={wishlistItem.item.image || ''}
                alt={getItemTitle(wishlistItem.item)}
                sx={{ objectFit: 'cover' }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {getItemTitle(wishlistItem.item)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {getItemDescription(wishlistItem.item)}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  {wishlistItem.item.price} ₽
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(wishlistItem.item);
                  }}
                  fullWidth
                >
                  В корзину
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Wishlist; 