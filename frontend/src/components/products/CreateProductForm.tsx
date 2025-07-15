import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography
} from '@mui/material';
import { productsApi } from '../../services/api';
import { CreateProductDto } from '../../types/api';

interface CreateProductFormProps {
    onProductCreated: () => void;
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({ onProductCreated }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<CreateProductDto>({
        name: '',
        description: '',
        price: 0,
        image_url: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({
            name: '',
            description: '',
            price: 0,
            image_url: ''
        });
        setError(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await productsApi.create(formData);
            handleClose();
            onProductCreated(); // Обновляем список товаров
        } catch (err) {
            setError('Failed to create product');
        }
    };

    return (
        <>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleClickOpen}
                sx={{ mb: 3 }}
            >
                Добавить товар
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Добавить новый товар</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                name="name"
                                label="Название"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                            <TextField
                                name="description"
                                label="Описание"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                fullWidth
                                multiline
                                rows={3}
                            />
                            <TextField
                                name="price"
                                label="Цена"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                fullWidth
                                InputProps={{
                                    inputProps: { min: 0, step: 0.01 }
                                }}
                            />
                            <TextField
                                name="image_url"
                                label="URL изображения"
                                value={formData.image_url}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Отмена</Button>
                        <Button type="submit" variant="contained" color="primary">
                            Добавить
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}; 