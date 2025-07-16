import React from 'react'
import { Controller, Control } from 'react-hook-form'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  IconButton,
  Typography,
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { SellerAutocomplete } from 'src/views/ui/sellerAutoComplete'
import { PaymentTypeAutocomplete } from 'src/views/ui/paymentTypeAutoComplete'
import { SelectedCustomerData } from '../types'
import { on } from 'events'

interface CustomerInformationProps {
  control: Control<any>
  setValue: (name: string, value: any) => void
  selectedCustomerData: SelectedCustomerData | null
  documentEditData: any
  isCreateMode: boolean
  isSubmitting: boolean
  onCustomerSearch: () => void
}

export const CustomerInformation: React.FC<CustomerInformationProps> = ({
  control,
  setValue,
  selectedCustomerData,
  documentEditData,
  isCreateMode,
  isSubmitting,
  onCustomerSearch,
}) => {
  return (
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
                    disabled={
                      !isCreateMode || isSubmitting || field.value.length > 0
                    }
                    label="Código del Cliente"
                    error={!!error}
                    helperText={error?.message}
                    autoComplete="off"
                    onClick={onCustomerSearch}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          size="small"
                          disabled={isSubmitting}
                          onClick={onCustomerSearch}
                          title="Buscar cliente"
                          sx={{ mr: 1 }}
                        >
                          <Icon icon="mdi:magnify" fontSize="1.25rem" />
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
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    disabled={true}
                    size="small"
                    label="Nombre del Cliente"
                    value={
                      selectedCustomerData?.nombreCliente ||
                      documentEditData?.nombreCliente ||
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
                  <>
                    <SellerAutocomplete
                      selectedSellers={field.value || ''}
                      multiple={false}
                      sx={{ mt: 0, ml: 0 }}
                      size="small"
                      callBack={(selectedCode: string) => {
                        if (!isSubmitting) {
                          setValue('codigoVendedor', selectedCode || '')
                        }
                      }}
                    />
                    {error && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 1, ml: 2, display: 'block' }}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
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
                      if (!isSubmitting) {
                        onChange(newValue)
                      }
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}
