// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useEffect, forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { DocumentType, TipoDocumentoEnum } from 'src/types/apps/documentTypes'
import { ProductType } from 'src/types/apps/productTypes'
import { CustomerType } from 'src/types/apps/customerType'
import {
  addUpdateDocument,
  toggleEditDocument,
  fetchDocumentDetails,
} from 'src/store/apps/documents'

// ** Utils Imports
import formatCurrency from 'src/utils/formatCurrency'

// ** Components Imports
import ProductSearchDialog from 'src/views/ui/productsSearchDialog'
import { useProductSearchDialog } from 'src/views/ui/productsSearchDialog/useProductSearchDialog'
import CustomerSearchDialog from 'src/views/ui/customerSearchDialog'
import { useCustomerSearchDialog } from 'src/views/ui/customerSearchDialog/useCustomerSearchDialog'
import { SellerAutocomplete } from 'src/views/ui/sellerAutoComplete'
import { PaymentTypeAutocomplete } from 'src/views/ui/paymentTypeAutoComplete'

// ** Types
import type { DocumentTypeDetail } from 'src/types/apps/documentTypes'

interface EditDocumentDialogProps {
  open: boolean
}

interface NewDetailForm {
  codigoProducto: string
  cantidad: number
  precio: number
  unidad: string
  descripcion: string
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const schema = yup.object().shape({
  codigoCliente: yup
    .string()
    .max(50, 'El código del cliente no debe exceder 50 caracteres')
    .required('Código del cliente es requerido'),

  codigoVendedor: yup
    .string()
    .max(50, 'El código del vendedor no debe exceder 50 caracteres')
    .required('Código del vendedor es requerido'),

  nota: yup.string().max(500, 'La nota no debe exceder 500 caracteres'),

  condicionPago: yup
    .string()
    .max(50, 'La condición de pago no debe exceder 50 caracteres'),

  tipoPedido: yup
    .string()
    .max(50, 'El tipo de pedido no debe exceder 50 caracteres'),

  fecha: yup.string().required('La fecha es requerida'),

  tipoDocumento: yup
    .string()
    .oneOf(
      Object.values(TipoDocumentoEnum),
      'Debe seleccionar un tipo de documento válido',
    )
    .required('Tipo de documento es requerido'),

  confirmado: yup.boolean(),

  nuevoCliente: yup.boolean(),
})

const defaultValues: Partial<DocumentType> = {
  codigoCliente: '',
  codigoVendedor: '',
  nota: '',
  condicionPago: '',
  tipoPedido: '',
  fecha: '',
  tipoDocumento: TipoDocumentoEnum.ORDER,
  confirmado: false,
  nuevoCliente: false,
}

const EditDocumentDialog = (props: EditDocumentDialogProps) => {
  // ** Props
  const { open } = props

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.documents)
  const productStore = useSelector((state: RootState) => state.products)
  const toggle = () => dispatch(toggleEditDocument(null))

  // ** Local State for Detail Management
  const [detailsData, setDetailsData] = useState<DocumentTypeDetail[]>([])
  const [newDetailForm, setNewDetailForm] = useState<NewDetailForm>({
    codigoProducto: '',
    cantidad: 1,
    precio: 0,
    unidad: '',
    descripcion: '',
  })
  const [isEditingDetail, setIsEditingDetail] = useState<number | null>(null)
  const [selectedCustomerData, setSelectedCustomerData] = useState<{
    nombreCliente?: string
    vendedor?: {
      nombre?: string
      codigo?: string
      email?: string
      status?: string
      localidad?: number
    }
  } | null>(null)

  // ** Product Search Dialog
  const productSearchDialog = useProductSearchDialog({
    onProductSelect: (
      product: ProductType & {
        selectedPrice?: number
        selectedPriceLabel?: string
      },
    ) => {
      // Set the product code in the detail form
      setDetailValue('codigoProducto', product.codigo)

      // Use selected price if available, otherwise fallback to precio1
      const selectedPrice = product.selectedPrice || product.precio1 || 0

      // Update the local form state
      setNewDetailForm((prev) => ({
        ...prev,
        codigoProducto: product.codigo,
        descripcion: product.nombre || `Producto ${product.codigo}`,
        unidad: product.unidad || 'UND',
        precio: selectedPrice,
      }))

      // Set the price in the form
      setDetailValue('precio', selectedPrice)
    },
    autoClose: true,
  })

  // ** Customer Search Dialog
  const customerSearchDialog = useCustomerSearchDialog({
    onCustomerSelect: (customer: CustomerType) => {
      // Set the customer code in the form
      setValue('codigoCliente', customer.codigo)

      // Set the vendor code from customer data
      setValue('codigoVendedor', customer.codigoVendedor)

      // Store customer data locally to update the display fields
      setSelectedCustomerData({
        nombreCliente: customer.nombre,
        vendedor: customer.vendedor
          ? {
              codigo: customer.codigoVendedor,
              nombre: customer.vendedor.nombre || '',
              email: customer.vendedor.email || '',
              status: customer.vendedor.status || '',
              localidad: customer.vendedor.localidad || 0,
            }
          : {
              codigo: customer.codigoVendedor,
              nombre: '',
              email: '',
              status: '',
              localidad: 0,
            },
      })
    },
    autoClose: true,
  })

  // ** Detail Management Functions
  const handleEditDetail = (detail: DocumentTypeDetail, index: number) => {
    setNewDetailForm({
      codigoProducto: detail.codigoProducto,
      cantidad: detail.cantidad,
      precio: detail.precio,
      descripcion: detail.descripcion,
      unidad: detail.unidad,
    })
    // Also set the detail form values
    setDetailValue('codigoProducto', detail.codigoProducto)
    setDetailValue('cantidad', detail.cantidad)
    setDetailValue('precio', detail.precio)
    setIsEditingDetail(index)
  }

  const handleDeleteDetail = (index: number) => {
    const updatedDetails = detailsData.filter((_, i) => i !== index)
    setDetailsData(updatedDetails)

    // If we're editing this detail, clear the form
    if (isEditingDetail === index) {
      setNewDetailForm({
        codigoProducto: '',
        cantidad: 1,
        precio: 0,
        descripcion: '',
        unidad: '',
      })
      resetDetailForm({
        codigoProducto: '',
        cantidad: 1,
        precio: 0,
      })
      setIsEditingDetail(null)
    } else if (isEditingDetail !== null && isEditingDetail > index) {
      // Adjust editing index if needed
      setIsEditingDetail(isEditingDetail - 1)
    }

    toast.success('Línea de detalle eliminada')
  }

  const handleSaveDetail = () => {
    if (!newDetailForm.codigoProducto.trim()) {
      toast.error('El código del producto es requerido')
      return
    }

    if (newDetailForm.cantidad <= 0) {
      toast.error('La cantidad debe ser mayor a 0')
      return
    }

    if (newDetailForm.precio < 0) {
      toast.error('El precio no puede ser negativo')
      return
    }

    const newDetail: DocumentTypeDetail = {
      id: Date.now().toString(),
      noPedidoStr: store.documentEditData?.noPedidoStr || '',
      noPedido: store.documentEditData?.noPedido || 0,
      codigoVendedor: store.documentEditData?.codigoVendedor || '',
      codigoProducto: newDetailForm.codigoProducto,
      cantidad: newDetailForm.cantidad,
      descripcion:
        newDetailForm.descripcion || `Producto ${newDetailForm.codigoProducto}`, // Use form descripcion or fallback
      precio: newDetailForm.precio,
      impuesto: 0,
      porcientoImpuesto: 0,
      descuento: 0,
      porcientoDescuento: 0,
      factor: 1,
      factorOriginal: 1,
      isc: 0,
      adv: 0,
      subTotal: newDetailForm.cantidad * newDetailForm.precio,
      editar: 1,
      productoRef: '',
      idArea: 0,
      grupoId: '',
      area: '',
      unidad: newDetailForm.unidad, // Default unit
      tipoImpuesto: '',
      cantidadOriginal: newDetailForm.cantidad,
      promocion: false,
    }

    let updatedDetails: DocumentTypeDetail[]

    if (isEditingDetail !== null) {
      // Update existing detail
      updatedDetails = detailsData.map((detail, index) =>
        index === isEditingDetail ? newDetail : detail,
      )
      toast.success('Línea de detalle actualizada')
      setIsEditingDetail(null)
    } else {
      // Add new detail
      updatedDetails = [...detailsData, newDetail]
      toast.success('Línea de detalle agregada')
    }

    setDetailsData(updatedDetails)

    // Clear form
    setNewDetailForm({
      codigoProducto: '',
      cantidad: 1,
      precio: 0,
      descripcion: '',
      unidad: '',
    })
    resetDetailForm({
      codigoProducto: '',
      cantidad: 1,
      precio: 0,
    })
    productSearchDialog.clearSelection()
  }

  const handleCancelEdit = () => {
    setNewDetailForm({
      codigoProducto: '',
      cantidad: 1,
      precio: 0,
      descripcion: '',
      unidad: '',
    })
    resetDetailForm({
      codigoProducto: '',
      cantidad: 1,
      precio: 0,
    })
    setIsEditingDetail(null)
    productSearchDialog.clearSelection()
  }

  const { reset, control, handleSubmit, watch, setValue } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  // Detail form for ProductAutoComplete
  const {
    control: detailControl,
    handleSubmit: handleDetailSubmit,
    reset: resetDetailForm,
    watch: watchDetail,
    setValue: setDetailValue,
  } = useForm({
    defaultValues: {
      codigoProducto: '',
      cantidad: 1,
      precio: 0,
    },
  })

  // Watch for changes in the detail form
  const watchedDetailValues = watchDetail()

  // Sync detail form with newDetailForm state
  //   useEffect(() => { infinite loop
  //     setNewDetailForm({
  //       codigoProducto: watchedDetailValues.codigoProducto || '',
  //       cantidad: watchedDetailValues.cantidad || 1,
  //       precio: watchedDetailValues.precio || 0,
  //       descripcion: newDetailForm.descripcion, // Keep existing description
  //       unidad: newDetailForm.unidad || '', // Keep existing unit
  //     })
  //   }, [watchedDetailValues])

  // Custom Input Component for DatePicker
  const CustomDateInput = ({ value, onClick, label, ...props }: any) => {
    return (
      <TextField
        {...props}
        fullWidth
        label={label}
        value={value}
        onClick={onClick}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          readOnly: true,
        }}
      />
    )
  }

  useEffect(() => {
    if (open && store.documentEditData && store.documentEditData.noPedidoStr) {
      // Fetch complete document details when dialog opens
      dispatch(fetchDocumentDetails(store.documentEditData.noPedidoStr))
    }
  }, [open, store.documentEditData?.noPedidoStr, dispatch])

  useEffect(() => {
    if (store.documentEditData && !store.isLoadingDetails) {
      const editData = { ...store.documentEditData }

      // Format date for DatePicker
      if (editData.fecha) {
        const dateValue = new Date(editData.fecha).toISOString().split('T')[0]
        editData.fecha = dateValue
      }

      // Sync details data
      setDetailsData(editData.detalle || [])

      // Clear any selected customer data when document data is loaded
      setSelectedCustomerData(null)

      reset(editData)
    } else {
      reset(defaultValues)
      setDetailsData([])
      setSelectedCustomerData(null)
    }
  }, [store.documentEditData, store.isLoadingDetails, reset])

  const onSubmit = async (data: Partial<DocumentType>) => {
    if (!store.documentEditData) {
      toast.error('No hay datos de documento para editar')
      return
    }

    const updatedDocument: DocumentType = {
      ...store.documentEditData,
      ...data,
      detalle: detailsData, // Include the locally managed details
    }

    // Convert date back to ISO format if needed
    if (data.fecha) {
      const dateObj = new Date(data.fecha + 'T00:00:00')
      updatedDocument.fecha = dateObj.toISOString()
    }

    try {
      const response = await dispatch(
        addUpdateDocument(updatedDocument),
      ).unwrap()

      if (response.success) {
        toggle()
        reset()
        setDetailsData([])
        setNewDetailForm({
          codigoProducto: '',
          cantidad: 1,
          precio: 0,
          descripcion: '',
          unidad: '',
        })
        resetDetailForm({
          codigoProducto: '',
          cantidad: 1,
          precio: 0,
        })
        setIsEditingDetail(null)
        toast.success('Documento actualizado exitosamente')
      } else {
        toast.error(response.message || 'Error actualizando el documento')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Error inesperado al actualizar el documento')
    }
  }

  const handleClose = () => {
    toggle()
    reset()
    setDetailsData([])
    setNewDetailForm({
      codigoProducto: '',
      cantidad: 1,
      precio: 0,
      descripcion: '',
      unidad: '',
    })
    resetDetailForm({
      codigoProducto: '',
      cantidad: 1,
      precio: 0,
    })
    setIsEditingDetail(null)
    setSelectedCustomerData(null)
    productSearchDialog.clearSelection()
    customerSearchDialog.clearSelection()
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <DatePickerWrapper>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <Icon icon="mdi:close" />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1, color: 'white' }}
              variant="h6"
              component="div"
            >
              Editar Documento
            </Typography>
            <Button
              autoFocus
              color="inherit"
              type="submit"
              form="document-form"
              disabled={store.isLoadingDetails}
            >
              {store.isLoadingDetails ? 'Cargando...' : 'Guardar'}
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3, overflow: 'auto' }}>
          {store.isLoadingDetails ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 400,
              }}
            >
              <CircularProgress size={60} />
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} id="document-form">
              <Grid container spacing={3} maxWidth="lg" sx={{ mx: 'auto' }}>
                {/* Read-only Information Section */}
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Información de Solo Lectura" />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={3}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              No. Pedido
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {store.documentEditData?.noPedidoStr || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              Descuento
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {formatCurrency(
                                store.documentEditData?.descuento || 0,
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              % Descuento
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {store.documentEditData?.porcientoDescuento || 0}%
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              Impuesto
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {formatCurrency(
                                store.documentEditData?.impuesto || 0,
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              Sub Total
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {formatCurrency(
                                store.documentEditData?.subTotal || 0,
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              Total
                            </Typography>
                            <Typography
                              variant="h6"
                              color="primary"
                              fontWeight="bold"
                            >
                              {formatCurrency(
                                store.documentEditData?.total || 0,
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              NCF
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {store.documentEditData?.ncf || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              Descripción NCF
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {store.documentEditData?.ncfDescripcion || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              Status
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <Typography variant="body1" fontWeight="medium">
                                {store.documentEditData?.status || '-'}
                              </Typography>
                              {store.documentEditData?.anulado && (
                                <Chip
                                  label="ANULADO"
                                  color="error"
                                  variant="filled"
                                  size="small"
                                />
                              )}
                            </Box>
                          </Box>
                        </Grid>

                        {store.documentEditData?.mensajesError && (
                          <Grid item xs={12}>
                            <Box>
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mb: 0.5, display: 'block' }}
                              >
                                Mensajes de Error
                              </Typography>
                              <Typography
                                variant="body2"
                                color="error"
                                sx={{
                                  p: 2,
                                  backgroundColor: 'error.light',
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'error.main',
                                }}
                              >
                                {store.documentEditData.mensajesError}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Editable Fields Section */}
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    {/* Left Block - Customer Information */}
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader title="Información del Cliente" />
                        <CardContent>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Controller
                                name="codigoCliente"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    size="small"
                                    disabled
                                    label="Código del Cliente"
                                    error={!!error}
                                    helperText={error?.message}
                                    autoComplete="off"
                                    InputProps={{
                                      endAdornment: (
                                        <IconButton
                                          size="small"
                                          onClick={
                                            customerSearchDialog.openDialog
                                          }
                                          title="Buscar cliente"
                                          sx={{ mr: 1 }}
                                        >
                                          <Icon
                                            icon="mdi:magnify"
                                            fontSize="1.25rem"
                                          />
                                        </IconButton>
                                      ),
                                    }}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Controller
                                name="nombreCliente"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    disabled
                                    size="small"
                                    label="Nombre del Cliente"
                                    value={
                                      selectedCustomerData?.nombreCliente ||
                                      store.documentEditData?.nombreCliente ||
                                      '-'
                                    }
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    variant="outlined"
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Controller
                                name="codigoVendedor"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                  <SellerAutocomplete
                                    selectedSellers={field.value || ''}
                                    multiple={false}
                                    sx={{ mt: 0, ml: 0 }}
                                    size="small"
                                    callBack={(selectedCode: string) => {
                                      setValue(
                                        'codigoVendedor',
                                        selectedCode || '',
                                      )
                                    }}
                                  />
                                )}
                              />
                              {/* Display any validation errors */}
                              {control._formState.errors.codigoVendedor && (
                                <Typography
                                  variant="caption"
                                  color="error"
                                  sx={{ mt: 1, ml: 2, display: 'block' }}
                                >
                                  {
                                    control._formState.errors.codigoVendedor
                                      ?.message
                                  }
                                </Typography>
                              )}
                            </Grid>
                            <Grid item xs={12}>
                              <Controller
                                name="condicionPago"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <PaymentTypeAutocomplete
                                    size="small"
                                    selectedPaymentType={value}
                                    callBack={(newValue) => {
                                      onChange(newValue)
                                    }}
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Right Block - Document Information */}
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader title="Información del Documento" />
                        <CardContent>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Controller
                                name="fecha"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="Fecha"
                                    error={!!error}
                                    helperText={error?.message}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Controller
                                name="tipoDocumento"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                  <FormControl
                                    fullWidth
                                    error={!!error}
                                    size="small"
                                  >
                                    <InputLabel>Tipo de Documento</InputLabel>
                                    <Select
                                      {...field}
                                      label="Tipo de Documento"
                                    >
                                      <MenuItem value={TipoDocumentoEnum.ORDER}>
                                        Orden
                                      </MenuItem>
                                      <MenuItem value={TipoDocumentoEnum.QUOTE}>
                                        Cotización
                                      </MenuItem>
                                    </Select>
                                    {error && (
                                      <Typography
                                        variant="caption"
                                        color="error"
                                        sx={{ mt: 1, ml: 2 }}
                                      >
                                        {error.message}
                                      </Typography>
                                    )}
                                  </FormControl>
                                )}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Controller
                                name="tipoPedido"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    size="small"
                                    label="Tipo de Pedido"
                                    error={!!error}
                                    helperText={error?.message}
                                    autoComplete="off"
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Localidad"
                                value={
                                  store.documentEditData?.localidad
                                    ?.descripcion || 'N/A'
                                }
                                InputProps={{
                                  readOnly: true,
                                }}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Controller
                                name="confirmado"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={value}
                                        onChange={(e) =>
                                          onChange(e.target.checked)
                                        }
                                      />
                                    }
                                    label="Confirmado"
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Document Details Table */}
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Detalles del Documento" />
                    <CardContent>
                      <TableContainer component={Paper}>
                        <Table
                          sx={{ minWidth: 650 }}
                          aria-label="document details table"
                          size="small"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ py: 1 }}>Código</TableCell>
                              <TableCell sx={{ py: 1 }}>Descripción</TableCell>
                              <TableCell sx={{ py: 1 }}>Unidad</TableCell>
                              <TableCell align="right" sx={{ py: 1 }}>
                                Cant.
                              </TableCell>
                              <TableCell align="right" sx={{ py: 1 }}>
                                Precio
                              </TableCell>
                              <TableCell align="right" sx={{ py: 1 }}>
                                % Imp.
                              </TableCell>
                              <TableCell align="right" sx={{ py: 1 }}>
                                % Desc.
                              </TableCell>
                              <TableCell align="right" sx={{ py: 1 }}>
                                Subtotal
                              </TableCell>
                              <TableCell align="center" sx={{ py: 1 }}>
                                Promo
                              </TableCell>
                              <TableCell align="center" sx={{ py: 1 }}>
                                Acciones
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {detailsData?.map((detail, index) => (
                              <TableRow
                                key={detail.id || index}
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                  backgroundColor:
                                    isEditingDetail === index
                                      ? 'action.hover'
                                      : 'inherit',
                                }}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ py: 0.5 }}
                                >
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                    sx={{ fontSize: '0.75rem' }}
                                  >
                                    {detail.codigoProducto}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ py: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: '0.75rem' }}
                                  >
                                    {detail.descripcion}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ py: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: '0.75rem' }}
                                  >
                                    {detail.unidad}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: '0.75rem' }}
                                  >
                                    {detail.cantidad.toLocaleString()}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: '0.75rem' }}
                                  >
                                    {formatCurrency(detail.precio)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: '0.75rem' }}
                                  >
                                    {detail.porcientoImpuesto}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: '0.75rem' }}
                                  >
                                    {detail.porcientoDescuento}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                    sx={{ fontSize: '0.75rem' }}
                                  >
                                    {formatCurrency(detail.subTotal)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center" sx={{ py: 0.5 }}>
                                  {detail.promocion ? (
                                    <Chip
                                      label="Sí"
                                      color="success"
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        fontSize: '0.65rem',
                                        height: '20px',
                                      }}
                                    />
                                  ) : (
                                    <Chip
                                      label="No"
                                      color="default"
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        fontSize: '0.65rem',
                                        height: '20px',
                                      }}
                                    />
                                  )}
                                </TableCell>
                                <TableCell align="center" sx={{ py: 0.5 }}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      gap: 0.5,
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() =>
                                        handleEditDetail(detail, index)
                                      }
                                      title="Editar línea"
                                      sx={{ p: 0.5 }}
                                    >
                                      <Icon
                                        icon="mdi:pencil"
                                        fontSize="0.875rem"
                                      />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteDetail(index)}
                                      title="Eliminar línea"
                                      sx={{ p: 0.5 }}
                                    >
                                      <Icon
                                        icon="mdi:delete"
                                        fontSize="0.875rem"
                                      />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                            {(!detailsData || detailsData.length === 0) && (
                              <TableRow>
                                <TableCell colSpan={10} align="center">
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    No hay detalles disponibles
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Add/Edit Detail Lines Section */}
                <Grid item xs={12}>
                  <Card>
                    <CardHeader
                      title={
                        isEditingDetail !== null
                          ? 'Editar Línea de Detalle'
                          : 'Agregar Línea de Detalle'
                      }
                      action={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {isEditingDetail !== null && (
                            <Button
                              variant="outlined"
                              color="secondary"
                              startIcon={<Icon icon="mdi:close" />}
                              onClick={handleCancelEdit}
                            >
                              Cancelar
                            </Button>
                          )}
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={
                              <Icon
                                icon={
                                  isEditingDetail !== null
                                    ? 'mdi:check'
                                    : 'mdi:plus'
                                }
                              />
                            }
                            onClick={handleSaveDetail}
                          >
                            {isEditingDetail !== null
                              ? 'Actualizar'
                              : 'Agregar'}
                          </Button>
                        </Box>
                      }
                    />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                          <Controller
                            name="codigoProducto"
                            control={detailControl}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                fullWidth
                                size="small"
                                disabled
                                label="Código Producto"
                                placeholder="Código del producto"
                                error={!!error}
                                helperText={error?.message}
                                sx={{
                                  '& .MuiInputBase-root': {
                                    fontSize: '0.875rem',
                                  },
                                }}
                                InputProps={{
                                  endAdornment: (
                                    <IconButton
                                      size="small"
                                      onClick={productSearchDialog.openDialog}
                                      title="Buscar producto"
                                      sx={{ mr: 1 }}
                                    >
                                      <Icon
                                        icon="mdi:magnify"
                                        fontSize="1.25rem"
                                      />
                                    </IconButton>
                                  ),
                                }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Controller
                            name="cantidad"
                            control={detailControl}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                fullWidth
                                size="small"
                                type="number"
                                label="Cantidad"
                                placeholder="1"
                                error={!!error}
                                helperText={error?.message}
                                inputProps={{ min: 1 }}
                                autoComplete="off"
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 1)
                                }
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Controller
                            name="precio"
                            control={detailControl}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                fullWidth
                                size="small"
                                type="number"
                                label="Precio"
                                placeholder="0.00"
                                error={!!error}
                                helperText={error?.message}
                                inputProps={{ min: 0, step: 0.01 }}
                                autoComplete="off"
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                              />
                            )}
                          />
                        </Grid>

                        {/* Description Display - Read Only */}
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              p: 1.5,
                              backgroundColor: 'grey.50',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'grey.300',
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              Descripción del Producto
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: '0.85rem', minHeight: '1.2rem' }}
                            >
                              {newDetailForm.descripcion ||
                                (newDetailForm.codigoProducto
                                  ? `Producto ${newDetailForm.codigoProducto}`
                                  : 'Se mostrará la descripción del producto seleccionado')}
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Instructions */}
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              p: 1.5,
                              backgroundColor:
                                isEditingDetail !== null
                                  ? 'warning.light'
                                  : 'info.light',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor:
                                isEditingDetail !== null
                                  ? 'warning.main'
                                  : 'info.light',
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: '0.8rem' }}
                              color={
                                isEditingDetail !== null
                                  ? 'warning.dark'
                                  : 'dark'
                              }
                            >
                              <strong>
                                {isEditingDetail !== null
                                  ? 'Editando línea:'
                                  : 'Instrucciones:'}
                              </strong>
                              <br />
                              {isEditingDetail !== null ? (
                                <>
                                  • Modifique los campos necesarios y haga clic
                                  en "Actualizar" para guardar los cambios
                                  <br />• Haga clic en "Cancelar" para descartar
                                  los cambios
                                </>
                              ) : (
                                <>
                                  • Ingrese el código del producto, cantidad y
                                  precio para agregar una nueva línea
                                  <br />• Los campos de descripción, unidad e
                                  impuestos se completarán automáticamente
                                  <br />• Para editar una línea existente, haga
                                  clic en el ícono de edición en la tabla
                                  superior
                                  <br />• El subtotal se calculará
                                  automáticamente
                                </>
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Additional Information Section */}
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Información Adicional" />
                    <CardContent>
                      <Grid container spacing={3}>
                        {/* Nota - Editable */}
                        <Grid item xs={12}>
                          <Controller
                            name="nota"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                fullWidth
                                size="small"
                                multiline
                                rows={3}
                                label="Nota"
                                error={!!error}
                                helperText={error?.message}
                                autoComplete="off"
                              />
                            )}
                          />
                        </Grid>

                        {/* ISC - Read Only */}
                        <Grid item xs={12} sm={3}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              ISC
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {formatCurrency(store.documentEditData?.isc || 0)}
                            </Typography>
                          </Box>
                        </Grid>

                        {/* ADV - Read Only */}
                        <Grid item xs={12} sm={3}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              ADV
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {formatCurrency(store.documentEditData?.adv || 0)}
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Cliente Nuevo (Read Only) */}
                        <Grid item xs={12} sm={3}>
                          <Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mb: 0.5, display: 'block' }}
                            >
                              Cliente Nuevo (Solo Lectura)
                            </Typography>
                            <Chip
                              label={
                                store.documentEditData?.clienteNuevo
                                  ? 'Sí'
                                  : 'No'
                              }
                              color={
                                store.documentEditData?.clienteNuevo
                                  ? 'success'
                                  : 'default'
                              }
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                        </Grid>

                        {/* Nuevo Cliente (Editable Switch) */}
                        <Grid item xs={12} sm={3}>
                          <Controller
                            name="nuevoCliente"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={value}
                                    onChange={(e) => onChange(e.target.checked)}
                                  />
                                }
                                label="Nuevo Cliente (Editable)"
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </form>
          )}
        </Box>
      </DatePickerWrapper>

      {/* Product Search Dialog */}
      <ProductSearchDialog
        open={productSearchDialog.dialogOpen}
        onClose={productSearchDialog.closeDialog}
        onSelectProduct={productSearchDialog.handleSelectProduct}
        title="Buscar y Seleccionar Producto"
        maxWidth="lg"
      />

      {/* Customer Search Dialog */}
      <CustomerSearchDialog
        open={customerSearchDialog.dialogOpen}
        onClose={customerSearchDialog.closeDialog}
        onSelectCustomer={customerSearchDialog.handleSelectCustomer}
        title="Buscar y Seleccionar Cliente"
        maxWidth="lg"
      />
    </Dialog>
  )
}

export default EditDocumentDialog
