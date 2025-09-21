import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const ProductCard = ({ product }) => {
  const { name, price, imageUrl, currency = '€' } = product;

  return (
    <Card sx={{ maxWidth: 345, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardMedia
        component="img"
        height="194"
        image={imageUrl || 'https://via.placeholder.com/345x194'}
        alt={name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {name || 'Product Name'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A short description of the product can go here. This part gives a brief overview to entice the customer.
        </Typography>
      </CardContent>
      <Box sx={{ mt: 'auto' }}>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
            {price ? `${price.toFixed(2)}${currency}` : '€0.00'}
          </Typography>
          <Button variant="contained" size="small" color="primary">
            Add to Cart
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
};

export default ProductCard;

