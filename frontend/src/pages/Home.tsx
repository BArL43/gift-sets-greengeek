import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  Rating,
  Paper,
  useTheme
} from '@mui/material';
import {
  CardGiftcard as GiftIcon,
  Woman as WomanIcon,
  Man as ManIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
  Build as BuildIcon
} from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { usePopularity } from '../context/PopularityContext';

const categories = [
  { icon: <GiftIcon />, title: 'Универсальные', link: '/catalog?category=universal' },
  { icon: <WomanIcon />, title: 'Для женщин', link: '/catalog?category=women' },
  { icon: <ManIcon />, title: 'Для мужчин', link: '/catalog?category=men' },
  { icon: <CategoryIcon />, title: 'Тематические', link: '/catalog?category=thematic' },
  { icon: <BusinessIcon />, title: 'Корпоративные', link: '/catalog?category=corporate' },
  { icon: <BuildIcon />, title: 'Конструктор', link: '/constructor' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { getPopularItems } = usePopularity();
  const popularSets = getPopularItems().filter((s) => ![1, 6, 7].includes(s.id));

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(45deg, #705F2C 0%, #00362A 100%)',
          color: theme.palette.text.primary,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/images/pattern.png")',
            opacity: 0.1,
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              mb: 3,
              color: theme.palette.text.primary,
            }}
          >
            Создаем особенные моменты
          </Typography>
          <Typography 
            variant="h5" 
            paragraph
            sx={{
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              maxWidth: '600px',
              mb: 4,
              color: theme.palette.text.primary,
            }}
          >
            Уникальные подарочные наборы для ваших близких
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/catalog')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '30px',
              fontSize: '1.1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              },
              transition: 'all 0.3s ease',
              color: 'white',
              backgroundColor: '#00362A',
            }}
          >
            Смотреть каталог
          </Button>
        </Container>
      </Box>

      

      {/* Popular Sets Section */}
      <Box sx={{ 
        position: 'relative',
        py: { xs: 6, md: 10 },
        background: 'linear-gradient(45deg, #705F2C 0%, #00362A 100%)',
        color: 'white',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("/images/pattern.png")',
          opacity: 0.1,
          zIndex: 1,
        },
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h3" 
            gutterBottom 
            align="center"
            sx={{
              fontWeight: 600,
              mb: 6,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 60,
                height: 4,
                background: theme.palette.secondary.dark,
                borderRadius: 2,
              },
              color: 'white',
            }}
          >
            Популярные наборы
          </Typography>
          
          {popularSets.length > 0 ? (
            <Carousel
              animation="slide"
              interval={5000}
              indicators={true}
              navButtonsAlwaysVisible={true}
              cycleNavigation={true}
              fullHeightHover={true}
              swipe={true}
              autoPlay={false}
              sx={{
                '& .MuiButtonBase-root': {
                  color: theme.palette.primary.main,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '50%',
                  margin: '0 10px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                },
                '& .MuiSvgIcon-root': { fontSize: { xs: '1.6rem', md: '2rem' } },
                '& .MuiButtonBase-root.Mui-disabled': {
                  opacity: 0.3,
                },
                '& .MuiIconButton-root': {
                  zIndex: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                },
                '& .MuiMobileStepper-root': {
                  backgroundColor: 'transparent',
                },
                '& .MuiMobileStepper-dot': {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  '&.MuiMobileStepper-dotActive': {
                    backgroundColor: theme.palette.primary.main,
                  },
                },
                '& .MuiPaper-root': {
                  transition: 'transform 0.8s ease-in-out',
                },
                '& .MuiCard-root': {
                  transition: 'all 0.8s ease-in-out',
                },
                '& .MuiBox-root': {
                  transition: 'all 0.8s ease-in-out',
                },
                '& .MuiCardContent-root': {
                  transition: 'all 0.8s ease-in-out',
                },
                '& .MuiCardMedia-root': {
                  transition: 'all 0.8s ease-in-out',
                },
                '& .MuiTypography-root': {
                  transition: 'all 0.8s ease-in-out',
                },
                '& .MuiRating-root': {
                  transition: 'all 0.8s ease-in-out',
                },
                '& .MuiButton-root': {
                  transition: 'all 0.8s ease-in-out',
                },
              }}
            >
              {popularSets.map((set) => (
                <Box 
                  key={set.id} 
                  sx={{ 
                    px: { xs: 1, sm: 2 }, 
                    display: 'flex', 
                    justifyContent: 'center',
                  }}
                >
                  <Card
                    sx={{ 
                      width: { xs: '100%', md: '90%' },
                      maxWidth: 1200,
                      minHeight: { xs: 'auto', md: 400 },
                      borderRadius: 4, 
                      display: 'flex', 
                      flexDirection: { xs: 'column', md: 'row' },
                      backgroundColor: theme.palette.primary.dark,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: { xs: 'translateY(-4px)', md: 'translateY(-8px)' },
                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: { xs: '100%', md: '40%' },
                        height: { xs: 220, sm: 260, md: 'auto' },
                        minHeight: { md: 400 },
                        objectFit: 'cover',
                        borderTopLeftRadius: theme.shape.borderRadius,
                        borderTopRightRadius: { xs: theme.shape.borderRadius, md: 0 },
                        borderBottomLeftRadius: { xs: 0, md: theme.shape.borderRadius },
                      }}
                      image={set.image}
                      alt={set.title}
                    />
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      width: { xs: '100%', md: '60%' },
                      p: { xs: 2, sm: 3, md: 4 },
                    }}>
                      <Typography gutterBottom variant="h4" component="div" sx={{ fontWeight: 600, color: 'white', mb: { xs: 1.5, md: 2 }, fontSize: { xs: '1.4rem', sm: '1.6rem', md: '2.125rem' } }}>
                        {set.title}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: { xs: 2, md: 3 }, color: 'white', flexGrow: 1, fontSize: { xs: '0.95rem', md: '1.1rem' }, lineHeight: 1.6 }}>
                        {set.description}
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 500 }}>
                          Состав набора:
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white', pl: 2, fontSize: { xs: '0.95rem', md: '1.1rem' }, lineHeight: 1.6 }}>
                          • Подарочная коробка премиум-класса<br />
                          • Праздничная упаковка с лентой<br />
                          • Поздравительная открытка<br />
                          • Индивидуальное оформление
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Rating value={set.rating} readOnly size="large" sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="body1" sx={{ ml: 2, color: 'white', fontSize: '1.1rem' }}>
                          ({set.reviews} отзывов)
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: { xs: 'stretch', md: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 2 }, justifyContent: 'space-between', mt: 'auto' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
                          {set.price} ₽
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => set.id === 2 ? navigate('/girl-gift-set') : set.id === 3 ? navigate('/boy-gift-set') : set.id === 4 ? navigate('/mom-gift-set') : set.id === 5 ? navigate('/summer-gift-set') : set.id === 8 ? navigate('/candle-gift-set') : navigate(`/gift-set/${set.id}`)}
                          sx={{ 
                            color: 'white',
                            px: { xs: 3, md: 4 },
                            py: { xs: 1.1, md: 1.5 },
                            borderRadius: '30px',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            },
                          }}
                        >
                          Подробнее
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Carousel>
          ) : (
            <Typography variant="h6" align="center" sx={{ color: 'white' }}>
              Нет популярных наборов для отображения.
            </Typography>
          )}
        </Container>
      </Box>

      {/* Features Section (one row on all screens) */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, overflowX: 'auto' }}>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 4, background: theme.palette.background.paper, minWidth: 280 }}>
            <Typography variant="h2" sx={{ mb: 2, color: theme.palette.primary.main }}>🎁</Typography>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Уникальные наборы</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Каждый набор создается с любовью и вниманием к деталям</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 4, background: theme.palette.background.paper, minWidth: 280 }}>
            <Typography variant="h2" sx={{ mb: 2, color: theme.palette.primary.main }}>🚚</Typography>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Быстрая доставка</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Доставляем по Зеленодольску и Казани в день заказа</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 4, background: theme.palette.background.paper, minWidth: 280 }}>
            <Typography variant="h2" sx={{ mb: 2, color: theme.palette.primary.main }}>💝</Typography>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Персональный подход</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Создаем индивидуальные наборы под ваши пожелания</Typography>
          </Paper>
        </Box>
      </Container>

      {/* Constructor Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(45deg, #705F2C 0%, #00362A 100%)',
          color: 'white',
          overflow: 'hidden',
          py: { xs: 6, md: 10 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/images/pattern.png")',
            opacity: 0.1,
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              mb: 3,
              color: 'white',
            }}
          >
            Собери свой набор
          </Typography>
          <Typography 
            variant="h6" 
            paragraph
            sx={{
              maxWidth: '600px',
              margin: '0 auto 32px auto',
              color: 'white',
            }}
          >
            Выбери компоненты и создай идеальный подарок, отражающий вашу заботу.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/constructor')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '30px',
              fontSize: '1.1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              },
              transition: 'all 0.3s ease',
              color: 'white',
              backgroundColor: theme.palette.primary.dark,
            }}
          >
            Перейти к конструктору
          </Button>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom 
          align="center"
          sx={{
            fontWeight: 600,
            mb: 6,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -16,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 4,
              background: theme.palette.secondary.dark,
              borderRadius: 2,
            },
          }}
        >
          Отзывы наших клиентов
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: theme.palette.primary.dark,
            textAlign: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 20,
              left: 20,
              width: 40,
              height: 40,
              background: 'url("/images/quote.png")',
              backgroundSize: 'contain',
              opacity: 0.1,
            },
          }}
        >
          <Typography 
            variant="h6" 
            paragraph
            sx={{ 
              fontStyle: 'italic',
              mb: 3,
              position: 'relative',
              zIndex: 1,
            }}
          >
            "Замечательные наборы! Качество на высоте, упаковка красивая,
            доставка быстрая. Обязательно закажу ещё!"
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ fontWeight: 500, color: 'white' }}
          >
            — Анна К.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home; 
