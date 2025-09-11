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
    <path d="M3,5H6C6.11,5 6.26,5.09 6.32,5.2C6.32,5.2 7,6.61 7.39,7.34C8.12,8.67 8.5,9 8.76,9C8.9,9 9,8.86 9,8.5V6C9,5.68 9.2,5.5 9.5,5.5H12C12.16,5.5 12.29,5.56 12.38,5.67C12.38,5.67 12.5,5.83 12.5,6.06C12.5,6.06 12.53,6.61 12.53,7.39C12.53,7.87 12.59,8.06 12.8,8.06C13,8.06 13.29,7.78 14,6.76C14.62,5.87 15.08,5 15.08,5H18.08C18.5,5 18.68,5.27 18.5,5.68C18.5,5.68 17.39,7.91 16.06,9.59C15,10.93 14.37,11.38 13.91,11.38C13.62,11.38 13.5,11.12 13.5,10.76V9.5C13.5,9.14 13.42,9 13.26,9C13,9 12.5,9.5 11.65,10.53C10.7,11.68 9.88,12.5 9.41,12.5C8.29,12.5 6.5,9.59 5.5,7.5C4.92,6.2 4.7,5.68 4.7,5.68C4.6,5.38 4.77,5.2 5.12,5.2L3,5Z" />
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