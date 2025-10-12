import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import React from 'react'
import Icon from 'src/@core/components/icon'
import { CustomerType } from 'src/types/apps/customerType'
import formatCurrency from 'src/utils/formatCurrency'

// Helper component for info fields
const InfoField: React.FC<{
  icon: string
  label: string
  value: string | React.ReactNode
  color?: string
}> = ({ icon, label, value, color = 'text.secondary' }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
    <Avatar
      sx={{
        width: { xs: 32, sm: 36 },
        height: { xs: 32, sm: 36 },
        bgcolor: 'primary.light',
        color: 'primary.main',
      }}
    >
      <Icon icon={icon} fontSize="1.2rem" />
    </Avatar>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        variant="body2"
        color={color}
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          fontWeight: 500,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: '0.875rem', sm: '1rem' },
          wordBreak: 'break-word',
          fontWeight: 400,
          color: 'text.primary',
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
)

interface CustomerGeneralInfoProps {
  customer: CustomerType | undefined
  isLoading: boolean
}

const CustomerGeneralInfo: React.FC<CustomerGeneralInfoProps> = ({
  customer,
  isLoading,
}) => {
  return (
    <Card sx={{ height: '100%', borderRadius: 1, boxShadow: 0 }}>
      <CardHeader
        title="Información General"
        titleTypographyProps={{
          variant: 'h6',
          sx: {
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 600,
          },
        }}
        sx={{
          pb: { xs: 1, sm: 2 },
          bgcolor: 'background.paper',
        }}
      />
      <CardContent sx={{ pt: { xs: 1, sm: 2 } }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : customer ? (
          <Box>
            {/* Basic Information Section */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                color="primary.main"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Icon icon="mdi:card-account-details" fontSize="1.1rem" />
                Datos Básicos
              </Typography>

              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} sm={6}>
                  <InfoField
                    icon="mdi:identifier"
                    label="Código"
                    value={customer.codigo}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoField
                    icon="mdi:account"
                    label="Nombre"
                    value={customer.nombre}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoField
                    icon="mdi:map-marker"
                    label="Dirección"
                    value={customer.direccion || 'No especificada'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoField
                    icon="mdi:city"
                    label="Ciudad"
                    value={customer.ciudad || 'No especificada'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoField
                    icon="mdi:phone"
                    label="Teléfono"
                    value={customer.telefono1 || 'No disponible'}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Business Information Section */}
            <Box>
              <Typography
                variant="subtitle2"
                color="primary.main"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Icon icon="mdi:office-building" fontSize="1.1rem" />
                Información Comercial
              </Typography>

              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} sm={6}>
                  <InfoField
                    icon="mdi:certificate"
                    label="RNC"
                    value={customer.rnc || 'No disponible'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoField
                    icon="mdi:email"
                    label="Email"
                    value={customer.email || 'No disponible'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoField
                    icon="mdi:check-circle"
                    label="Estado"
                    value={
                      <Chip
                        label={customer.status || 'N/A'}
                        color={
                          customer.status === 'ACTIVO' ? 'success' : 'default'
                        }
                        size="small"
                        icon={
                          <Icon
                            icon={
                              customer.status === 'ACTIVO'
                                ? 'mdi:check'
                                : 'mdi:close'
                            }
                            fontSize="0.875rem"
                          />
                        }
                        sx={{
                          height: { xs: 28, sm: 32 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          fontWeight: 500,
                        }}
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoField
                    icon="mdi:cash"
                    label="Límite de Crédito"
                    value={
                      <Typography
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          fontWeight: 600,
                          color: 'success.main',
                        }}
                      >
                        {formatCurrency(customer.limiteCredito)}
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        ) : (
          <Alert severity="error" sx={{ m: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon icon="mdi:alert-circle" />
              No se pudo cargar la información del cliente
            </Box>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default CustomerGeneralInfo
