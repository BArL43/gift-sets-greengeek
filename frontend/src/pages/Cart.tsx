import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Remove as RemoveIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    deliveryCost,
  } = useCart();
  const [expandedItems, setExpandedItems] = React.useState<number[]>([]);
  const [promoCode, setPromoCode] = React.useState(localStorage.getItem('promo_code') || '');
  const [promoInfo, setPromoInfo] = React.useState<{
    valid: boolean;
    message?: string;
    original_total?: number;
    discounted_total?: number;
    discount?: number;
  } | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = React.useState(false);

  const discountMultiplier = promoInfo?.valid ? 0.85 : 1;
  const discountedTotal = Math.round(totalPrice * discountMultiplier * 100) / 100;
  const finalTotal = discountedTotal + deliveryCost;

  const changeQuantity = (id: number, delta: number) => {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) return;
    updateQuantity(id, item.quantity + delta);
  };

  const toggleExpand = (id: number) => {
    setExpandedItems((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
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
      const response = await api.post('/promo/validate', {
        items: items.map((item) => ({ price: item.price, quantity: item.quantity })),
        promo_code: code,
      });
      setPromoInfo(response.data);
      if (response.data?.valid) {
        localStorage.setItem('promo_code', code);
      } else {
        localStorage.removeItem('promo_code');
      }
    } catch (requestError: any) {
      setPromoInfo({
        valid: false,
        message: requestError.response?.data?.detail || 'Ошибка проверки промокода',
      });
    } finally {
      setIsValidatingPromo(false);
    }
  };

  if (items.length === 0) {
    return (
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/catalog')} sx={{ mb: 4 }}>
            Продолжить покупки
          </Button>
          <Paper
            elevation={0}
            sx={{ p: 4, textAlign: 'center', borderRadius: 4, background: theme.palette.primary.dark }}
          >
            <ShoppingBagIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              Ваша корзина пуста
            </Typography>
            <Typography sx={{ mb: 4, opacity: 0.8 }}>
              Добавьте товары из каталога, чтобы сделать заказ
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/catalog')}>
              Перейти в каталог
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/catalog')} sx={{ mb: 4 }}>
          Продолжить покупки
        </Button>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Корзина
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
            <List disablePadding>
              {items.map((item) => {
                const hasDetails = Boolean(item.items?.length);
                const expanded = expandedItems.includes(item.id);
                return (
                  <React.Fragment key={item.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" aria-label="Удалить" onClick={() => removeItem(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                      sx={{ px: 0 }}
                    >
                      <ListItemAvatar>
                        <Avatar src={item.image} alt={item.title} variant="rounded" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.title}
                        secondary={`${item.price} ₽ за единицу`}
                        sx={{ mr: 2 }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 5 }}>
                        <IconButton
                          size="small"
                          aria-label="Уменьшить количество"
                          onClick={() => changeQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          aria-label="Увеличить количество"
                          onClick={() => changeQuantity(item.id, 1)}
                        >
                          <AddIcon />
                        </IconButton>
                        {hasDetails && (
                          <IconButton size="small" onClick={() => toggleExpand(item.id)}>
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        )}
                      </Box>
                    </ListItem>

                    {hasDetails && (
                      <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <List dense sx={{ pl: 8, pb: 2 }}>
                          {item.items?.map((subItem) => (
                            <ListItem key={subItem.id} disableGutters>
                              <ListItemText
                                primary={subItem.name}
                                secondary={`${subItem.price} ₽ × ${subItem.quantity}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    )}
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Итого
            </Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Товары ({totalItems})</Typography>
                <Typography>{discountedTotal} ₽</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Доставка</Typography>
                <Typography>{deliveryCost} ₽</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <TextField
              fullWidth
              size="small"
              label="Промокод"
              value={promoCode}
              onChange={(event) => setPromoCode(event.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              fullWidth
              variant="outlined"
              onClick={validatePromo}
              disabled={isValidatingPromo}
            >
              {isValidatingPromo ? 'Проверяем...' : 'Применить промокод'}
            </Button>

            {promoInfo?.valid && (
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                Скидка {promoInfo.discount} ₽ применена.
              </Typography>
            )}
            {promoInfo && !promoInfo.valid && (
              <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                {promoInfo.message || 'Промокод недействителен'}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">К оплате</Typography>
              <Typography variant="h6" color="primary">
                {finalTotal} ₽
              </Typography>
            </Box>
            <Button fullWidth variant="contained" size="large" onClick={() => navigate('/checkout')}>
              Оформить заказ
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Cart;
