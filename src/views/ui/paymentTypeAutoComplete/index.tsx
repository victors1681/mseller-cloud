import { Autocomplete, AutocompleteValue, TextField } from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchData as fetchPaymentTypes } from 'src/store/apps/paymentType'

interface PaymentTypeAutocompleteProps {
  multiple?: boolean
  callBack: (
    values: AutocompleteValue<PaymentTypeOptions, any, any, any>,
  ) => void
}

interface PaymentTypeOptions {
  label: string
  codigo: string
}
export const PaymentTypeAutocomplete = (
  props: PaymentTypeAutocompleteProps,
) => {
  const dispatch = useDispatch<AppDispatch>()
  const locationStore = useSelector((state: RootState) => state.paymentTypes)

  useEffect(() => {
    if (!locationStore?.data?.length) {
      dispatch(fetchPaymentTypes())
    }
  }, [locationStore.data?.length])

  const handleSelection = (
    _: SyntheticEvent<Element, Event>,
    values: AutocompleteValue<any, any, any, any>,
  ) => {
    const paymentType = Array.isArray(values)
      ? values.map((v) => v.condicionPago).join(',')
      : values?.condicionPago || null

    props?.callBack && props?.callBack(paymentType)
  }
  return (
    <Autocomplete
      multiple={!!props.multiple}
      options={locationStore.data.map((v) => ({
        label: v.descripcion,
        condicionPago: v.condicionPago,
      }))}
      filterSelectedOptions
      // defaultValue={[]}
      isOptionEqualToValue={(option, value) =>
        option.condicionPago === value.condicionPago
      }
      id="paymentType-dropdown"
      getOptionLabel={(option) =>
        `${option.condicionPago}-${option.label}` || ''
      }
      sx={{ mt: 0, ml: 0 }}
      onChange={handleSelection}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Condición Pago"
          placeholder="Condición Pago"
        />
      )}
    />
  )
}
