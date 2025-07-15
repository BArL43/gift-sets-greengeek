import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface CategoryItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

const categories = [
  {
    id: 'cosmetics',
    title: 'Косметика',
    items: [
      { id: 1, name: 'Скраб', price: 350, image: 'https://via.placeholder.com/200x200?text=Скраб' },
      { id: 2, name: 'Косметичка', price: 250, image: 'https://via.placeholder.com/200x200?text=Косметичка' },
      { id: 3, name: 'Бомбочка для ванны', price: 300, image: 'https://via.placeholder.com/200x200?text=Бомбочка' },
      { id: 4, name: 'Мыло ручной работы', price: 200, image: 'https://via.placeholder.com/200x200?text=Мыло' },
      { id: 15, name: 'Маска для лица', price: 280, image: 'https://via.placeholder.com/200x200?text=Маска' },
    ],
  },
  {
    id: 'home',
    title: 'Для дома',
    items: [
      { id: 5, name: 'Кружка бежевая', price: 400, image: 'https://via.placeholder.com/200x200?text=Кружка' },
      { id: 6, name: 'Бокал для вина', price: 450, image: 'https://via.placeholder.com/200x200?text=Бокал' },
      { id: 7, name: 'Тарелка в форме бутылки', price: 350, image: 'https://via.placeholder.com/200x200?text=Тарелка' },
      { id: 8, name: 'Полотенце кухонное', price: 300, image: 'https://via.placeholder.com/200x200?text=Полотенце' },
    ],
  },
  {
    id: 'drinks',
    title: 'Для напитков',
    items: [
      { id: 9, name: 'Стакан для коктейля', price: 250, image: 'https://via.placeholder.com/200x200?text=Стакан' },
      { id: 10, name: 'Зонтик для коктейля', price: 150, image: 'https://via.placeholder.com/200x200?text=Зонтик' },
      { id: 14, name: 'Трубочка для коктейля', price: 120, image: 'https://via.placeholder.com/200x200?text=Трубочка' },
    ],
  },
  {
    id: 'sweets',
    title: 'Сладости',
    items: [
      { id: 11, name: 'Maltesers', price: 200, image: 'https://via.placeholder.com/200x200?text=Maltesers' },
      { id: 12, name: 'Pocky', price: 180, image: 'https://via.placeholder.com/200x200?text=Pocky' },
    ],
  },
  {
    id: 'decor',
    title: 'Декор',
    items: [
      { id: 13, name: 'Аромосвечи', price: 400, image: 'https://via.placeholder.com/200x200?text=Свечи' },
    ],
  },
  {
    id: 'toys',
    title: 'Игрушки',
    items: [
      { id: 16, name: 'Мягкая игрушка Человек-паук', price: 500, image: 'https://via.placeholder.com/200x200?text=Человек-паук' },
    ],
  },
];

const Constructor: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const maxItems = 6;
  const { addItem } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleItemToggle = (itemId: number, action: 'remove' | 'add' = 'remove') => {
    setSelectedItems((prev) => {
      if (action === 'remove') {
        // Удаляем один экземпляр товара
        const index = prev.indexOf(itemId);
        if (index > -1) {
          const newItems = [...prev];
          newItems.splice(index, 1);
          return newItems;
        }
      } else if (action === 'add') {
        // Добавляем товар, если не превышен лимит
        if (prev.length < maxItems) {
          return [...prev, itemId];
        }
      }
      return prev;
    });
  };

  const getItemQuantity = (itemId: number) => {
    return selectedItems.filter(id => id === itemId).length;
  };

  const getSelectedItemsDetails = (): CategoryItem[] => {
    const uniqueItems = new Set(selectedItems);
    return Array.from(uniqueItems).map((id) => {
      for (const category of categories) {
        const item = category.items.find((item) => item.id === id);
        if (item) return item;
      }
      return null;
    }).filter((item): item is CategoryItem => item !== null);
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, id) => {
      for (const category of categories) {
        const item = category.items.find((item) => item.id === id);
        if (item) return sum + item.price;
      }
      return sum;
    }, 0);
  };

  const handleAddToCart = () => {
    const selectedItemsDetails = getSelectedItemsDetails();
    const totalPrice = calculateTotal();
    
    // Добавляем набор как один товар
    addItem({
      id: Date.now(),
      title: 'Подарочный набор',
      price: totalPrice,
      image: selectedItemsDetails[0]?.image || '/images/default-set.jpg',
      quantity: 1,
      isCustomSet: true,
      items: selectedItemsDetails.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: getItemQuantity(item.id)
      }))
    });
    
    navigate('/cart');
  };

  return (
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
            color: 'white',
          }}
        >
          Конструктор подарков
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, 
          gap: 4,
        }}>
          {/* Категории товаров */}
          <Box>
            {categories.map((category) => (
              <Paper
                key={category.title}
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  mb: 4,
                  color: 'white',
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                  {category.title}
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
                  gap: 2 
                }}>
                  {category.items.map((item) => (
                    <Paper
                      key={item.id}
                      elevation={0}
                      onClick={() => handleItemToggle(item.id, 'add')}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.15)',
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      />
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 500 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
                        {item.price} ₽
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Выбранные товары */}
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 20,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                Выбранные товары
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.8, mb: 3 }}>
                Выбрано {selectedItems.length} из {maxItems} позиций
              </Typography>

              {selectedItems.length > 0 ? (
                <>
                  <Box sx={{ mb: 3 }}>
                    {getSelectedItemsDetails().map((item) => (
                      <Paper
                        key={item.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.15)',
                          },
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 500 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
                            {item.price} ₽
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '20px',
                          px: 1,
                          py: 0.5
                        }}>
                          <Button
                            size="small"
                            onClick={() => handleItemToggle(item.id, 'remove')}
                            sx={{
                              minWidth: 'auto',
                              p: 0.5,
                              color: 'white',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            -
                          </Button>
                          <Typography variant="body2" sx={{ color: 'white' }}>
                            {getItemQuantity(item.id)}
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => handleItemToggle(item.id, 'add')}
                            sx={{
                              minWidth: 'auto',
                              p: 0.5,
                              color: 'white',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            +
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </Box>

                  <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                      Итого
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                      {calculateTotal()} ₽
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleAddToCart}
                    sx={{
                      py: 1.5,
                      borderRadius: '30px',
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    Добавить в корзину
                  </Button>
                </>
              ) : (
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.8, textAlign: 'center', py: 4 }}>
                  Выберите товары из категорий слева
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Constructor; 