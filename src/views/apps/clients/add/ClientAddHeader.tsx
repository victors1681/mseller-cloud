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
} from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useRouter } from 'next/router' // Add this import
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'

interface Props {
  id: string
}

const ProductAddHeader = ({ id }: Props) => {
  const router = useRouter() // Add router
  const store = useSelector((state: RootState) => state.clients)
  const [openDialog, setOpenDialog] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const isCustomerExist = store.customerDetail?.client
  const isNewCustomerWithError = !isCustomerExist && id !== 'new'
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
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {isNewCustomerWithError && (
          <Grid item xs={12}>
            <Alert severity="error">No se encontró el cliente</Alert>
          </Grid>
        )}
        <Grid item xs={12} md={9}>
          <Box>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                wordBreak: 'break-word',
              }}
            >
              {!isCustomerExist
                ? 'Agregar nuevo cliente'
                : `Actualizar ${store.customerDetail?.client?.nombre || ''}`}
            </Typography>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              color="text.secondary"
            >
              Mantenimiento de clientes
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent={{ md: 'flex-end' }}
            sx={{ width: '100%' }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleGoBack}
              size={isSmallMobile ? 'small' : 'medium'}
              fullWidth={isSmallMobile}
            >
              Cerrar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleRestoreClick}
              disabled={!isDirty}
              size={isSmallMobile ? 'small' : 'medium'}
              fullWidth={isSmallMobile}
            >
              Restaurar
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={!isDirty}
              size={isSmallMobile ? 'small' : 'medium'}
              fullWidth={isSmallMobile}
            >
              Grabar
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCancelRestore}>
        <DialogTitle>Confirmar restauración</DialogTitle>
        <DialogContent>
          ¿Está seguro que desea restaurar los cambios? Se perderán todas las
          modificaciones.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRestore} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmRestore} color="secondary" autoFocus>
            Restaurar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ProductAddHeader
