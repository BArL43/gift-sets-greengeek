import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import AdminLoginForm from '../components/auth/AdminLoginForm';

const AdminLogin: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Admin Access
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" paragraph>
          Please enter your administrator credentials to access the admin panel.
        </Typography>
        <AdminLoginForm />
      </Box>
    </Container>
  );
};

export default AdminLogin; 