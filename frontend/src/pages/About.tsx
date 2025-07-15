import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  useTheme,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Favorite as HeartIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';

const features = [
  {
    icon: <ShippingIcon sx={{ fontSize: 40 }} />,
    title: 'Быстрая доставка',
    description: 'Доставляем по Зеленодольску и Казани в день заказа',
  },
  {
    icon: <HeartIcon sx={{ fontSize: 40 }} />,
    title: 'Качество',
    description: 'Тщательно отбираем каждый компонент набора',
  },
  {
    icon: <StarIcon sx={{ fontSize: 40 }} />,
    title: 'Уникальность',
    description: 'Каждый набор создается индивидуально',
  },
  {
    icon: <TrophyIcon sx={{ fontSize: 40 }} />,
    title: 'Опыт',
    description: 'Более 1000 довольных клиентов',
  },
];

const About: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
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
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            О нас
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: '800px', margin: '0 auto' }}>
            Мы создаем уникальные подарочные наборы из лучших товаров Зеленодольска
          </Typography>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
          {features.map((feature, index) => (
            <Card 
              key={index} 
              sx={{ 
                height: '100%', 
                textAlign: 'center',
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Story Section */}
      <Box sx={{ 
        py: { xs: 6, md: 10 },
        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
        color: 'white',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
                Наша история
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                Мы начали свой путь в 2023 году с простой идеи: создавать уникальные
                подарочные наборы из лучших товаров Зеленодольска. Наша цель —
                показать, что в нашем городе есть много замечательных производителей
                и ремесленников, чьи товары достойны быть подарком.
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                Каждый набор мы собираем вручную, тщательно подбирая компоненты
                и упаковку. Мы верим, что подарок должен быть не просто красивым,
                но и нести в себе частичку души и заботы.
              </Typography>
            </Box>
            <Box>
              <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="400"
                  image="/images/about/workshop.jpg"
                  alt="Наша мастерская"
                />
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default About; 