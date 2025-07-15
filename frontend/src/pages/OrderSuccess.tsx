import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 4,
          background: '#00362A',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <CheckCircleOutlineIcon
          sx={{
            fontSize: 80,
            color: theme.palette.primary.main,
            mb: 2,
          }}
        />
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Заказ успешно оформлен!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
          Спасибо за ваш заказ. Мы отправили подтверждение на вашу электронную почту.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/order-history')}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Мои заказы
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              },
            }}
          >
            Вернуться на главную
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccess; 