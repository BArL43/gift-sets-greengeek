import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import AddToCartButton from '../components/AddToCartButton';

const giftSets = [
  {
    id: 2,
    title: 'Sweet Day',
    price: 1190,
    image: '/photo_2025-07-25_13-55-20.jpg',
    composition: ['Скраб', 'Косметичка', 'Сладости', 'Маски для лица', 'Открытка'],
    description: 'Яркий, милый и заботливо собранный набор для девочки. Внутри — ароматный скраб, стильная косметичка, сладости и маски для лица. Идеально для дня рождения или просто, чтобы порадовать!',
  },
  {
    id: 3,
    title: 'Hero Box',
    price: 990,
    image: '/набор_для_мальчика.jpg',
    composition: ['Мягкая игрушка (Человек-паук)', 'Maltesers', 'Milkis', 'Сладости'],
    description: 'Настоящий геройский набор! С мягкой игрушкой — Человеком-пауком, сладостями Maltesers и освежающим Milkis. Вдохновляющий подарок для активного мальчика!',
  },
  {
    id: 4,
    title: 'Дорогой маме',
    price: 1190,
    image: '/набор_для_мамы.jpg',
    composition: ['Полотенце для кухни', 'Кружка', 'Крем для тела', 'Маска (подарок)', 'Открытка'],
    description: 'Тёплый и душевный подарок для мамы. Полотенце, кружка, крем для тела, маска и открытка с пожеланием — с любовью и благодарностью для самой родной.',
  },
  {
    id: 5,
    title: 'Летний must-have',
    price: 1090,
    image: '/летний_набор.jpg',
    composition: ['Стакан для коктейля', 'Трубочка стеклянная', 'Зонтик', 'Форма для льда'],
    description: 'Всё, что нужно для летнего вайба: коктейльный стакан, стеклянная трубочка, зонтик и форма для льда. Освежи свой день с этим набором!',
  },
  {
    id: 8,
    title: 'Relax Box',
    price: 1190,
    image: '/набор_со_свечей.jpg',
    composition: ['Свеча', 'Бомбочка для ванны', '4 маски для лица', 'Скраб'],
    description: 'Уютный и расслабляющий комплект: свеча, бомбочка для ванны, маски и скраб — всё для заботы о себе. Создай атмосферу спа прямо у себя дома.',
  },
];

const Catalog: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, background: 'linear-gradient(45deg, #705F2C 0%, #00362A 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ fontWeight: 600, mb: 6, color: 'white' }}>
          Каталог подарочных наборов
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {giftSets.map((set) => (
              <Card key={set.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4, overflow: 'hidden', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', cursor: 'pointer', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.2)', background: 'rgba(255, 255, 255, 0.15)', }, }} onClick={() => set.id === 2 ? navigate('/girl-gift-set') : set.id === 3 ? navigate('/boy-gift-set') : set.id === 4 ? navigate('/mom-gift-set') : set.id === 5 ? navigate('/summer-gift-set') : set.id === 8 ? navigate('/candle-gift-set') : navigate(`/gift-set/${set.id}`)}>
                <CardMedia component="img" height="240" image={set.image} alt={set.title} sx={{ objectFit: 'cover', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', }} />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pb: 2, color: 'white', }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>{set.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'white', opacity: 0.8, mb: 2 }} paragraph>{set.description}</Typography>
                  <ul style={{margin: '8px 0', paddingLeft: 18}}>
                    {set.composition.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>{set.price} ₽</Typography>
                  <Box onClick={(e) => e.stopPropagation()} sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <AddToCartButton item={{ id: set.id, title: set.title, price: set.price, image: set.image }} variant="contained" size="medium" />
                  </Box>
                </CardContent>
              </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Catalog; 
