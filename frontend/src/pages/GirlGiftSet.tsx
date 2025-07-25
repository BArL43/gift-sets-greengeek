import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Rating,
  Paper,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import AddToCartButton from '../components/AddToCartButton';

const girlGiftSet = {
  id: 2,
  title: 'Набор ДР девочки',
  description: 'Идеальный подарок для девочки.',
  composition: ['Скраб', 'Косметичка', 'Сладкое', 'Маска (в подарок)', 'Открытка'],
  price: 1500,
  image_url: 'https://via.placeholder.com/200x200?text=ДР+девочки',
  rating: 5,
  reviews: 10,
};

const GirlGiftSet: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          href="/catalog"
          sx={{
            mb: 4,
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          Назад к каталогу
        </Button>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          <Box>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                background: 'white',
                mb: { xs: 4, md: 0 },
              }}
            >
              <Box
                component="img"
                src={girlGiftSet.image_url}
                alt={girlGiftSet.title}
                sx={{
                  width: '100%',
                  height: { xs: 300, md: 500 },
                  objectFit: 'cover',
                }}
              />
            </Paper>
          </Box>

          <Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                {girlGiftSet.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={girlGiftSet.rating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({girlGiftSet.reviews} отзывов)
                </Typography>
              </Box>

              <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                {girlGiftSet.price} ₽
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <AddToCartButton
                  item={{
                    id: girlGiftSet.id,
                    title: girlGiftSet.title,
                    price: girlGiftSet.price,
                    image: girlGiftSet.image_url,
                  }}
                  variant="contained"
                  size="large"
                />
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: 48,
                    borderRadius: '30px',
                    borderColor: 'rgba(0,0,0,0.1)',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'rgba(0,0,0,0.02)',
                    },
                  }}
                >
                  <FavoriteIcon />
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: 48,
                    borderRadius: '30px',
                    borderColor: 'rgba(0,0,0,0.1)',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'rgba(0,0,0,0.02)',
                    },
                  }}
                >
                  <ShareIcon />
                </Button>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ 
                p: 4, 
                borderRadius: 4,
                backgroundColor: '#00362A',
                color: 'white',
                mb: 4
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                  Описание
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: 'white', opacity: 0.9 }}>
                  {girlGiftSet.description}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, color: 'white' }}>
                  Состав набора
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                  {girlGiftSet.composition.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      sx={{
                        borderRadius: '30px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default GirlGiftSet; 
