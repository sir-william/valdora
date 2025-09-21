'use client'

import { useParams } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';

// Mock product data
const mockProductDetails = {
  1: {
    id: 1,
    name: 'Classic Leather Watch',
    price: 189.99,
    description: 'A timeless classic leather watch that combines elegance with functionality. Crafted with premium materials and attention to detail, this watch is perfect for both casual and formal occasions.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1099&q=80',
    category: 'Accessories',
    inStock: true,
    features: ['Water Resistant', 'Leather Strap', 'Analog Display', '2 Year Warranty']
  },
  2: {
    id: 2,
    name: 'Wireless Bluetooth Headphones',
    price: 99.50,
    description: 'Premium wireless headphones with noise cancellation technology. Experience crystal clear audio quality and comfortable wearing for extended periods.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: 'Electronics',
    inStock: true,
    features: ['Noise Cancellation', 'Bluetooth 5.0', '30h Battery Life', 'Quick Charge']
  },
  3: {
    id: 3,
    name: 'Professional DSLR Camera',
    price: 850.00,
    description: 'Professional-grade DSLR camera perfect for photography enthusiasts and professionals. Capture stunning photos with exceptional clarity and detail.',
    imageUrl: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: 'Photography',
    inStock: false,
    features: ['24MP Sensor', '4K Video', 'Weather Sealed', 'Dual Card Slots']
  },
  4: {
    id: 4,
    name: 'Sleek Modern Laptop',
    price: 1250.00,
    description: 'High-performance laptop designed for professionals and creatives. Featuring the latest processor technology and a stunning display.',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
    category: 'Computers',
    inStock: true,
    features: ['Intel i7 Processor', '16GB RAM', '512GB SSD', '14" Retina Display']
  }
};

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params.id;
  const product = mockProductDetails[productId];

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Product Not Found
        </Typography>
        <Typography variant="body1">
          The product with ID {productId} could not be found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={product.imageUrl}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.name}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={product.category} 
                color="primary" 
                variant="outlined" 
                sx={{ mr: 1 }}
              />
              <Chip 
                label={product.inStock ? 'In Stock' : 'Out of Stock'} 
                color={product.inStock ? 'success' : 'error'}
                variant="outlined"
              />
            </Box>
            
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
              €{product.price.toFixed(2)}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {product.description}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Features:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {product.features.map((feature, index) => (
                  <Chip 
                    key={index}
                    label={feature} 
                    variant="outlined" 
                    size="small"
                  />
                ))}
              </Box>
            </Box>
            
            <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                size="large" 
                disabled={!product.inStock}
                sx={{ flex: 1 }}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button 
                variant="outlined" 
                size="large"
              >
                Add to Wishlist
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;
