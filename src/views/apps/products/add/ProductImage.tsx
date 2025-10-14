// ** React Imports
import { Fragment, useCallback, useState } from 'react'

// ** MUI Imports
import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { isValidResponse } from '@/firebase'
import { useFirebase } from '@/firebase/useFirebase'
import { RootState } from '@/store'
import { ProductImageType } from '@/types/apps/productTypes'
import { fileToBase64 } from '@/utils/fileToBase64'
import LoadingWrapper from '@/views/ui/LoadingWrapper'
import Card from '@mui/material/Card'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

interface FileProp {
  name: string
  type: string
  size: number
}

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(15.75),
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4),
  },
  [theme.breakpoints.down('sm')]: {
    width: 120,
    height: 'auto',
  },
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(3),
    fontSize: '1.25rem',
  },
}))

const FileUploaderRestrictions = () => {
  // ** State
  const [files, setFiles] = useState<File[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { setValue, watch } = useFormContext()
  const [isUploading, setIsUploading] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const store = useSelector((state: RootState) => state.products)

  const currentImages = watch('imagenes') || []
  const codigo = watch('codigo')
  const nombre = watch('nombre')

  const { uploadImages } = useFirebase()

  const handleLoadImages = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true)

      //Optional can be removed
      // setFiles((files) => [
      //   ...files,
      //   ...acceptedFiles.map((file: File) => Object.assign(file)),
      // ])
      const currentFiles = [
        ...files,
        ...acceptedFiles.map((file: File) => Object.assign(file)),
      ]
      const base64Images = await Promise.all(
        currentFiles.map((file) => fileToBase64(file)),
      )

      const response = await uploadImages({ images: base64Images })
      if (isValidResponse(response)) {
        toast.success('Imagen cargada a la librería')

        const images: ProductImageType[] = response.uploads.flatMap(
          (upload, index) => {
            const baseImage = {
              idObjeto: upload.id,
              codigoProducto: codigo, //BACKEND ASSIGN ONE
              titulo: nombre,
              esImagenPredeterminada: false,
            }

            return [
              {
                ...baseImage,
                rutaPublica: upload.originalUrl,
                ruta: upload.originalFile,
                tipoImagen: 'original',
                ordenVisualizacion: index * 2,
              },
              {
                ...baseImage,
                rutaPublica: upload.thumbnailUrl,
                ruta: upload.thumbnailFile,
                tipoImagen: 'thumbnail',
                ordenVisualizacion: index * 2 + 1,
              },
            ]
          },
        )

        setValue('imagenes', [...currentImages, ...images], {
          shouldDirty: true,
          shouldTouch: true,
        })

        setFiles([])
      } else {
        toast.error('Error uploading images')
      }
      setIsUploading(false)
    },
    [files, currentImages],
  )

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 10,
    maxSize: 2000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    onDrop: async (acceptedFiles: File[]) => {
      await handleLoadImages(acceptedFiles)
    },
    onDropRejected: () => {
      toast.error('You can only upload 2 files & maximum size of 2 MB.', {
        duration: 2000,
      })
    },
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return (
        <img
          width={isMobile ? 32 : 38}
          height={isMobile ? 32 : 38}
          alt={file.name}
          src={URL.createObjectURL(file as any)}
          style={{
            cursor: 'pointer',
            borderRadius: 4,
            objectFit: 'cover',
          }}
          onClick={() => handleImageClick(file)}
        />
      )
    } else {
      return (
        <Icon icon="mdi:file-document-outline" fontSize={isMobile ? 20 : 24} />
      )
    }
  }

  const handleImageClick = (file: FileProp) => {
    console.log(file)
    setSelectedImage(URL.createObjectURL(file as any))
    setDialogOpen(true)
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedImage(null)
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem
      key={file.name}
      sx={{
        py: isMobile ? 1 : 1.5,
        px: isMobile ? 2 : 3,
      }}
    >
      <div
        className="file-details"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 8 : 12,
          flex: 1,
        }}
      >
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Typography
            className="file-name"
            variant={isMobile ? 'body2' : 'body1'}
            sx={{
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {file.name}
          </Typography>
          <Typography
            className="file-size"
            variant={isMobile ? 'caption' : 'body2'}
            color="text.secondary"
          >
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton
        onClick={() => handleRemoveFile(file)}
        size={isMobile ? 'small' : 'medium'}
        color="error"
      >
        <Icon icon="mdi:close" fontSize={isMobile ? 18 : 20} />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Card sx={{ p: isMobile ? 3 : 5 }}>
      <LoadingWrapper isLoading={isUploading}>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: ['column', 'column', 'row'],
              alignItems: 'center',
              minHeight: isMobile ? '160px' : '200px',
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: isMobile ? 3 : 4,
              cursor: 'pointer',
              transition: 'border-color 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            <Img alt="Upload img" src="/images/misc/upload.png" />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: ['center', 'center', 'inherit'],
              }}
            >
              <HeadingTypography variant={isMobile ? 'h6' : 'h5'}>
                {isMobile
                  ? 'Toca para subir imágenes'
                  : 'Suelta los archivos aquí o haz clic para subirlos.'}
              </HeadingTypography>
              <Typography
                color="textSecondary"
                variant={isMobile ? 'body2' : 'body1'}
                sx={{ mb: 1 }}
              >
                Imágenes Permitidas *.jpeg, *.jpg, *.png
              </Typography>
              <Typography
                color="textSecondary"
                variant={isMobile ? 'caption' : 'body2'}
              >
                Máximo 10 archivos y tamaño máximo de 2 MB
              </Typography>
            </Box>
          </Box>
        </div>
        {files.length ? (
          <Fragment>
            <List sx={{ mt: 2 }}>{fileList}</List>
            <div className="buttons">
              {/* <Button
              color="error"
              variant="outlined"
              onClick={handleRemoveAllFiles}
            >
              Borrar todos
            </Button>
            <Button variant="contained" onClick={handleLoadImages}>
              Cargar Imagenes
            </Button> */}
            </div>
          </Fragment>
        ) : null}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
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
      </LoadingWrapper>
    </Card>
  )
}

export default FileUploaderRestrictions
