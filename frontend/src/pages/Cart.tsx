import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
  Divider,
  TextField,
  useTheme,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingBag as ShoppingBagIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import api from '../services/api';

interface SetItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  isCustomSet?: boolean;
  items?: SetItem[];
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { items, removeItem, updateQuantity, totalItems, totalPrice, deliveryCost, totalPriceWithDelivery } = useCart();
  const [expandedItems, setExpandedItems] = React.useState<number[]>([]);
  const [promoCode, setPromoCode] = React.useState<string>(localStorage.getItem('promo_code') || '');
  const [promoInfo, setPromoInfo] = React.useState<{ valid: boolean; message?: string; original_total?: number; discounted_total?: number; discount?: number } | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = React.useState<boolean>(false);
  const discountMultiplier = promoInfo?.valid ? 0.85 : 1;
  const discountedTotal = Math.round(totalPrice * discountMultiplier * 100) / 100;
  const finalTotal = discountedTotal + deliveryCost;

  const handleIncreaseQuantity = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const validatePromo = async () => {
    const code = promoCode.trim();
    if (!code) {
      setPromoInfo(null);
      localStorage.removeItem('promo_code');
      return;
    }
    try {
      setIsValidatingPromo(true);
      const resp = await api.post('/promo/validate', {
        items: items.map(i => ({ price: i.price, quantity: i.quantity })),
        promo_code: code,
      });
      setPromoInfo(resp.data);
      if (resp.data?.valid) {
        localStorage.setItem('promo_code', code);
      } else {
        localStorage.removeItem('promo_code');
      }
    } catch (e: any) {
      setPromoInfo({ valid: false, message: e.response?.data?.detail || 'Ошибка проверки промокода' });
    } finally {
      setIsValidatingPromo(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/catalog')}
          sx={{
            mb: 4,
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          Продолжить покупки
        </Button>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Корзина
        </Typography>

        {items.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 4,
              background: theme.palette.primary.dark,
              color: 'white',
            }}
          >
            <ShoppingBagIcon sx={{ fontSize: 64, color: 'white', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Ваша корзина пуста
            </Typography>
            <Typography sx={{ mb: 4, color: 'white', opacity: 0.8 }}>
              Добавьте товары из каталога, чтобы сделать заказ
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/catalog')}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: '30px',
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Перейти в каталог
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: theme.palette.primary.dark,
                  color: 'white',
                }}
              >
                {items.map((item) => (
                  <React.Fragment key={item.id}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        py: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: '100%', sm: 120 },
                          height: { xs: 200, sm: 120 },
                          borderRadius: 2,
                          overflow: 'hidden',
                          mb: { xs: 2, sm: 0 },
                          mr: { sm: 3 },
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                              {item.title}
                            </Typography>
                            <Typography variant="h6" color="primary" gutterBottom sx={{ color: 'white' }}>
                              {Math.round(item.price * discountMultiplier * 100) / 100} ₽
                            </Typography>
                          </Box>
                          {item.isCustomSet && (
                            <IconButton onClick={() => toggleExpand(item.id)} sx={{ color: 'white' }}>
                              {expandedItems.includes(item.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: { xs: 2, sm: 0 },
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleDecreaseQuantity(item.id)}
                            sx={{
                              border: '1px solid',
                              borderColor: 'divider',
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                              },
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleIncreaseQuantity(item.id)}
                            sx={{
                              border: '1px solid',
                              borderColor: 'divider',
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                              },
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ml: { sm: 2 },
                          mt: { xs: 2, sm: 0 },
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ mr: 2, minWidth: 100, textAlign: 'right' }}
                        >
                          {Math.round(item.price * item.quantity * discountMultiplier * 100) / 100} ₽
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => removeItem(item.id)}
                          sx={{
                            '&:hover': {
                              bgcolor: 'error.light',
                              color: 'white',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    {item.isCustomSet && (
                      <Collapse in={expandedItems.includes(item.id)}>
                        <Box sx={{ pl: { xs: 0, sm: 15 }, pr: 2, pb: 2 }}>
                          <List dense>
                            {(item.items as SetItem[])?.map((setItem) => (
                              <ListItem key={setItem.id}>
                                <ListItemAvatar>
                                  <Avatar
                                    src={setItem.image}
                                    alt={setItem.name}
                                    sx={{ width: 40, height: 40 }}
                                  />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={setItem.name}
                                  secondary={`${setItem.price} ₽`}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {setItem.quantity} шт.
                                </Typography>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Collapse>
                    )}
                    <Divider />
                  </React.Fragment>
                ))}
              </Paper>
            </Box>

            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: theme.palette.background.paper,
                  position: { md: 'sticky' },
                  top: 100,
                  color: theme.palette.text.primary,
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  Итого
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Промокод
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Введите промокод"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isValidatingPromo || items.length === 0}
                        onClick={validatePromo}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Применить
                      </Button>
                    </Box>
                    {promoInfo?.valid && promoInfo.discounted_total !== undefined && promoInfo.original_total !== undefined && (
                      <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                        цена с учетом скидки будет {promoInfo.discounted_total} ₽ вместо {promoInfo.original_total} ₽
                      </Typography>
                    )}
                    {promoInfo && !promoInfo.valid && promoInfo.message && (
                      <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                        {promoInfo.message}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      Товары ({totalItems})
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.primary }}>{discountedTotal} ₽</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: theme.palette.text.secondary }}>Доставка</Typography>
                    <Typography sx={{ color: theme.palette.text.primary }}>{deliveryCost} ₽</Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    К оплате
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    {finalTotal} ₽
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => navigate('/checkout')}
                  sx={{
                    py: 1.5,
                    borderRadius: '30px',
                    fontSize: '1rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Оформить заказ
                </Button>
              </Paper>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Cart; 