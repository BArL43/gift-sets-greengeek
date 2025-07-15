import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface GiftSet {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  products: Product[];
}

const GiftSetsManagement: React.FC = () => {
  const { token } = useAuth();
  const [giftSets, setGiftSets] = useState<GiftSet[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGiftSet, setEditingGiftSet] = useState<GiftSet | null>(null);
  const [formData, setFormData] = useState<Partial<GiftSet>>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    products: [],
  });

  useEffect(() => {
    fetchGiftSets();
    fetchProducts();
  }, []);

  const fetchGiftSets = async () => {
    try {
      const response = await api.get('/admin/gift-sets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGiftSets(response.data);
    } catch (error) {
      console.error('Error fetching gift sets:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpenDialog = (giftSet?: GiftSet) => {
    if (giftSet) {
      setEditingGiftSet(giftSet);
      setFormData(giftSet);
    } else {
      setEditingGiftSet(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        products: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGiftSet(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      image_url: '',
      products: [],
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingGiftSet) {
        await api.put(
          `/admin/gift-sets/${editingGiftSet.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await api.post(
          '/admin/gift-sets',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      handleCloseDialog();
      fetchGiftSets();
    } catch (error) {
      console.error('Error saving gift set:', error);
    }
  };

  const handleDeleteGiftSet = async (giftSetId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот набор?')) {
      try {
        await api.delete(`/admin/gift-sets/${giftSetId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchGiftSets();
      } catch (error) {
        console.error('Error deleting gift set:', error);
      }
    }
  };

  const handleProductChange = (event: SelectChangeEvent<number[]>) => {
    const selectedProductIds = event.target.value as number[];
    const selectedProducts = products.filter(product => 
      selectedProductIds.includes(product.id)
    );
    setFormData({ ...formData, products: selectedProducts });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">
          Управление наборами
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Добавить набор
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Продукты</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {giftSets.map((giftSet) => (
              <TableRow key={giftSet.id}>
                <TableCell>{giftSet.id}</TableCell>
                <TableCell>{giftSet.name}</TableCell>
                <TableCell>{giftSet.price}</TableCell>
                <TableCell>
                  {giftSet.products.map((product) => (
                    <Chip
                      key={product.id}
                      label={product.name}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Tooltip title="Редактировать">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(giftSet)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteGiftSet(giftSet.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingGiftSet ? 'Редактировать набор' : 'Добавить набор'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Описание"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Цена"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL изображения"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Продукты</InputLabel>
                <Select
                  multiple
                  value={formData.products?.map(p => p.id) || []}
                  label="Продукты"
                  onChange={handleProductChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const product = products.find(p => p.id === value);
                        return (
                          <Chip
                            key={value}
                            label={product?.name}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} - {product.price}₽
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingGiftSet ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GiftSetsManagement; 