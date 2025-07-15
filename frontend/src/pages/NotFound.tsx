import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
        color: 'white',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 4,
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '6rem', md: '8rem' },
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 2,
            }}
          >
            404
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}
          >
            Страница не найдена
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, color: theme.palette.text.secondary }}
          >
            Извините, но страница, которую вы ищете, не существует или была перемещена.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: '30px',
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              },
              transition: 'all 0.3s ease',
              backgroundColor: theme.palette.primary.main,
              color: 'white',
            }}
          >
            Вернуться на главную
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound; 