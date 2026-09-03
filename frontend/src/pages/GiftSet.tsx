import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import AddToCartButton from '../components/AddToCartButton';
import { usePopularity } from '../context/PopularityContext';
import { giftSets } from '../data/giftSets';

const GiftSet: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { incrementPopularity } = usePopularity();

  const giftSet = giftSets.find(set => set.id === Number(id));

  useEffect(() => {
    if (giftSet) {
      incrementPopularity({
        id: giftSet.id,
        title: giftSet.title,
        price: giftSet.price,
        image: (giftSet.id === 4
          ? '/набор_для_мамы.jpg'
          : giftSet.id === 8
            ? '/набор_со_свечей.jpg'
            : giftSet.image_url),
        rating: (giftSet as any).rating ?? 5,
        reviews: (giftSet as any).reviews ?? 10,
        description: giftSet.description,
        composition: giftSet.composition,
      });
    }
  }, [giftSet, incrementPopularity]);

  if (!giftSet) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 4,
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.primary }}>
            Набор не найден
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/catalog')}
            startIcon={<ArrowBackIcon />}
            sx={{
              mt: 2,
              py: 1.5,
              px: 4,
              borderRadius: '30px',
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              },
              transition: 'all 0.3s ease',
              backgroundColor: theme.palette.primary.main,
              color: 'white',
            }}
          >
            Вернуться в каталог
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/catalog')}
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
                src={giftSet.image_url}
                alt={giftSet.title}
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
                {giftSet.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                
              </Box>

              <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                {giftSet.price} ₽
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <AddToCartButton
                  item={{
                    id: giftSet.id,
                    title: giftSet.title,
                    price: giftSet.price,
                    image: giftSet.image_url,
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
                  onClick={async () => {
                    const shareData = { title: giftSet.title, text: giftSet.description, url: window.location.href };
                    try {
                      if (navigator.share) {
                        await navigator.share(shareData);
                      } else {
                        await navigator.clipboard.writeText(shareData.url);
                        alert('Ссылка скопирована в буфер обмена');
                      }
                    } catch (e) {
                      console.error(e);
                    }
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
                  {giftSet.description}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, color: 'white' }}>
                  Состав набора
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                  {giftSet.composition.map((item, index) => (
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

                {Array.isArray((giftSet as any).recommendations) && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                      Рекомендации
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
                      {((giftSet as any).recommendations as string[]).join(', ')}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default GiftSet;