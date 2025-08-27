import React, { useState } from 'react';
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
  Dialog,
  IconButton
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
  ArrowForwardIos as ArrowForwardIosIcon
} from '@mui/icons-material';
import AddToCartButton from '../components/AddToCartButton';

const summerGiftSet = {
  id: 5,
  title: 'Летний must-have',
  description: 'Всё, что нужно для летнего вайба: коктейльный стакан, стеклянная трубочка, зонтик и форма для льда. Освежи свой день с этим набором!',
  composition: ['Стакан для коктейля', 'Трубочка стеклянная', 'Зонтик', 'Форма для льда'],
  price: 1090,
  images: [
    '/летний_набор.jpg',
    '/формы_для_льда.jpg',
    '/стаканчики.jpg',
  ],
  rating: 5,
  reviews: 6,
};

const SummerGiftSet: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [lastY, setLastY] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);

  const handleWheel = (e: React.WheelEvent<HTMLImageElement>) => {
    e.preventDefault();
    setZoom((z) => Math.max(1, Math.min(3, z + (e.deltaY < 0 ? 0.2 : -0.2))));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
    if (e.touches.length === 2) {
      setLastY(Math.abs(e.touches[0].clientY - e.touches[1].clientY));
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
    if (e.touches.length === 2 && lastY !== null) {
      const newY = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
      setZoom((z) => Math.max(1, Math.min(3, z + (newY - lastY) / 200)));
      setLastY(newY);
    }
  };

  const handleTouchEnd = () => setLastY(null);

  const handleOpen = (idx: number) => {
    setCurrent(idx);
    setOpen(true);
    setZoom(1);
  };

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? summerGiftSet.images.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === summerGiftSet.images.length - 1 ? 0 : prev + 1));

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          href="/catalog"
          sx={{ mb: 4, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          Назад к каталогу
        </Button>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          <Box>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <IconButton onClick={handlePrev} sx={{ position: 'absolute', left: 0, zIndex: 2, background: 'rgba(255,255,255,0.7)' }}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: 'white',
                  cursor: 'zoom-in',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: { xs: 300, md: 500 },
                  width: '100%',
                  maxWidth: 400,
                  mx: 'auto',
                }}
                onClick={() => handleOpen(current)}
              >
                <img
                  src={summerGiftSet.images[current]}
                  alt={summerGiftSet.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: 500,
                    objectFit: 'cover',
                    transition: '0.2s',
                    display: 'block',
                  }}
                />
              </Paper>
              <IconButton onClick={handleNext} sx={{ position: 'absolute', right: 0, zIndex: 2, background: 'rgba(255,255,255,0.7)' }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
              {summerGiftSet.images.map((img, idx) => (
                <Box
                  key={img}
                  component="img"
                  src={img}
                  alt={summerGiftSet.title + ' ' + (idx + 1)}
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 2,
                    border: idx === current ? '2px solid ' + theme.palette.primary.main : '2px solid transparent',
                    cursor: 'pointer',
                    boxShadow: idx === current ? 2 : 0,
                  }}
                  onClick={() => setCurrent(idx)}
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                {summerGiftSet.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={summerGiftSet.rating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({summerGiftSet.reviews} отзывов)
                </Typography>
              </Box>
              <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                {summerGiftSet.price} ₽
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <AddToCartButton
                  item={{ id: summerGiftSet.id, title: summerGiftSet.title, price: summerGiftSet.price, image: summerGiftSet.images[0] }}
                  variant="contained"
                  size="large"
                />
                <Button variant="outlined" sx={{ minWidth: 48, borderRadius: '30px', borderColor: 'rgba(0,0,0,0.1)', '&:hover': { borderColor: theme.palette.primary.main, backgroundColor: 'rgba(0,0,0,0.02)' } }}>
                  <FavoriteIcon />
                </Button>
                <Button variant="outlined" sx={{ minWidth: 48, borderRadius: '30px', borderColor: 'rgba(0,0,0,0.1)', '&:hover': { borderColor: theme.palette.primary.main, backgroundColor: 'rgba(0,0,0,0.02)' } }}>
                  <ShareIcon />
                </Button>
              </Box>
              <Divider sx={{ my: 4 }} />
              <Box sx={{ p: 4, borderRadius: 4, backgroundColor: '#00362A', color: 'white', mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                  Описание
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: 'white', opacity: 0.9 }}>
                  {summerGiftSet.description}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, color: 'white' }}>
                  Состав набора
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                  {summerGiftSet.composition.map((item, index) => (
                    <Chip key={index} label={item} sx={{ borderRadius: '30px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }} />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Dialog open={open} onClose={() => { setOpen(false); setZoom(1); }} maxWidth="xl" PaperProps={{ sx: { background: 'rgba(0,0,0,0.85)' } }}>
          <IconButton onClick={() => { setOpen(false); setZoom(1); }} sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 2 }}>
            <CloseIcon />
          </IconButton>
          <IconButton onClick={handlePrev} sx={{ position: 'absolute', left: 8, top: '50%', color: 'white', zIndex: 2, transform: 'translateY(-50%)' }}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton onClick={handleNext} sx={{ position: 'absolute', right: 48, top: '50%', color: 'white', zIndex: 2, transform: 'translateY(-50%)' }}>
            <ArrowForwardIosIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', minWidth: { xs: 300, md: 600 } }}>
            <img
              src={summerGiftSet.images[current]}
              alt={summerGiftSet.title}
              style={{ maxHeight: '80vh', maxWidth: '90vw', transform: `scale(${zoom})`, transition: 'transform 0.2s', cursor: zoom > 1 ? 'grab' : 'zoom-out', borderRadius: 8, background: '#fff' }}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              draggable={false}
            />
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
};

export default SummerGiftSet;


