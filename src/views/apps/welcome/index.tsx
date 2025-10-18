import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import LoadingButton from '@mui/lab/LoadingButton'
import { addLocation } from 'src/store/apps/location'
import locationData from './data/locations.json'
import paymentTermData from './data/paymentType.json'
import clientsData from './data/clients.json'
import productsDataRaw from './data/products.json'

// Type the imported products data correctly
import { ProductType } from 'src/types/apps/productTypes'
const productsData = productsDataRaw as ProductType[]

import { AppDispatch, RootState } from 'src/store'
import { useAuth } from 'src/hooks/useAuth'
import { addSellers, fetchSellers } from 'src/store/apps/seller'
import { addPaymentType } from 'src/store/apps/paymentType'
import { addClients } from 'src/store/apps/clients'
import { addProducts } from 'src/store/apps/products'
import { useRouter } from 'next/router'

const FirstSessionDialog = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const auth = useAuth()
  const router = useRouter()

  // Check localStorage for first session flag
  useEffect(() => {
    const isFirstSession = localStorage.getItem('firstSession')
    if (!isFirstSession && auth.user?.business?.fromPortal) {
      setOpen(true)
    }
  }, [auth])

  const handleClose = () => {
    localStorage.setItem('firstSession', 'false') // Save the flag in localStorage
    setOpen(false)
    router.push('/apps/clients/list/')
  }

  const areRequestSuccessful = async () => {
    const sellerData = [
      {
        codigo: '1',
        nombre: `${auth.user?.firstName.toUpperCase()} ${auth.user?.lastName.toUpperCase()}`,
        email: auth.user?.email || '',
        status: 'A',
        localidad: 1,
      },
    ]

    try {
      await Promise.all([
        dispatch(addLocation(locationData)),
        dispatch(addSellers(sellerData)), // Single action for seller
        dispatch(addPaymentType(paymentTermData)),
      ])
      //After the inicial data are inserted then insert
      await Promise.all([
        dispatch(addClients(clientsData)),
        dispatch(addProducts(productsData)),
      ])
      return true
    } catch (error) {
      console.error('Error during requests:', error)
      return false
    }
  }

  const handleAccept = async () => {
    setLoading(true)

    const response = await areRequestSuccessful()
    if (response) {
      toast.success('Datos creados exitosamente')
      setSuccess(true)
    } else {
      toast.error('Hubo un error al crear los datos')
    }

    setLoading(false)
  }

  const getIconColor = () => (success ? 'green' : 'gray')

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Bienvenido a MSeller</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Le gustaría crear informaciones de demostración?
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Icon
                icon="ri:building-4-line"
                fontSize={20}
                color={getIconColor()}
              />
            </ListItemIcon>
            <ListItemText primary="Localidades" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Icon
                icon="ri:user-2-fill"
                fontSize={20}
                color={getIconColor()}
              />
            </ListItemIcon>
            <ListItemText primary="Vendedor" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Icon
                icon="ri:currency-fill"
                fontSize={20}
                color={getIconColor()}
              />
            </ListItemIcon>
            <ListItemText primary="Condiciones de pago" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Icon
                icon="ri:account-box-fill"
                fontSize={20}
                color={getIconColor()}
              />
            </ListItemIcon>
            <ListItemText primary="Clientes" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Icon
                icon="ri:barcode-box-line"
                fontSize={20}
                color={getIconColor()}
              />
            </ListItemIcon>
            <ListItemText primary="Productos" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Icon
                icon="ri:barcode-box-line"
                fontSize={20}
                color={getIconColor()}
              />
            </ListItemIcon>
            <ListItemText primary="Ofertas" />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        {success ? (
          <Button onClick={handleClose} variant="contained" disabled={loading}>
            Completado
          </Button>
        ) : (
          <LoadingButton
            variant="contained"
            loading={loading}
            onClick={handleAccept}
          >
            Proceder
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default FirstSessionDialog
