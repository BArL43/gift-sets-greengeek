import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
  SvgIcon,
} from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';

const VkIcon: React.FC = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#2787F5" />
    <path fill="#FFFFFF" d="M4.5,7.5H7.1C7.19,7.5 7.32,7.58 7.38,7.69C7.38,7.69 8,9 8.34,9.65C9,10.88 9.33,11.17 9.56,11.17C9.69,11.17 9.78,11.05 9.78,10.7V8.5C9.78,8.2 9.95,8.05 10.23,8.05H12.6C12.75,8.05 12.86,8.11 12.94,8.22C12.94,8.22 13.05,8.37 13.05,8.58C13.05,8.58 13.08,9.1 13.08,9.83C13.08,10.27 13.13,10.44 13.32,10.44C13.5,10.44 13.77,10.18 14.44,9.2C15,8.36 15.43,7.5 15.43,7.5H17.93C18.31,7.5 18.47,7.75 18.31,8.12C18.31,8.12 17.29,10.17 16.08,11.71C15.12,12.9 14.54,13.31 14.12,13.31C13.86,13.31 13.75,13.07 13.75,12.74V11.6C13.75,11.28 13.68,11.15 13.53,11.15C13.3,11.15 12.85,11.6 12.06,12.54C11.2,13.57 10.46,14.31 10.03,14.31C9,14.31 7.36,11.71 6.45,9.83C5.92,8.66 5.72,8.12 5.72,8.12C5.62,7.84 5.78,7.69 6.1,7.69L4.5,7.5Z" />
  </SvgIcon>
);

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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Link
                  href="#"
                  color="inherit"
                  underline="hover"
                  onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText('greengeek.help@gmail.com'); }}
                  title="Скопировать email"
                  sx={{ cursor: 'pointer' }}
                >
                  Email: greengeek.help@gmail.com
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Link
                  href="#"
                  color="inherit"
                  underline="hover"
                  onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText('@greengeek_zd'); }}
                  title="Скопировать Telegram"
                  sx={{ cursor: 'pointer' }}
                >
                  Telegram: @greengeek_zd
                </Link>
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Мы в соцсетях
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component="a"
                href="https://vk.com/greengeek"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                aria-label="Открыть VK"
              >
                <VkIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://t.me/GreenGeek_ru"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                aria-label="Открыть Telegram"
              >
                <TelegramIcon />
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