import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import api from '../services/api';

const Contacts: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('sending');

    try {
      await api.post('/contact/', formData);
      setFormData({ name: '', email: '', message: '' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Связаться с нами
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Оставьте сообщение, и команда GreenGeek свяжется с вами.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField
            required
            label="Имя"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            required
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            required
            multiline
            minRows={5}
            label="Сообщение"
            name="message"
            value={formData.message}
            onChange={handleChange}
          />

          {status === 'success' && (
            <Alert severity="success">Сообщение отправлено.</Alert>
          )}
          {status === 'error' && (
            <Alert severity="error">Не удалось отправить сообщение. Попробуйте ещё раз.</Alert>
          )}

          <Button type="submit" variant="contained" disabled={status === 'sending'}>
            {status === 'sending' ? 'Отправляем...' : 'Отправить'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Contacts;
