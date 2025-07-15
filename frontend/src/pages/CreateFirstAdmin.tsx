import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import CreateFirstAdmin from '../components/auth/CreateFirstAdmin';

const CreateFirstAdminPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Initialize Admin Account
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" paragraph>
          This page is for creating the first administrator account. You will need the secret key to proceed.
        </Typography>
        <CreateFirstAdmin />
      </Box>
    </Container>
  );
};

export default CreateFirstAdminPage; 