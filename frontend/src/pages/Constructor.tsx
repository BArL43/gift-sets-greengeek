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
      { id: 18, name: 'Крем', price: 342, image: '/крем.jpg' },
      { id: 4, name: 'Мыло', price: 85, image: '/мыло.jpg' },
      { id: 15, name: 'Маска для лица', price: 25, image: '/маски.jpg' },
      { id: 19, name: 'Скраб (белый)', price: 400, image: '/скраб_белый.jpg' },
      { id: 1, name: 'Скраб (красный)', price: 493, image: '/скраб_красный.jpg' },
      { id: 3, name: 'Бомбочки для ванны', price: 240, image: '/бомбочки.jpg' },
    ],
  },
  {
    id: 'home',
    title: 'Для дома',
    items: [
      { id: 8, name: 'Полотенце', price: 514, image: '/полотенце.jpg' },
      { id: 5, name: 'Чашки', price: 349, image: '/чашки.jpg' },
      { id: 2, name: 'Косметичка', price: 532, image: '/косметичка.jpg' },
    ],
  },
  {
    id: 'drinks',
    title: 'Для напитков',
    items: [
      { id: 9, name: 'Стаканчики', price: 485, image: '/стаканчики.jpg' },
      { id: 14, name: 'Трубочки стеклянные', price: 105, image: '/стаканчики.jpg' },
      { id: 17, name: 'Формы для льда', price: 429, image: '/формы_для_льда.jpg' },
      { id: 10, name: 'Зонтики', price: 13, image: '/стаканчики.jpg' },
    ],
  },
  {
    id: 'sweets',
    title: 'Сладости',
    items: [
      { id: 12, name: 'Pocky', price: 221, image: '/pocky.jpg' },
      { id: 11, name: 'Maltesers', price: 112, image: '/maltesers.jpg' },
    ],
  },
  {
    id: 'decor',
    title: 'Декор',
    items: [
      { id: 13, name: 'Свечи', price: 217, image: '/свечи.jpg' },
    ],
  },
  {
    id: 'toys',
    title: 'Игрушки',
    items: [
      { id: 16, name: 'Человек-паук', price: 750, image: '/человек_паук.jpg' },
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
        const index = prev.indexOf(itemId);
        if (index > -1) {
          const newItems = [...prev];
          newItems.splice(index, 1);
          return newItems;
        }
      } else if (action === 'add') {
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
    const baseTotalPrice = calculateTotal();

    const packagingPrice = 119;
    const packagingQuantity = 1;
    const packagingTotal = packagingPrice * packagingQuantity;

    const cartItems = [
      ...selectedItemsDetails.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: getItemQuantity(item.id)
      })),
      {
        id: 999001,
        name: 'Оформление (коробка, бумага, открытка, ленточка)',
        price: packagingPrice,
        image: '/набор_со_свечей.jpg',
        quantity: packagingQuantity
      }
    ];

    addItem({
      id: Date.now(),
      title: 'Собственный набор',
      price: baseTotalPrice + packagingTotal,
      image: selectedItemsDetails[0]?.image || '/набор_со_свечей.jpg',
      quantity: 1,
      isCustomSet: true,
      items: cartItems,
    });

    navigate('/cart');
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Соберите свой подарочный набор
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Выберите до {maxItems} товаров. Оформление набора стоит 119 ₽.
        </Typography>

        {categories.map((category) => (
          <Paper key={category.id} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {category.title}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2,
              }}
            >
              {category.items.map((item) => {
                const quantity = getItemQuantity(item.id);
                return (
                  <Paper
                    key={item.id}
                    variant="outlined"
                    sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 2 }}
                    />
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography>{item.price} ₽</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                      <Button
                        variant="outlined"
                        disabled={quantity === 0}
                        onClick={() => handleItemToggle(item.id, 'remove')}
                      >
                        −
                      </Button>
                      <Typography>{quantity}</Typography>
                      <Button
                        variant="contained"
                        disabled={selectedItems.length >= maxItems}
                        onClick={() => handleItemToggle(item.id, 'add')}
                      >
                        +
                      </Button>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </Paper>
        ))}

        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h5">
            Итого: {calculateTotal() + 119} ₽
          </Typography>
          <Button
            variant="contained"
            size="large"
            disabled={selectedItems.length === 0}
            onClick={handleAddToCart}
            sx={{ backgroundColor: theme.palette.primary.main }}
          >
            Добавить набор в корзину
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Constructor;
