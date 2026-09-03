import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://gift-sets-greengeek.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export default api;
