import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';


const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { items, totalPrice, deliveryCost, totalPriceWithDelivery, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    telegram: '',
    comments: '',
    promo_code: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoInfo, setPromoInfo] = useState<{ valid: boolean; message?: string; original_total?: number; discounted_total?: number; discount?: number } | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const discountMultiplier = promoInfo?.valid ? 0.85 : 1;
  const discountedTotal = Math.round(totalPrice * discountMultiplier * 100) / 100;
  const finalTotal = discountedTotal + deliveryCost;

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.full_name || '',
        phone: user.phone || '',
      }));
    }
    // Prefill promo from cart storage
    const savedPromo = localStorage.getItem('promo_code') || '';
    if (savedPromo) {
      setFormData(prev => ({ ...prev, promo_code: savedPromo }));
    }
  }, [user]);

  useEffect(() => {
    // Auto-validate promo on mount or when items change, if we have a saved code
    if (formData.promo_code) {
      validatePromo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.promo_code, items.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Данные формы:', formData);
      console.log('Товары в корзине:', items);

      // Подготовка данных заказа
      const orderData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        telegram: formData.telegram,
        comments: formData.comments,
        items: items.map(item => ({
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          composition: item.description || (item.items ? item.items.map(subItem => subItem.name).join(', ') : 'Состав не указан')
        })),
        total_amount: finalTotal,
        promo_code: formData.promo_code,
      };

      console.log('Данные заказа:', orderData);

      // Отправка заказа на бэкенд через настроенный экземпляр api
      const response = await api.post('/orders/', orderData);

      console.log('Статус ответа:', response.status);
      console.log('Заголовки ответа:', response.headers);

      // Очистка корзины и переход к успешному состоянию
      clearCart();
      setSuccess(true);
      setTimeout(() => {
        navigate('/catalog');
      }, 3000);
    } catch (error: any) {
      console.error('Order submission error:', error);
      
      if (error.response) {
        // Сервер ответил с ошибкой
        const errorMessage = error.response.data?.detail || 'Произошла ошибка при оформлении заказа';
        setError(errorMessage);
      } else if (error.request) {
        // Запрос был отправлен, но ответ не получен
        setError('Не удалось получить ответ от сервера. Проверьте подключение к интернету.');
      } else {
        // Ошибка при настройке запроса
        setError('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте еще раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validatePromo = async () => {
    if (!formData.promo_code) {
      setPromoInfo(null);
      return;
    }
    try {
      setIsValidatingPromo(true);
      const response = await api.post('/promo/validate', {
        items: items.map(i => ({ price: i.price, quantity: i.quantity })),
        promo_code: formData.promo_code,
      });
      setPromoInfo(response.data);
    } catch (err: any) {
      setPromoInfo({ valid: false, message: err.response?.data?.detail || 'Ошибка проверки промокода' });
    } finally {
      setIsValidatingPromo(false);
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
        <Button
          variant="contained"
          onClick={() => navigate('/catalog')}
          sx={{ mt: 2 }}
        >
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

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
              Контактная информация
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              * - обязательное поле
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <TextField
                    required
                    fullWidth
                    label="Имя"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Box>
                <Box>
                  <TextField
                    required
                    fullWidth
                    label="Телефон"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: '1 / -1' } }}>
                  <TextField
                    required
                    fullWidth
                    label="Адрес доставки"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: '1 / -1' } }}>
                  <TextField
                    required
                    fullWidth
                    label="Telegram"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleInputChange}
                    placeholder="@username"
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: '1 / -1' } }}>
                  <TextField
                    fullWidth
                    label="Комментарий к заказу"
                    name="comments"
                    multiline
                    rows={4}
                    value={formData.comments}
                    onChange={handleInputChange}
                  />
                </Box>
                
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {typeof error === 'string' ? error : JSON.stringify(error)}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  mt: 3,
                  py: 1.5,
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
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Оформить заказ'
                )}
              </Button>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: theme.palette.background.paper,
              height: 'fit-content',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
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
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                  Товары ({items.length})
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                  {discountedTotal} ₽
                </Typography>
              </Box>
              {promoInfo?.valid && promoInfo.discounted_total !== undefined && promoInfo.original_total !== undefined && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="success.main">
                    цена с учетом скидки будет {promoInfo.discounted_total} ₽ вместо {promoInfo.original_total} ₽
                  </Typography>
                </Box>
              )}
              {promoInfo && !promoInfo.valid && promoInfo.message && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="error.main">
                    {promoInfo.message}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                  Доставка
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                  от {deliveryCost} ₽
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                Итого к оплате
              </Typography>
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
