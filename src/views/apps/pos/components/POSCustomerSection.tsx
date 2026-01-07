import { yupResolver } from '@hookform/resolvers/yup'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { CustomerType } from 'src/types/apps/customerType'
import { NewCustomerFormData, POSCustomer } from 'src/types/apps/posTypes'
import CustomerSearchDialog from 'src/views/ui/customerSearchDialog'
import { CustomerTypeAutocomplete } from 'src/views/ui/customerTypeAutocomplete'
import * as yup from 'yup'

// ** Validation Schema
const newCustomerSchema = yup.object({
  nombre: yup.string().required('Nombre es requerido'),
  telefono: yup
    .string()
    .test(
      'phone-format',
      'Formato de teléfono inválido (10 dígitos)',
      (value) => {
        if (!value) return true // Optional
        const phoneRegex = /^(1)?[2-9]\d{2}[2-9]\d{6}$|^(809|829|849)\d{7}$/
        return phoneRegex.test(value.replace(/[\s-()]/g, ''))
      },
    ),
  tipoCliente: yup.string(),
  rnc: yup
    .string()
    .test('rnc-format', 'RNC debe tener 9 u 11 dígitos', (value) => {
      if (!value) return true // Will be checked by required test
      const cleanRnc = value.replace(/[^0-9]/g, '')
      return cleanRnc.length === 9 || cleanRnc.length === 11
    })
    .test(
      'rnc-required',
      'RNC es requerido para este tipo de comprobante',
      function (value) {
        const { tipoCliente } = this.parent
        // RNC is mandatory if tipoCliente is NOT '02' or '32'
        if (tipoCliente && tipoCliente !== '02' && tipoCliente !== '32') {
          return !!value
        }
        return true
      },
    ),
  email: yup.string().email('Formato de email inválido').optional(),
  direccion: yup.string(),
})

const StyledCustomerCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  flexShrink: 0, // Don't shrink this component
}))

const StyledCustomerInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5),
}))

const StyledCustomerDetails = styled(Box)({
  flex: 1,
  minWidth: 0,
})

interface POSCustomerSectionProps {
  customer: POSCustomer | null
  onCustomerSelect: (customer: CustomerType) => void
  onNewCustomer: (customerData: NewCustomerFormData) => void
  onClearCustomer: () => void
}

const POSCustomerSection: React.FC<POSCustomerSectionProps> = ({
  customer,
  onCustomerSelect,
  onNewCustomer,
  onClearCustomer,
}) => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [newCustomerDialogOpen, setNewCustomerDialogOpen] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<NewCustomerFormData>({
    resolver: yupResolver(newCustomerSchema),
    mode: 'onChange',
    defaultValues: {
      nombre: '',
      telefono: '',
      email: '',
      direccion: '',
      rnc: '',
      tipoCliente: '',
    },
  })

  const onSubmit = (data: NewCustomerFormData) => {
    onNewCustomer(data)
    setNewCustomerDialogOpen(false)
    reset()
  }

  const handleDialogClose = () => {
    setNewCustomerDialogOpen(false)
    reset()
  }

  const getCustomerInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <StyledCustomerCard>
        <CardHeader
          title="Cliente"
          titleTypographyProps={{
            variant: 'subtitle1',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
          action={
            customer && (
              <IconButton size="small" onClick={onClearCustomer}>
                <Icon icon="mdi:close" fontSize="small" />
              </IconButton>
            )
          }
          sx={{ pb: 0.5, pt: 1 }}
        />
        <CardContent sx={{ pt: 0, pb: 1 }}>
          {customer ? (
            <StyledCustomerInfo>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 32,
                  height: 32,
                  fontSize: '0.8rem',
                }}
              >
                {customer.isNew
                  ? getCustomerInitials(customer.tempData?.nombre || 'N/A')
                  : getCustomerInitials(customer.customer?.nombre || 'N/A')}
              </Avatar>

              <StyledCustomerDetails>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}
                >
                  {customer.isNew
                    ? customer.tempData?.nombre
                    : customer.customer?.nombre}
                </Typography>

                {customer.isNew ? (
                  <>
                    {customer.tempData?.telefono && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ fontSize: '0.7rem', lineHeight: 1.1 }}
                      >
                        Tel: {customer.tempData.telefono}
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      color="warning.main"
                      display="block"
                      sx={{ fontSize: '0.7rem', lineHeight: 1.1 }}
                    >
                      Nuevo Cliente
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ fontSize: '0.7rem', lineHeight: 1.1 }}
                    >
                      Código: {customer.customer?.codigo}
                    </Typography>
                    {customer.customer?.telefono1 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ fontSize: '0.7rem', lineHeight: 1.1 }}
                      >
                        Tel: {customer.customer.telefono1}
                      </Typography>
                    )}
                    {customer.customer?.balance !== undefined && (
                      <Typography
                        variant="caption"
                        color={
                          customer.customer.balance >= 0
                            ? 'success.main'
                            : 'error.main'
                        }
                        display="block"
                        sx={{ fontSize: '0.7rem', lineHeight: 1.1 }}
                      >
                        Balance: ${customer.customer.balance.toFixed(2)}
                      </Typography>
                    )}
                  </>
                )}
              </StyledCustomerDetails>
            </StyledCustomerInfo>
          ) : (
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Icon
                icon="mdi:account-outline"
                fontSize={24}
                style={{ color: '#ccc', marginBottom: 4 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: 'block' }}
              >
                Selecciona un cliente
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={
                    <Icon icon="mdi:account-search" fontSize="small" />
                  }
                  onClick={() => setSearchDialogOpen(true)}
                  fullWidth
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  Buscar
                </Button>

                <Button
                  variant="text"
                  size="small"
                  startIcon={<Icon icon="mdi:account-plus" fontSize="small" />}
                  onClick={() => setNewCustomerDialogOpen(true)}
                  fullWidth
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  Nuevo Cliente
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </StyledCustomerCard>

      {/* Customer Search Dialog */}
      <CustomerSearchDialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        onSelectCustomer={(selectedCustomer: CustomerType) => {
          onCustomerSelect(selectedCustomer)
          setSearchDialogOpen(false)
        }}
        title="Seleccionar Cliente"
        maxWidth="md"
      />

      {/* New Customer Dialog */}
      <Dialog
        open={newCustomerDialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon icon="mdi:account-plus" />
            Nuevo Cliente
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nombre *"
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="telefono"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Teléfono"
                      error={!!errors.telefono}
                      helperText={
                        errors.telefono?.message ||
                        '10 dígitos (ej: 8091234567)'
                      }
                      inputProps={{
                        maxLength: 10,
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="tipoCliente"
                  control={control}
                  render={({ field }) => (
                    <CustomerTypeAutocomplete
                      selectedCustomerType={field.value}
                      callBack={(value: string) => field.onChange(value)}
                      label="Tipo Comprobante"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="rnc"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="RNC"
                      error={!!errors.rnc}
                      helperText={
                        errors.rnc?.message || 'cédula o RNC - 9 u 11 dígitos'
                      }
                      inputProps={{
                        maxLength: 11,
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message || 'Opcional'}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="direccion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Dirección"
                      multiline
                      rows={2}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleDialogClose} size="large">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid}
              size="large"
            >
              Crear Cliente
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default POSCustomerSection
