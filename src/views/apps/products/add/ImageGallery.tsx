import { ProductImageType } from '@/types/apps/productTypes'
import {
  Box,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import Icon from 'src/@core/components/icon'

const ImageGallery: React.FC = () => {
  const { watch, setValue } = useFormContext<{
    imagenes: ProductImageType[]
  }>()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

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
      <Grid container spacing={isMobile ? 1.5 : 2} sx={{ p: isMobile ? 3 : 5 }}>
        {images && images.length ? (
          images
            .filter((f) => f.tipoImagen === 'thumbnail')
            .map((item, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                <Card
                  sx={{
                    position: 'relative',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height={isMobile ? '120' : '140'}
                      image={item.rutaPublica}
                      alt={item.titulo || ''}
                      sx={{
                        objectFit: 'cover',
                        opacity: item.esImagenPredeterminada ? 1 : 0.8,
                        cursor: 'pointer',
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
                          padding: isMobile ? '1px 6px' : '2px 8px',
                          borderRadius: 1,
                          fontSize: isMobile ? '0.625rem' : '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        Principal
                      </Box>
                    )}
                  </Box>
                  <CardActions
                    sx={{
                      justifyContent: 'space-between',
                      p: isMobile ? 1 : 1.5,
                      minHeight: isMobile ? '48px' : '56px',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.esImagenPredeterminada}
                          onChange={() => handleDefaultChange(item.idObjeto)}
                          size={isMobile ? 'small' : 'small'}
                        />
                      }
                      label={
                        <Typography
                          variant={isMobile ? 'caption' : 'body2'}
                          sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}
                        >
                          Principal
                        </Typography>
                      }
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: isMobile ? '0.7rem' : '0.875rem',
                        },
                      }}
                    />
                    <IconButton
                      size={isMobile ? 'small' : 'small'}
                      color="error"
                      onClick={() => handleRemove(index)}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                          transform: 'scale(1.1)',
                        },
                        width: isMobile ? 28 : 32,
                        height: isMobile ? 28 : 32,
                      }}
                    >
                      <Icon
                        icon={'mdi:close-circle'}
                        fontSize={isMobile ? 16 : 18}
                      />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
        ) : (
          <Grid item xs={12}>
            <Stack
              textAlign="center"
              width={'100%'}
              sx={{
                py: isMobile ? 3 : 4,
                minHeight: isMobile ? '120px' : '160px',
                justifyContent: 'center',
              }}
            >
              <Icon
                icon="mdi:image-outline"
                fontSize={isMobile ? 48 : 64}
                style={{ opacity: 0.5, marginBottom: 16 }}
              />
              <Typography
                variant={isMobile ? 'body2' : 'body1'}
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Este producto no cuenta con imágenes
              </Typography>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Card>
  )
}

export default ImageGallery
