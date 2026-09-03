import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from '@mui/material';
import { usePopularity } from '../context/PopularityContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { getPopularItems } = usePopularity();
  const popularItems = getPopularItems(4);

  return (
    <Box>
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(45deg, #705F2C 0%, #00362A 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" sx={{ maxWidth: 760, fontWeight: 700 }}>
            Подарочные наборы GreenGeek
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 680, mt: 2, mb: 4, opacity: 0.9 }}>
            Выберите готовый подарок или соберите собственный набор в конструкторе.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" size="large" onClick={() => navigate('/catalog')}>
              Смотреть каталог
            </Button>
            <Button variant="outlined" size="large" color="inherit" onClick={() => navigate('/constructor')}>
              Собрать набор
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
          Популярные наборы
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {popularItems.map((item) => (
            <Card
              key={item.id}
              onClick={() => navigate(`/gift-set/${item.id}`)}
              sx={{ cursor: 'pointer', height: '100%', overflow: 'hidden' }}
            >
              <CardMedia component="img" height="220" image={item.image} alt={item.title} />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  {item.price} ₽
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
