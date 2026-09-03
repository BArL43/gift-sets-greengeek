import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import logo from '../ChatGPT Image 26 мая 2025 г., 19_02_48.png';

const pages = [
  { title: 'Главная', path: '/' },
  { title: 'Каталог', path: '/catalog' },
  { title: 'Конструктор', path: '/constructor' },
  { title: 'Контакты', path: '/contacts' },
];

const Header: React.FC = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const closeMenu = () => setAnchorElNav(null);

  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 80 } }}>
          {!isDesktop && (
            <Box sx={{ display: 'flex' }}>
              <IconButton
                size="large"
                aria-label="Открыть меню"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(event) => setAnchorElNav(event.currentTarget)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElNav)}
                onClose={closeMenu}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.path}
                    component={RouterLink}
                    to={page.path}
                    onClick={closeMenu}
                  >
                    <Typography textAlign="center">{page.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <RouterLink to="/" aria-label="GreenGeek, главная">
              <Box
                component="img"
                src={logo}
                alt="GreenGeek"
                sx={{ mr: 1, height: { xs: 40, md: 50 } }}
              />
            </RouterLink>
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              GreenGeek
            </Typography>
          </Box>

          {isDesktop && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {pages.map((page) => (
                <Button
                  key={page.path}
                  component={RouterLink}
                  to={page.path}
                  sx={{
                    color: 'inherit',
                    px: 2,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                  }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>
          )}

          <IconButton
            color="inherit"
            aria-label="Корзина"
            onClick={() => navigate('/cart')}
            sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            <Badge
              badgeContent={totalItems}
              color="secondary"
              sx={{
                '& .MuiBadge-badge': {
                  right: -3,
                  top: 3,
                  border: `2px solid ${theme.palette.background.paper}`,
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
