import React, { useState } from 'react'
import { Grid, IconButton, Card, CardMedia, CardActions } from '@mui/material'
import Icon from 'src/@core/components/icon'

interface ImageData {
  img: string
  title: string
}

const itemData: ImageData[] = [
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

const ImageGallery: React.FC = () => {
  const [gallery, setGallery] = useState<ImageData[]>(itemData)

  const handleRemove = (index: number) => {
    const updatedGallery = gallery.filter((_, i) => i !== index)
    setGallery(updatedGallery)
  }

  return (
    <Card>
      <Grid container spacing={2} sx={{ p: 5 }}>
        {gallery.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="140"
                image={item.img}
                alt={item.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardActions sx={{ position: 'absolute', top: 0, right: 0 }}>
                <IconButton
                  color="secondary"
                  onClick={() => handleRemove(index)}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                  }}
                >
                  <Icon icon={'mdi:close-circle'} />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Card>
  )
}

export default ImageGallery
