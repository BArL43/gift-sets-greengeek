import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { CartProvider } from './context/CartContext';
import { PopularityProvider } from './context/PopularityContext';
import { AuthProvider, useAuth } from './context/AuthContext';
// Удалены неиспользуемые импорты

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import { ProductList } from './components/products/ProductList';
import { GiftSetList } from './components/products/GiftSetList';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import GiftSet from './pages/GiftSet';
import Constructor from './pages/Constructor';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contacts from './pages/Contacts';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import LoginForm from './components/auth/LoginForm';
// import RegisterForm from './components/auth/RegisterForm';
import Wishlist from './pages/Wishlist';
import AdminPanel from './pages/AdminPanel';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import AdminLogin from './pages/AdminLogin';
import CreateFirstAdminPage from './pages/CreateFirstAdmin';
import GirlGiftSet from './pages/GirlGiftSet';
import MomGiftSet from './pages/MomGiftSet';
import CandleGiftSet from './pages/CandleGiftSet';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin-login" />;
  }

  return <>{children}</>;
};

// Цвета логотипа GreenGeek
const theme = createTheme({
  palette: {
    primary: {
      main: '#8B763A', // Золотой/желтый цвет из логотипа (для кнопок, акцентов)
      light: '#A28F51',
      dark: '#00362A', // Темно-зеленый
    },
    secondary: {
      main: '#004D40', // Темно-зеленый цвет из логотипа (для фона шапки, основных элементов)
      light: '#00695C',
      dark: '#00362A', // Более темный зеленый для карточек/бумаги
    },
    background: {
      default: '#004D40', // Темно-зеленый фон страницы
      paper: '#00362A', // Более темный зеленый для карточек/бумаги
    },
    text: {
      primary: '#FFFFFF', // Белый для основного текста на темном фоне
      secondary: '#FFFFFF', // Белый для вторичного текста
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#FFFFFF', // Белый для заголовков
    },
    h2: {
      fontWeight: 600,
      color: '#FFFFFF', // Белый
    },
    h3: {
      fontWeight: 600,
      color: '#FFFFFF', // Белый
    },
    h4: {
      fontWeight: 600,
      color: '#FFFFFF', // Белый
    },
    h5: {
      fontWeight: 600,
      color: '#FFFFFF', // Белый
    },
    h6: {
      fontWeight: 600,
      color: '#FFFFFF', // Белый
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#FFFFFF', // Белый
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#FFFFFF', // Белый
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '30px',
          padding: '8px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
          backgroundColor: '#00362A', // Более темный зеленый для карточек
          // color наследуется от typography или устанавливается для конкретных элементов внутри карты
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#00362A', // Более темный зеленый для Paper
          // color наследуется от typography или устанавливается для конкретных элементов
        },
        elevation1: {
          boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            'fieldset': {
              borderColor: '#8B763A', // Золотая обводка
            },
            '&:hover fieldset': {
              borderColor: '#A28F51', // Светлый золотой при ховере
            },
            '&.Mui-focused fieldset': {
              borderColor: '#A28F51', // Светлый золотой при фокусе
            },
          },
          '& .MuiInputBase-input': {
            color: '#FFFFFF', // Белый цвет текста в полях ввода
          },
          '& .MuiInputLabel-root': {
            color: '#E0E0E0', // Светло-серый цвет лейбла
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
          backgroundColor: '#00362A', // Более темный зеленый фон шапки
          color: '#FFFFFF', // Белый цвет текста в шапке
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (min-width:0px)': {
            paddingLeft: '16px',
            paddingRight: '16px',
          },
          '@media (min-width:600px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
          '@media (min-width:900px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#8B763A', // Золотой для ссылок
          '&:hover': {
            color: '#A28F51', // Светлый золотой при ховере
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#A28F51', // Светлый золотой для иконок по умолчанию
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          // Этот стиль может помочь сделать ripple эффект светлее на темном фоне
          '&.Mui-focusVisible': {
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
          },
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <PopularityProvider>
            <Router>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                minHeight: '100vh',
                background: theme.palette.background.default,
              }}>
                <Header />
                <main style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/gift-sets" element={<GiftSetList />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/catalog/:category" element={<Catalog />} />
                    <Route path="/gift-set/:id" element={<GiftSet />} />
                    <Route path="/constructor" element={<Constructor />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route
                      path="/checkout"
                      element={<Checkout />}
                    />
                    <Route
                      path="/order-success"
                      element={
                        <ProtectedRoute>
                          <OrderSuccess />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/order-history"
                      element={
                        <ProtectedRoute>
                          <OrderHistory />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/wishlist"
                      element={
                        <ProtectedRoute>
                          <Wishlist />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/girl-gift-set" element={<GirlGiftSet />} />
                    <Route path="/mom-gift-set" element={<MomGiftSet />} />
                    <Route path="/candle-gift-set" element={<CandleGiftSet />} />
                    {/* <Route path="/login" element={<Login />} /> */}
                    {/* <Route path="/register" element={<Register />} /> */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminPanel />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route 
                      path="/admin-panel" 
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminPanel />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/create-first-admin" element={<CreateFirstAdminPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </PopularityProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

export {};
