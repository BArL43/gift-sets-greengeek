import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import api from '../services/api';

interface PromoInfo {
  valid: boolean;
  message?: string;
  original_total?: number;
  discounted_total?: number;
  discount?: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { items, totalPrice, deliveryCost, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    telegram: '',
    comments: '',
    promo_code: localStorage.getItem('promo_code') || '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoInfo, setPromoInfo] = useState<PromoInfo | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const discountMultiplier = promoInfo?.valid ? 0.85 : 1;
  const discountedTotal = Math.round(totalPrice * discountMultiplier * 100) / 100;
  const finalTotal = discountedTotal + deliveryCost;

  useEffect(() => {
    if (!formData.promo_code || items.length === 0) {
      setPromoInfo(null);
      return;
    }

    const validateSavedPromo = async () => {
      try {
        setIsValidatingPromo(true);
        const response = await api.post('/promo/validate', {
          items: items.map((item) => ({ price: item.price, quantity: item.quantity })),
          promo_code: formData.promo_code,
        });
        setPromoInfo(response.data);
      } catch (requestError: any) {
        setPromoInfo({
          valid: false,
          message: requestError.response?.data?.detail || 'Ошибка проверки промокода',
        });
      } finally {
        setIsValidatingPromo(false);
      }
    };

    validateSavedPromo();
  }, [formData.promo_code, items]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const orderData = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      telegram: formData.telegram,
      comments: formData.comments,
      items: items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        composition:
          item.description ||
          (item.items ? item.items.map((subItem) => subItem.name).join(', ') : 'Состав не указан'),
      })),
      total_amount: finalTotal,
      promo_code: formData.promo_code,
    };

    try {
      await api.post('/orders/', orderData);
      clearCart();
      localStorage.removeItem('promo_code');
      setSuccess(true);
      window.setTimeout(() => navigate('/catalog'), 3000);
    } catch (requestError: any) {
      if (requestError.response) {
        setError(requestError.response.data?.detail || 'Произошла ошибка при оформлении заказа');
      } else if (requestError.request) {
        setError('Не удалось получить ответ от сервера. Проверьте подключение к интернету.');
      } else {
        setError('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте еще раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Заказ успешно оформлен! Спасибо за покупку.
        </Alert>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Ваша корзина пуста. Пожалуйста, добавьте товары перед оформлением заказа.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/catalog')} sx={{ mt: 2 }}>
          Перейти в каталог
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4, color: 'white' }}>
          Оформление заказа
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            gap: 4,
          }}
        >
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Контактная информация
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              * - обязательное поле
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <TextField
                  required
                  fullWidth
                  label="Имя"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <TextField
                  required
                  fullWidth
                  label="Телефон"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <TextField
                  required
                  fullWidth
                  label="Адрес доставки"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  sx={{ gridColumn: { xs: '1 / -1' } }}
                />
                <TextField
                  required
                  fullWidth
                  label="Telegram"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleInputChange}
                  placeholder="@username"
                  sx={{ gridColumn: { xs: '1 / -1' } }}
                />
                <TextField
                  fullWidth
                  label="Комментарий к заказу"
                  name="comments"
                  multiline
                  rows={4}
                  value={formData.comments}
                  onChange={handleInputChange}
                  sx={{ gridColumn: { xs: '1 / -1' } }}
                />
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 3, py: 1.5 }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Оформить заказ'}
              </Button>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Ваш заказ
            </Typography>

            <List>
              {items.map((item) => (
                <ListItem key={item.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={item.title}
                    secondary={`Количество: ${item.quantity}`}
                  />
                  <Typography variant="body1" color="primary">
                    {Math.round(item.price * item.quantity * discountMultiplier * 100) / 100} ₽
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />
            <Box sx={{ my: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" color="text.secondary">
                  Товары ({items.length})
                </Typography>
                <Typography variant="body1">{discountedTotal} ₽</Typography>
              </Box>

              {promoInfo?.valid &&
                promoInfo.discounted_total !== undefined &&
                promoInfo.original_total !== undefined && (
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    Цена с учетом скидки: {promoInfo.discounted_total} ₽ вместо{' '}
                    {promoInfo.original_total} ₽
                  </Typography>
                )}

              {promoInfo && !promoInfo.valid && promoInfo.message && (
                <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                  {promoInfo.message}
                </Typography>
              )}

              {isValidatingPromo && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Проверяем промокод...
                </Typography>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body1" color="text.secondary">
                  Доставка
                </Typography>
                <Typography variant="body1">от {deliveryCost} ₽</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Итого к оплате</Typography>
              <Typography variant="h6" color="primary">
                от {finalTotal} ₽
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Checkout;
