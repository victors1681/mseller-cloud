import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material'
import { CustomerType } from 'src/types/apps/customerType'
import formatCurrency from 'src/utils/formatCurrency'

interface CustomerGeneralInfoProps {
  customer: CustomerType | undefined
  isLoading: boolean
}

const CustomerGeneralInfo: React.FC<CustomerGeneralInfoProps> = ({
  customer,
  isLoading,
}) => {
  return (
    <Card>
      <CardHeader
        title="Información General"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : customer ? (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Código:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {customer.codigo}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Nombre:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {customer.nombre}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Dirección:
              </Typography>
              <Typography variant="body1">{customer.direccion}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Ciudad:
              </Typography>
              <Typography variant="body1">{customer.ciudad}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Teléfono:
              </Typography>
              <Typography variant="body1">{customer.telefono1}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                RNC:
              </Typography>
              <Typography variant="body1">{customer.rnc}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Email:
              </Typography>
              <Typography variant="body1">{customer.email || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Estado:
              </Typography>
              <Chip
                label={customer.status || 'N/A'}
                color={customer.status === 'ACTIVO' ? 'success' : 'default'}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Límite de Crédito:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatCurrency(customer.limiteCredito)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Balance:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatCurrency(customer.balance)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Vendedor:
              </Typography>
              <Typography variant="body1">
                {customer.vendedor?.nombre || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Condición de Pago:
              </Typography>
              <Typography variant="body1">
                {customer.condicionPago?.descripcion ||
                  customer.condicion ||
                  'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Clasificación:
              </Typography>
              <Typography variant="body1">
                {customer.clasificacion || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Tipo de Cliente:
              </Typography>
              <Typography variant="body1">
                {customer.tipoCliente || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="error">
            No se pudo cargar la información del cliente
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default CustomerGeneralInfo
