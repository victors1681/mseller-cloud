// MUI Imports
import { RootState } from '@/store'
import {
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router' // Add this import
import { useState } from 'react'

interface Props {
  id: string
}

const ProductAddHeader = ({ id }: Props) => {
  const router = useRouter() // Add router
  const store = useSelector((state: RootState) => state.clients)
  const [openDialog, setOpenDialog] = useState(false)

  const isCustomerExist = store.customerDetail
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
      <Grid container spacing={4}>
        {isNewCustomerWithError && (
          <Grid item sm={12}>
            <Alert severity="error">No se encontró el cliente</Alert>
          </Grid>
        )}
        <Grid item sm={6} md={9}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {!isCustomerExist
              ? 'Agregar nuevo cliente'
              : `Actualizar ${store.customerDetail?.client?.nombre}`}
          </Typography>
          <Typography>Mantenimiento de productos</Typography>
        </Grid>
        <Grid item sm={6} md={3}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGoBack}
            sx={{ marginRight: 1 }}
          >
            Cerrar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ marginRight: 1 }}
            onClick={handleRestoreClick}
            disabled={!isDirty}
          >
            Restaurar
          </Button>
          <Button variant="contained" type="submit" disabled={!isDirty}>
            Grabar
          </Button>
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
