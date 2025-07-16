import { Autocomplete, AutocompleteValue, TextField } from '@mui/material'
import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchPaymentType as fetchPaymentTypes } from 'src/store/apps/paymentType'

interface PaymentTypeAutocompleteProps {
  selectedPaymentType?: string
  multiple?: boolean
  callBack: (values: string) => void
  size?: 'small' | 'medium'
}

interface PaymentTypeOptions {
  label: string
  condicionPago: string
}
export const PaymentTypeAutocomplete = (
  props: PaymentTypeAutocompleteProps,
) => {
  const dispatch = useDispatch<AppDispatch>()
  const locationStore = useSelector((state: RootState) => state.paymentTypes)

  const findConditionLabel = (codigo: string) => {
    return (
      locationStore?.data.find((v) => v.condicionPago === codigo)
        ?.descripcion || ''
    )
  }

  const selectPaymentTypes = useMemo(() => {
    if (props.multiple) {
      return (
        props.selectedPaymentType
          ?.split(',')
          .map((v) => ({ condicionPago: v, label: findConditionLabel(v) }))
          .filter((item) => item.condicionPago && item.label) || []
      )
    } else {
      return props.selectedPaymentType
        ? [
            {
              condicionPago: props.selectedPaymentType,
              label: findConditionLabel(props.selectedPaymentType),
            },
          ][0]
        : []
    }
  }, [props.selectedPaymentType, props.multiple]) // Recompute only when selectedPayment

  useEffect(() => {
    if (!locationStore?.data?.length) {
      dispatch(fetchPaymentTypes())
    }
  }, [locationStore.data?.length, dispatch])

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
      size={props.size}
      filterSelectedOptions
      value={selectPaymentTypes}
      isOptionEqualToValue={(option, value) =>
        option.condicionPago === value.condicionPago
      }
      id="paymentType-dropdown"
      getOptionLabel={(option) =>
        (option.condicionPago && `${option.condicionPago}-${option.label}`) ||
        ''
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
