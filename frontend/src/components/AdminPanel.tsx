import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types/api';
import { UserOrder } from '../types/order';
import api from '../services/api';
import { Navigate } from 'react-router-dom';
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
  Button,
  Box,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadOrders, setUnreadOrders] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          api.get('/products'),
          api.get('/orders')
        ]);
        setProducts(productsResponse.data);
        setOrders(ordersResponse.data);
        setUnreadOrders(ordersResponse.data.filter((order: UserOrder) => order.status === 'pending').length);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user || !user.is_admin) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  const handleOrderStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await api.patch(`/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setUnreadOrders(orders.filter(order => order.status === 'pending').length);
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Admin Panel
        </Typography>
        <IconButton 
          color="primary" 
          onClick={() => setNotificationsOpen(true)}
          sx={{ position: 'relative' }}
        >
          <Badge badgeContent={unreadOrders} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>

      <Drawer
        anchor="right"
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      >
        <Box sx={{ width: 400, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Order Notifications
          </Typography>
          <List>
            {orders
              .filter(order => order.status === 'pending')
              .map(order => (
                <React.Fragment key={order.id}>
                  <ListItem>
                    <ListItemText
                      primary={`Order #${order.id}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Total: ${order.total_amount}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Date: {new Date(order.created_at).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOrderStatusChange(order.id, 'processing')}
                    >
                      Process
                    </Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
          </List>
        </Box>
      </Drawer>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Products Management
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Orders
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(0, 5).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${order.total_amount}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOrderStatusChange(order.id, 'processing')}
                      disabled={order.status !== 'pending'}
                    >
                      Process
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminPanel; 