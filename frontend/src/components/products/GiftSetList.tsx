import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { giftSetsApi } from '../../services/api';
import { GiftSet } from '../../types/api';

export const GiftSetList: React.FC = () => {
    const [giftSets, setGiftSets] = useState<GiftSet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGiftSets = async () => {
            try {
                const data = await giftSetsApi.getAll();
                setGiftSets(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch gift sets');
                setLoading(false);
            }
        };

        fetchGiftSets();
    }, []);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Grid container spacing={3}>
            {giftSets.map((giftSet) => (
                <Grid item xs={12} sm={6} md={4} key={giftSet.id}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="140"
                            image={giftSet.image_url}
                            alt={giftSet.name}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {giftSet.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {giftSet.description}
                            </Typography>
                            <Typography variant="h6" color="primary">
                                ${giftSet.price}
                            </Typography>
                            <Box mt={2}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Products in this set:
                                </Typography>
                                {giftSet.products.map((product) => (
                                    <Typography key={product.id} variant="body2">
                                        • {product.name}
                                    </Typography>
                                ))}
                            </Box>
                            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                Add to Cart
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}; 