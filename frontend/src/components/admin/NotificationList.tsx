import React, { useEffect, useState, useCallback } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  IconButton,
  Badge,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Notifications as NotificationsIcon, Check as CheckIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  order_id: number;
}

interface NotificationResponse {
  notifications: Notification[];
  unread_count: number;
}

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isAdmin } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!token || !isAdmin) {
      setError('Unauthorized access');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get<NotificationResponse>('/admin/notifications');
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unread_count || 0);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else if (error.response?.status === 403) {
        setError('Access denied. Admin rights required.');
      } else {
        setError('Failed to load notifications. Please try again later.');
      }
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [token, isAdmin]);

  const markAsRead = async (notificationId: number) => {
    if (!token || !isAdmin) return;

    try {
      await api.put(`/admin/notifications/${notificationId}/read`);
      // Обновляем локальное состояние
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      setError('Failed to mark notification as read');
    }
  };

  useEffect(() => {
    fetchNotifications();

    // WebSocket connection for real-time notifications
    const ws = new WebSocket(`ws://localhost:8000/ws/admin/notifications?token=${token}`);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_notification') {
          // Добавляем новое уведомление в начало списка
          setNotifications(prev => [data.notification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Fallback polling every 30 seconds in case WebSocket fails
    const interval = setInterval(fetchNotifications, 30000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, [fetchNotifications, token]);

  if (!isAdmin) {
    return (
      <Paper elevation={3} sx={{ p: 2, maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Alert severity="error">Access denied. Admin rights required.</Alert>
      </Paper>
    );
  }

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 2, maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 2, maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ fontSize: 30, mr: 1 }} />
        </Badge>
        <Typography variant="h5" component="h2">
          Уведомления
        </Typography>
      </Box>
      <List>
        {notifications.length === 0 ? (
          <ListItem>
            <ListItemText
              primary="Нет уведомлений"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            />
          </ListItem>
        ) : (
          notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                sx={{
                  bgcolor: notification.is_read ? 'transparent' : 'action.hover',
                  borderRadius: 1,
                  mb: 1,
                }}
                secondaryAction={
                  !notification.is_read && (
                    <IconButton
                      edge="end"
                      aria-label="mark as read"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CheckIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">{notification.message}</Typography>
                      {!notification.is_read && (
                        <Chip
                          label="Новое"
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.created_at).toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  );
};

export default NotificationList; 