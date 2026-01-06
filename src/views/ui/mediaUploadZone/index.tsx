// ** React Imports
import { Fragment, useCallback, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

// ** Custom Components
import LoadingWrapper from 'src/views/ui/LoadingWrapper'
import MediaLibraryDialog from 'src/views/ui/mediaLibraryDialog'

// ** Firebase
import { isValidResponse } from '@/firebase'
import { useFirebase } from '@/firebase/useFirebase'

// ** Types
import { MediaItem, MediaType } from 'src/types/apps/mediaTypes'

// ** Utils
import { fileToBase64 } from '@/utils/fileToBase64'

interface FileProp {
  name: string
  type: string
  size: number
}

interface MediaUploadZoneProps {
  onSelect?: (media: MediaItem[]) => void
  onUploadComplete?: () => void
  allowUpload?: boolean
  allowLibrarySelect?: boolean
  showLibraryButton?: boolean
  multiple?: boolean
  maxFiles?: number
  maxSize?: number
  type?: MediaType | string
  filterType?: MediaType | string
  value?: MediaItem[]
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

const MediaUploadZone = ({
  onSelect,
  onUploadComplete,
  allowUpload = true,
  allowLibrarySelect = true,
  showLibraryButton,
  multiple = true,
  maxFiles = 10,
  maxSize = 2000000,
  type,
  filterType,
  value = [],
}: MediaUploadZoneProps) => {
  // Normalize type prop (support both 'type' and 'filterType')
  const uploadType = type || filterType
  // ** State
  const [files, setFiles] = useState<File[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [libraryDialogOpen, setLibraryDialogOpen] = useState(false)

  // ** Hooks
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { uploadImages } = useFirebase()

  const handleLoadImages = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true)

      try {
        const currentFiles = [
          ...files,
          ...acceptedFiles.map((file: File) => Object.assign(file)),
        ]

        const base64Images = await Promise.all(
          currentFiles.map((file) => fileToBase64(file)),
        )

        const response = await uploadImages({
          images: base64Images,
          filenames: currentFiles.map((file) => file.name),
          type: uploadType as any,
        })

        if (isValidResponse(response)) {
          // Handle response structure: response.result.uploads or response.uploads
          const uploads = (response as any).result?.uploads || response.uploads

          if (uploads && Array.isArray(uploads)) {
            // Convert uploads to MediaItem format
            const mediaItems: MediaItem[] = uploads.map((upload: any) => ({
              ...upload,
              title:
                upload.originalFile?.split('/').pop() || upload.title || '',
              description: upload.description || '',
              tags: upload.tags || [],
              usedBy: upload.usedBy || {},
            }))

            if (onSelect) {
              onSelect(mediaItems)
            }
            if (onUploadComplete) {
              onUploadComplete()
            } else {
              // Only show toast if parent component doesn't handle it
              toast.success('Imágenes cargadas a la librería')
            }
            setFiles([])
          } else {
            toast.error('Error: Formato de respuesta inesperado')
          }
        } else {
          toast.error('Error al cargar imágenes')
        }
      } catch (error) {
        toast.error('Error al cargar imágenes')
      } finally {
        setIsUploading(false)
      }
    },
    [files, uploadType, onSelect, onUploadComplete, uploadImages],
  )

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles,
    maxSize,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    onDrop: async (acceptedFiles: File[]) => {
      await handleLoadImages(acceptedFiles)
    },
    onDropRejected: () => {
      toast.error(
        `Solo puedes subir ${maxFiles} archivos con tamaño máximo de ${(
          maxSize / 1000000
        ).toFixed(0)} MB.`,
        {
          duration: 2000,
        },
      )
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

  const handleLibrarySelect = (media: MediaItem[]) => {
    if (onSelect) {
      onSelect(media)
    }
    if (onUploadComplete) {
      onUploadComplete()
    }
    setLibraryDialogOpen(false)
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

  return (
    <>
      <Card sx={{ p: isMobile ? 3 : 5 }}>
        <LoadingWrapper isLoading={isUploading}>
          {allowUpload && (
            <>
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
                        : 'Suelta los archivos aquí o haz clic para subirlos'}
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
                      Máximo {maxFiles} archivos y tamaño máximo de{' '}
                      {(maxSize / 1000000).toFixed(0)} MB
                    </Typography>
                  </Box>
                </Box>
              </div>

              {files.length > 0 && (
                <Fragment>
                  <List sx={{ mt: 2 }}>{fileList}</List>
                </Fragment>
              )}
            </>
          )}

          {allowLibrarySelect && (
            <>
              {allowUpload && (
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    O
                  </Typography>
                </Divider>
              )}

              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Icon icon="mdi:folder-multiple-image" />}
                onClick={() => setLibraryDialogOpen(true)}
                sx={{
                  minHeight: { xs: 48, sm: 'auto' },
                  fontSize: { xs: '1rem', sm: '0.875rem' },
                }}
              >
                Seleccionar de la Biblioteca
              </Button>
            </>
          )}
        </LoadingWrapper>
      </Card>

      {/* Preview Dialog */}
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

      {/* Media Library Dialog */}
      <MediaLibraryDialog
        open={libraryDialogOpen}
        onClose={() => setLibraryDialogOpen(false)}
        onSelect={handleLibrarySelect}
        multiple={multiple}
        maxSelection={maxFiles}
        filterType={filterType}
        title="Seleccionar de la Biblioteca"
      />
    </>
  )
}

export default MediaUploadZone
