import React from 'react'
import {
  Card,
  Grid,
  CardMedia,
  CardActions,
  Stack,
  IconButton,
  Checkbox,
  FormControlLabel,
  Box,
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useFormContext } from 'react-hook-form'
import { ProductImageType } from '@/types/apps/productTypes'

const ImageGallery: React.FC = () => {
  const { watch, setValue } = useFormContext<{
    imagenes: ProductImageType[]
  }>()

  const images = watch('imagenes')

  const handleRemove = React.useCallback(
    (index: number) => {
      const updatedGallery = images.filter((_, i) => i !== index)
      setValue('imagenes', updatedGallery, {
        shouldDirty: true,
      })
    },
    [images],
  )

  const handleDefaultChange = React.useCallback(
    (selectedIndex?: string) => {
      const updatedImages = images.map((img, index) => ({
        ...img,
        esImagenPredeterminada: img.idObjeto === selectedIndex,
      }))
      setValue('imagenes', updatedImages, {
        shouldDirty: true,
      })
    },
    [images, setValue],
  )

  return (
    <Card>
      <Grid container spacing={2} sx={{ p: 5 }}>
        {images && images.length ? (
          images
            .filter((f) => f.tipoImagen === 'thumbnail')
            .map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ position: 'relative' }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.rutaPublica}
                      alt={item.titulo || ''}
                      sx={{
                        objectFit: 'cover',
                        opacity: item.esImagenPredeterminada ? 1 : 0.8,
                      }}
                    />
                    {item.esImagenPredeterminada && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          left: 4,
                          backgroundColor: 'primary.main',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: 1,
                          fontSize: '0.75rem',
                        }}
                      >
                        Predeterminada
                      </Box>
                    )}
                  </Box>
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.esImagenPredeterminada}
                          onChange={() => handleDefaultChange(item.idObjeto)}
                          size="small"
                        />
                      }
                      label="Principal"
                    />
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleRemove(index)}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                      }}
                    >
                      <Icon icon={'mdi:close-circle'} />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
        ) : (
          <Stack textAlign="center" width={'100%'}>
            Este producto no cuenta con imagenes
          </Stack>
        )}
      </Grid>
    </Card>
  )
}

export default ImageGallery
