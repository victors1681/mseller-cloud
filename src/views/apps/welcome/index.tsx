import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import Icon from 'src/@core/components/icon'
import { useFirebase } from 'src/firebase/useFirebase'
import { useAuth } from 'src/hooks/useAuth'

const FirstSessionDialog = () => {
  const [open, setOpen] = useState(false)
  const auth = useAuth()
  const firebase = useFirebase()
  const router = useRouter()

  // Check if user has seen welcome dialog
  useEffect(() => {
    if (auth.user && !auth.user.hasSeenWelcome) {
      setOpen(true)
    }
  }, [auth.user])

  const handleClose = async () => {
    if (auth.user?.userId) {
      try {
        // Update Firebase to mark welcome as seen
        await firebase.updateUserProfile({
          userId: auth.user.userId,
          hasSeenWelcome: true,
        })

        // Refresh user data
        await auth.signInByToken()
      } catch (error) {
        console.error('Error updating welcome flag:', error)
      }
    }
    setOpen(false)
  }

  const handleAction = (path: string) => {
    handleClose()
    router.push(path)
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ textAlign: 'center', py: 6 }}>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Icon icon="mdi:party-popper" fontSize={80} color="primary" />
        </Box>

        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          ¡Bienvenido a MSeller!
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Estamos emocionados de tenerte aquí. Comienza a gestionar tu negocio
          de manera más eficiente.
        </Typography>

        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Primeros pasos recomendados:
        </Typography>

        <List sx={{ textAlign: 'left' }}>
          <ListItem
            button
            onClick={() => handleAction('/apps/clients/list')}
            sx={{
              borderRadius: 1,
              mb: 1,
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <ListItemIcon>
              <Icon icon="mdi:account-plus" fontSize={24} color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Agrega tu primer cliente"
              secondary="Comienza registrando tus clientes"
            />
          </ListItem>

          <ListItem
            button
            onClick={() => handleAction('/apps/products/list')}
            sx={{
              borderRadius: 1,
              mb: 1,
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <ListItemIcon>
              <Icon icon="mdi:package-variant" fontSize={24} color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Registra tus productos"
              secondary="Crea tu catálogo de productos"
            />
          </ListItem>

          <ListItem
            button
            onClick={() => handleAction('/apps/documents/facturas/')}
            sx={{
              borderRadius: 1,
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <ListItemIcon>
              <Icon icon="mdi:file-document" fontSize={24} color="info" />
            </ListItemIcon>
            <ListItemText
              primary="Crea tu primera factura"
              secondary="Comienza a facturar a tus clientes"
            />
          </ListItem>
        </List>
      </DialogContent>

      <DialogActions sx={{ px: 6, pb: 4 }}>
        <Button onClick={handleClose} variant="outlined" size="large">
          Cerrar
        </Button>
        <Button
          onClick={() => handleAction('/apps/clients/list')}
          variant="contained"
          size="large"
        >
          Comenzar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FirstSessionDialog
