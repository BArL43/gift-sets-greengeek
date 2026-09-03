import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { PopularityProvider } from './context/PopularityContext';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import GiftSet from './pages/GiftSet';
import Constructor from './pages/Constructor';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contacts from './pages/Contacts';
import NotFound from './pages/NotFound';
import GirlGiftSet from './pages/GirlGiftSet';
import MomGiftSet from './pages/MomGiftSet';
import CandleGiftSet from './pages/CandleGiftSet';
import BoyGiftSet from './pages/BoyGiftSet';
import SummerGiftSet from './pages/SummerGiftSet';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B763A',
      light: '#A28F51',
      dark: '#00362A',
    },
    secondary: {
      main: '#004D40',
      light: '#00695C',
      dark: '#00362A',
    },
    background: {
      default: '#004D40',
      paper: '#00362A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
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
          backgroundColor: '#00362A',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#00362A',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root fieldset': { borderColor: '#8B763A' },
          '& .MuiOutlinedInput-root:hover fieldset': { borderColor: '#A28F51' },
          '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#A28F51' },
          '& .MuiInputBase-input': { color: '#FFFFFF' },
          '& .MuiInputLabel-root': { color: '#E0E0E0' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#00362A',
          color: '#FFFFFF',
        },
      },
    },
  },
});

const ScrollToTop: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
};

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <CartProvider>
      <PopularityProvider>
        <Router>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              background: theme.palette.background.default,
            }}
          >
            <ScrollToTop />
            <Header />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/catalog/:category" element={<Catalog />} />
                <Route path="/gift-set/:id" element={<GiftSet />} />
                <Route path="/constructor" element={<Constructor />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/girl-gift-set" element={<GirlGiftSet />} />
                <Route path="/boy-gift-set" element={<BoyGiftSet />} />
                <Route path="/mom-gift-set" element={<MomGiftSet />} />
                <Route path="/summer-gift-set" element={<SummerGiftSet />} />
                <Route path="/candle-gift-set" element={<CandleGiftSet />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </PopularityProvider>
    </CartProvider>
  </ThemeProvider>
);

export default App;
