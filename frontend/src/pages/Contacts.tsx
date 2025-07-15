import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Telegram as TelegramIcon,
  WhatsApp as WhatsAppIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Contacts: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Отправляем сообщение на бэкенд
      const response = await axios.post('https://gift-sets-greengeek.onrender.com/contact/', {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      if (response.status === 200) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error: any) {
      console.error('Contact submission error:', error);
      setError('Произошла ошибка при отправке сообщения. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Контакты
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {/* Contact Information */}
        <Box>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Наши контакты
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography>+7 (XXX) XXX-XX-XX</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography>info@gift-sets.ru</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography>г. Зеленодольск</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Мы в соцсетях
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton color="primary" aria-label="Telegram">
                  <TelegramIcon />
                </IconButton>
                <IconButton color="primary" aria-label="WhatsApp">
                  <WhatsAppIcon />
                </IconButton>
                <IconButton color="primary" aria-label="Instagram">
                  <InstagramIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Contact Form */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Напишите нам
              </Typography>
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Ваше имя"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  label="Сообщение"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Contacts; 
