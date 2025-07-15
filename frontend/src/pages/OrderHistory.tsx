import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  useTheme,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface Order {
  id: number;
  status: string;
  total_amount: number;
  created_at: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setOrders(response.data);
        } else {
          setError('Не удалось загрузить заказы');
        }
      } catch (error) {
        setError('Ошибка при загрузке заказов');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return theme.palette.warning.main;
      case 'processing':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', mb: 4 }}>
        История заказов
      </Typography>

      {orders.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            background: '#00362A',
            color: 'white',
            borderRadius: 4,
          }}
        >
          <Typography>У вас пока нет заказов</Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            background: '#00362A',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Номер заказа</TableCell>
                <TableCell sx={{ color: 'white' }}>Дата</TableCell>
                <TableCell sx={{ color: 'white' }}>Статус</TableCell>
                <TableCell sx={{ color: 'white' }}>Сумма</TableCell>
                <TableCell sx={{ color: 'white' }}>Товары</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell sx={{ color: 'white' }}>#{order.id}</TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      sx={{
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {order.total_amount.toLocaleString()} ₽
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {order.items.map((item) => (
                        <Typography key={item.id} sx={{ color: 'white' }}>
                          {item.name} x {item.quantity} - {item.price.toLocaleString()} ₽
                        </Typography>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default OrderHistory; 