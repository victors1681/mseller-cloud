// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import Card from '@mui/material/Card'
import { useFirebase } from '@/firebase/useFirebase'
import { isValidResponse } from '@/firebase'
import { fileToBase64 } from '@/utils/fileToBase64'

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
    width: 160,
  },
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4),
  },
}))

const FileUploaderRestrictions = () => {
  // ** State
  const [files, setFiles] = useState<File[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const { uploadImages } = useFirebase()

  const handleLoadImages = async () => {
    const base64Images = await Promise.all(
      files.map((file) => fileToBase64(file)),
    )

    const response = await uploadImages({ images: base64Images })
    if (isValidResponse(response)) {
      toast.success('Response complete')
      setFiles([])
    }
  }

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 10,
    maxSize: 2000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles((files) => [
        ...files,
        ...acceptedFiles.map((file: File) => Object.assign(file)),
      ])
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
          width={38}
          height={38}
          alt={file.name}
          src={URL.createObjectURL(file as any)}
          style={{ cursor: 'pointer' }}
          onClick={() => handleImageClick(file)}
        />
      )
    } else {
      return <Icon icon="mdi:file-document-outline" />
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
    <ListItem key={file.name}>
      <div className="file-details">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div>
          <Typography className="file-name">{file.name}</Typography>
          <Typography className="file-size" variant="body2">
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon="mdi:close" fontSize={20} />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Card sx={{ p: 5 }}>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: ['column', 'column', 'row'],
            alignItems: 'center',
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
            <HeadingTypography variant="h5">
              Suelta los archivos aquí o haz clic para subirlos.
            </HeadingTypography>
            <Typography color="textSecondary">
              Imágenes Permitidas *.jpeg, *.jpg, *.png
            </Typography>
            <Typography color="textSecondary">
              Máximo 10 archivos y tamaño máximo de 2 MB
            </Typography>
          </Box>
        </Box>
      </div>
      {files.length ? (
        <Fragment>
          <List>{fileList}</List>
          <div className="buttons">
            <Button
              color="error"
              variant="outlined"
              onClick={handleRemoveAllFiles}
            >
              Borrar todos
            </Button>
            <Button variant="contained" onClick={handleLoadImages}>
              Cargar Imagenes
            </Button>
          </div>
        </Fragment>
      ) : null}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Vista Previa</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Vista Previa"
              style={{ width: '100%', maxHeight: '500px' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default FileUploaderRestrictions
