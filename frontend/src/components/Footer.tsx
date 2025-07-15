import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              GreenGeek
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Создаем особенные моменты с нашими подарочными наборами
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Навигация
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link component={RouterLink} to="/" color="inherit" underline="hover">
                Главная
              </Link>
              <Link component={RouterLink} to="/catalog" color="inherit" underline="hover">
                Каталог
              </Link>
              <Link component={RouterLink} to="/constructor" color="inherit" underline="hover">
                Конструктор
              </Link>
              <Link component={RouterLink} to="/about" color="inherit" underline="hover">
                О нас
              </Link>
              <Link component={RouterLink} to="/contacts" color="inherit" underline="hover">
                Контакты
              </Link>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Контакты
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Телефон: +7 (***) ***-**-**
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: ****@giftsets.ru
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Адрес: г. Зеленодольск
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Мы в соцсетях
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://wa.me/your-number"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} GreenGeek. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 