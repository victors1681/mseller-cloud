// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { useFormContext } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Type Imports
import { ProductImageType } from '@/types/apps/productTypes'
import { MediaItem } from 'src/types/apps/mediaTypes'

// ** Component Imports
import MediaLibraryDialog from 'src/views/ui/mediaLibraryDialog'

const ProductImage = () => {
  // ** State
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { setValue, watch } = useFormContext()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const currentImages = watch('imagenes') || []
  const codigo = watch('codigo')
  const nombre = watch('nombre')

  const handleMediaSelect = (selectedMedia: MediaItem[]) => {
    const newImages: ProductImageType[] = selectedMedia.flatMap(
      (media, index) => {
        const baseImage = {
          idObjeto: media.id,
          codigoProducto: codigo,
          titulo: media.title || nombre,
          esImagenPredeterminada: currentImages.length === 0 && index === 0,
        }

        return [
          {
            ...baseImage,
            rutaPublica: media.originalUrl,
            ruta: media.originalFile,
            tipoImagen: 'original',
            ordenVisualizacion: (currentImages.length + index) * 2,
          },
          {
            ...baseImage,
            rutaPublica: media.thumbnailUrl,
            ruta: media.thumbnailFile,
            tipoImagen: 'thumbnail',
            ordenVisualizacion: (currentImages.length + index) * 2 + 1,
          },
        ]
      },
    )

    setValue('imagenes', [...currentImages, ...newImages], {
      shouldDirty: true,
      shouldTouch: true,
    })

    setMediaLibraryOpen(false)
    toast.success(`${selectedMedia.length} imagen(es) agregada(s)`)
  }

  const handleRemoveImage = (imageId: string) => {
    const updatedImages = currentImages.filter(
      (img: ProductImageType) => img.idObjeto !== imageId,
    )
    setValue('imagenes', updatedImages, {
      shouldDirty: true,
      shouldTouch: true,
    })
    toast.success('Imagen eliminada')
  }

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setPreviewDialogOpen(true)
  }

  const handleClosePreview = () => {
    setPreviewDialogOpen(false)
    setSelectedImage(null)
  }

  // Get unique images (only show originals, not thumbnails)
  const displayImages = currentImages.filter(
    (img: ProductImageType) => !img.tipoImagen || img.tipoImagen === 'original',
  )

  return (
    <Card sx={{ p: isMobile ? 3 : 5 }}>
      {/* Header with Add Images Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6">Imágenes del Producto</Typography>
        <Button
          variant="contained"
          startIcon={<Icon icon="mdi:image-plus" />}
          onClick={() => setMediaLibraryOpen(true)}
          sx={{
            minHeight: { xs: 44, sm: 'auto' },
          }}
        >
          {isMobile ? 'Agregar' : 'Agregar Imágenes'}
        </Button>
      </Box>

      {/* Images Grid */}
      {displayImages.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)',
            },
            gap: 2,
          }}
        >
          {displayImages.map((image: ProductImageType, idx: number) => (
            <Box
              key={image.idObjeto || image.id || idx}
              sx={{
                position: 'relative',
                paddingTop: '100%',
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: image.esImagenPredeterminada
                  ? 'primary.main'
                  : 'divider',
                cursor: 'pointer',
                '&:hover .image-actions': {
                  opacity: 1,
                },
              }}
            >
              <img
                src={image.rutaPublica || image.ruta}
                alt={image.titulo || 'Product Image'}
                onClick={() => handleViewImage(image.rutaPublica || image.ruta)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {image.esImagenPredeterminada && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  Principal
                </Box>
              )}
              <Box
                className="image-actions"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  p: 1,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  gap: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    const imageId = image.idObjeto || image.id
                    if (imageId) {
                      handleRemoveImage(String(imageId))
                    }
                  }}
                  sx={{
                    backgroundColor: 'error.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    },
                  }}
                >
                  <Icon icon="mdi:delete-outline" fontSize={16} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
          }}
        >
          <Icon icon="mdi:image-off-outline" fontSize={48} color="action" />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No hay imágenes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Haz clic en "Agregar Imágenes" para comenzar
          </Typography>
        </Box>
      )}

      {/* Media Library Dialog */}
      <MediaLibraryDialog
        open={mediaLibraryOpen}
        onClose={() => setMediaLibraryOpen(false)}
        onSelect={handleMediaSelect}
        multiple={true}
      />

      {/* Image Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={handleClosePreview}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            m: isMobile ? 2 : 4,
            width: isMobile ? 'calc(100% - 32px)' : 'auto',
            maxHeight: isMobile ? 'calc(100% - 64px)' : 'auto',
          },
        }}
      >
        <DialogTitle sx={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
          Vista Previa
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Vista Previa"
              style={{
                width: '100%',
                maxHeight: isMobile ? '60vh' : '500px',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default ProductImage
