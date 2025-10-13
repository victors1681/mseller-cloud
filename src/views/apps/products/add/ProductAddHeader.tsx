// MUI Imports
import { RootState } from '@/store'
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router' // Add this import
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'

interface Props {
  id: string
}

const ProductAddHeader = ({ id }: Props) => {
  const router = useRouter() // Add router
  const store = useSelector((state: RootState) => state.products)
  const [openDialog, setOpenDialog] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const isProductExist = store.productDetail
  const isNewProductWithError = !isProductExist && id !== 'new'
  const {
    reset,
    formState: { isDirty },
  } = useFormContext()

  const handleRestoreClick = () => {
    setOpenDialog(true)
  }

  const handleConfirmRestore = () => {
    reset()
    setOpenDialog(false)
  }

  const handleCancelRestore = () => {
    setOpenDialog(false)
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <>
      <Grid container spacing={isMobile ? 2 : 4}>
        {isNewProductWithError && (
          <Grid item xs={12}>
            <Alert severity="error">No se encontró el producto</Alert>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={9}>
          <Box sx={{ mb: isMobile ? 2 : 1 }}>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                mb: 1,
                fontSize: isMobile ? '1.5rem' : undefined,
                lineHeight: isMobile ? 1.3 : undefined,
              }}
            >
              {!isProductExist
                ? 'Agregar nuevo producto'
                : `Actualizar ${store.productDetail?.nombre || ''}`}
            </Typography>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color="text.secondary"
            >
              Mantenimiento de productos
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          {isMobile ? (
            <Stack spacing={1}>
              <Button
                variant="contained"
                type="submit"
                disabled={!isDirty}
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                Grabar
              </Button>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleRestoreClick}
                  disabled={!isDirty}
                  fullWidth
                  size="medium"
                  sx={{ fontSize: '0.875rem' }}
                >
                  Restaurar
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleGoBack}
                  fullWidth
                  size="medium"
                  sx={{ fontSize: '0.875rem' }}
                >
                  Cerrar
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleGoBack}
                size={isTablet ? 'medium' : 'large'}
              >
                Cerrar
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleRestoreClick}
                disabled={!isDirty}
                size={isTablet ? 'medium' : 'large'}
              >
                Restaurar
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={!isDirty}
                size={isTablet ? 'medium' : 'large'}
              >
                Grabar
              </Button>
            </Stack>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCancelRestore}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            m: isMobile ? 2 : 4,
            width: isMobile ? 'calc(100% - 32px)' : 'auto',
          },
        }}
      >
        <DialogTitle sx={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
          Confirmar restauración
        </DialogTitle>
        <DialogContent>
          <Typography variant={isMobile ? 'body2' : 'body1'}>
            ¿Está seguro que desea restaurar los cambios? Se perderán todas las
            modificaciones.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            p: isMobile ? 2 : 3,
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1 : 0,
          }}
        >
          {isMobile ? (
            <>
              <Button
                onClick={handleConfirmRestore}
                color="secondary"
                variant="contained"
                fullWidth
                size="large"
                autoFocus
              >
                Restaurar
              </Button>
              <Button
                onClick={handleCancelRestore}
                color="primary"
                variant="outlined"
                fullWidth
                size="large"
              >
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleCancelRestore} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmRestore}
                color="secondary"
                autoFocus
              >
                Restaurar
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ProductAddHeader
