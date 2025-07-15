import React from 'react';
import { Container, Grid, Typography, Box, Card, CardContent, CardHeader } from '@mui/material';
import NotificationList from '../components/admin/NotificationList';
import OrderList from '../components/admin/OrderList';
import ProductsManagement from '../components/admin/ProductsManagement';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Панель администратора
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* Статистика */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Статистика" />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Всего заказов: 0
              </Typography>
              <Typography variant="h6" gutterBottom>
                Активных пользователей: 0
              </Typography>
              <Typography variant="h6">
                Доход: 0 ₽
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Уведомления */}
        <Grid item xs={12} md={4}>
          <NotificationList />
        </Grid>

        {/* Заказы */}
        <Grid item xs={12} md={8}>
          <OrderList />
        </Grid>

        {/* Управление продуктами */}
        <Grid item xs={12}>
          <ProductsManagement />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPanel; 