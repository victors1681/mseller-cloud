import React, { useState } from 'react'
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material'

interface Product {
  id: number
  title: string
  price: number
  image: string
}

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
  },
]

const clothingTitles = [
  'T-Shirt',
  'Jeans',
  'Jacket',
  'Sweater',
  'Dress',
  'Skirt',
  'Shorts',
  'Blouse',
  'Coat',
  'Scarf',
]

const products: Product[] = clothingTitles.map((title, index) => {
  const randomItem = itemData[Math.floor(Math.random() * itemData.length)]
  return {
    id: index + 1,
    title,
    price: (index + 1) * 10,
    image: randomItem.img,
  }
})

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)

  const handleCardClick = (product: any) => {
    setSelectedProduct(product)
  }

  const handleCloseDialog = () => {
    setSelectedProduct(null)
    setQuantity(1)
  }

  const handleQuantityChange = (event: any) => {
    setQuantity(Number(event.target.value))
  }

  return (
    <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
      <Grid container spacing={5}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={product.id}>
            <Card
              onClick={() => handleCardClick(product)}
              sx={{
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardMedia
                component="img"
                image={product.image}
                alt={product.title}
                sx={{ height: 190, objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{product.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  ${product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selectedProduct} onClose={handleCloseDialog}>
        <DialogTitle>{selectedProduct?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Price: ${selectedProduct?.price}</Typography>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProductGrid
