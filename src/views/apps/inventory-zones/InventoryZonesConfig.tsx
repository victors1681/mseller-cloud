// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  configurarZonaProducto,
  configurarZonasMasiva,
  fetchConfiguracionZonas,
} from 'src/store/apps/inventoryZones'

// ** Types
import {
  ConfigurarZonaProductoRequest,
  ConfigurarZonasMasivaRequest,
  ProductoZonaInfo,
} from 'src/types/apps/inventoryTypes'

// ** Toast
import toast from 'react-hot-toast'

// ** Form
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

const InventoryZonesConfig = () => {
  // ** State
  const [expandedZone, setExpandedZone] = useState<string | false>(false)
  const [configurarProductoDialog, setConfigurarProductoDialog] =
    useState(false)
  const [configuracionMasivaDialog, setConfiguracionMasivaDialog] =
    useState(false)
  const [selectedProduct, setSelectedProduct] =
    useState<ProductoZonaInfo | null>(null)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.inventoryZones)

  // ** Available zones (esto podría venir de configuración)
  const availableZones = [
    'ZONA-A',
    'ZONA-B',
    'ZONA-C',
    'ZONA-D',
    'ELECTRODOMESTICOS',
    'ROPA',
    'ALIMENTACION',
    'LIMPIEZA',
  ]

  // ** Form schemas
  const productoSchema = yup.object({
    zona: yup.string().required('La zona es requerida'),
  })

  const masivaSchema = yup.object({
    zona: yup.string().required('La zona es requerida'),
    categoria: yup.string(),
    proveedor: yup.string(),
  })

  // ** Forms
  const productoForm = useForm({
    resolver: yupResolver(productoSchema),
    defaultValues: { zona: '' },
  })

  const masivaForm = useForm({
    resolver: yupResolver(masivaSchema),
    defaultValues: {
      zona: '',
      categoria: '',
      proveedor: '',
    },
  })

  // ** Effects
  useEffect(() => {
    dispatch(fetchConfiguracionZonas())
  }, [dispatch])

  // ** Handlers
  const handleZoneExpansion =
    (zone: string) => (event: any, isExpanded: boolean) => {
      setExpandedZone(isExpanded ? zone : false)
    }

  const handleEditProduct = (product: ProductoZonaInfo) => {
    setSelectedProduct(product)
    productoForm.reset({ zona: product.zona })
    setConfigurarProductoDialog(true)
  }

  const handleConfigureProduct = async (data: { zona: string }) => {
    if (!selectedProduct) return

    try {
      const request: ConfigurarZonaProductoRequest = {
        codigoProducto: selectedProduct.codigoProducto,
        zona: data.zona,
      }

      await dispatch(configurarZonaProducto(request)).unwrap()
      toast.success('Zona del producto actualizada')
      setConfigurarProductoDialog(false)
      dispatch(fetchConfiguracionZonas()) // Refresh data
    } catch (error: any) {
      toast.error(error.message || 'Error al configurar zona')
    }
  }

  const handleMassiveConfiguration = async (data: any) => {
    try {
      const request: ConfigurarZonasMasivaRequest = {
        zona: data.zona,
        criterios: {
          categoria: data.categoria || undefined,
          proveedor: data.proveedor || undefined,
        },
      }

      const result = await dispatch(configurarZonasMasiva(request)).unwrap()
      toast.success(`${result.productosActualizados} productos actualizados`)
      setConfiguracionMasivaDialog(false)
      dispatch(fetchConfiguracionZonas()) // Refresh data
    } catch (error: any) {
      toast.error(error.message || 'Error en configuración masiva')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Configuración de Zonas de Inventario"
            subheader="Gestiona la organización de productos por zonas"
            action={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Icon icon="mdi:cog-outline" />}
                  onClick={() => setConfiguracionMasivaDialog(true)}
                >
                  Configuración Masiva
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Icon icon="mdi:refresh" />}
                  onClick={() => dispatch(fetchConfiguracionZonas())}
                  disabled={store.loading}
                >
                  Actualizar
                </Button>
              </Box>
            }
          />
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            {Object.entries(store.configuracionZonas).map(
              ([zona, productos]) => (
                <Accordion
                  key={zona}
                  expanded={expandedZone === zona}
                  onChange={handleZoneExpansion(zona)}
                  sx={{ mb: 2 }}
                >
                  <AccordionSummary
                    expandIcon={<Icon icon="mdi:chevron-down" />}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%',
                      }}
                    >
                      <Typography variant="h6">{zona}</Typography>
                      <Chip
                        label={`${productos.length} productos`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {productos.map((producto) => (
                        <ListItem key={producto.codigoProducto} divider>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {producto.codigoProducto}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {producto.nombreProducto}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Cantidad: {producto.cantidadActual} |
                                  Ubicación:{' '}
                                  {producto.ubicacion || 'Sin ubicar'}
                                </Typography>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => handleEditProduct(producto)}
                            >
                              <Icon icon="mdi:pencil-outline" />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ),
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Dialog para configurar producto individual */}
      <Dialog
        open={configurarProductoDialog}
        onClose={() => setConfigurarProductoDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Configurar Zona - {selectedProduct?.codigoProducto}
        </DialogTitle>
        <form onSubmit={productoForm.handleSubmit(handleConfigureProduct)}>
          <DialogContent>
            <Grid container spacing={4} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Producto: {selectedProduct?.nombreProducto}
                </Typography>
                <Controller
                  name="zona"
                  control={productoForm.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Nueva Zona</InputLabel>
                      <Select {...field} label="Nueva Zona">
                        {availableZones.map((zona) => (
                          <MenuItem key={zona} value={zona}>
                            {zona}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfigurarProductoDialog(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Actualizar Zona
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog para configuración masiva */}
      <Dialog
        open={configuracionMasivaDialog}
        onClose={() => setConfiguracionMasivaDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Configuración Masiva de Zonas</DialogTitle>
        <form onSubmit={masivaForm.handleSubmit(handleMassiveConfiguration)}>
          <DialogContent>
            <Grid container spacing={4} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Controller
                  name="zona"
                  control={masivaForm.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Zona Destino</InputLabel>
                      <Select {...field} label="Zona Destino">
                        {availableZones.map((zona) => (
                          <MenuItem key={zona} value={zona}>
                            {zona}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Criterios de Filtrado (Opcional)
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="categoria"
                  control={masivaForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Categoría"
                      placeholder="Ej: Electrónica"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="proveedor"
                  control={masivaForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Proveedor"
                      placeholder="Ej: Samsung"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfiguracionMasivaDialog(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Aplicar Configuración
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  )
}

export default InventoryZonesConfig
