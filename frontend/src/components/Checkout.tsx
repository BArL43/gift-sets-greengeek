import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CartItem } from '../types/cart';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert
} from '@mui/material';

interface FormData {
  name: string;
  phone: string;
  address: string;
  telegram: string;
  comments: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items: cartItems, totalPrice: totalAmount, clearCart } = useCart();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    telegram: '',
    comments: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      console.log('Данные формы:', formData);
      console.log('Товары в корзине:', cartItems);
      
      const orderData = {
        items: cartItems.map((item: CartItem) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: totalAmount,
        shipping_address: formData.address,
        contact_phone: formData.phone,
        comment: formData.comments
      };

      console.log('Данные заказа:', orderData);
      
      const response = await api.post('/orders/', orderData);
      console.log('Статус ответа:', response.status);
      console.log('Заголовки ответа:', response.headers);
      
      if (response.status === 200) {
        clearCart();
        navigate('/order-success');
      }
    } catch (error: any) {
      console.error('Order submission error:', error);
      console.log('Статус ответа:', error.response?.status);
      console.log('Заголовки ответа:', error.response?.headers);
      console.log('Ошибка ответа:', error.response?.data);
      setError('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Оформление заказа
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Ваше имя"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Телефон"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Адрес доставки"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Telegram (опционально)"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                placeholder="@username"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Комментарий к заказу"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="h6" gutterBottom>
                  Итого: {totalAmount} ₽
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={cartItems.length === 0}
                >
                  Оформить заказ
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Checkout; 