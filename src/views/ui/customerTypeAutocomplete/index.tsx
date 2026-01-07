import {
  Autocomplete,
  AutocompleteValue,
  SxProps,
  TextField,
  Theme,
} from '@mui/material'
import { SyntheticEvent, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchSecuenciaECF } from 'src/store/apps/ecf'

interface CustomerTypeAutocompleteProps {
  selectedCustomerType?: string
  multiple?: boolean
  callBack: (values: string) => void
  sx?: SxProps<Theme>
  size?: 'small' | 'medium'
  label?: string
}

interface CustomerTypeOptions {
  label: string
  tipoCliente: string
}

export const CustomerTypeAutocomplete = (
  props: CustomerTypeAutocompleteProps,
) => {
  const dispatch = useDispatch<AppDispatch>()
  const ecfStore = useSelector(
    (state: RootState) => state.ecf,
  ).secuenciaData.filter((v) => v.habilitado)

  const findCustomerTypeLabel = (tipoCliente: string) => {
    return (
      ecfStore
        .find((v) => v.tipoCliente === tipoCliente)
        ?.descripcion?.trim() || ''
    )
  }

  const selectCustomerTypeValues = useMemo(() => {
    if (props.multiple) {
      return (
        props.selectedCustomerType
          ?.split(',')
          .map((v) => ({ tipoCliente: v, label: findCustomerTypeLabel(v) }))
          .filter((item) => item.tipoCliente && item.label) || []
      )
    } else {
      return props.selectedCustomerType
        ? [
            {
              tipoCliente: props.selectedCustomerType,
              label: findCustomerTypeLabel(props.selectedCustomerType),
            },
          ][0]
        : []
    }
  }, [props.selectedCustomerType, props.multiple, ecfStore])

  useEffect(() => {
    if (!ecfStore?.length) {
      dispatch(
        fetchSecuenciaECF({
          pageSize: 100,
          pageNumber: 0,
          query: '',
        }),
      )
    }
  }, [ecfStore?.length, dispatch])

  const handleSelection = (
    _: SyntheticEvent<Element, Event>,
    values: AutocompleteValue<any, any, any, any>,
  ) => {
    const customerTypes = Array.isArray(values)
      ? values.map((v) => v.tipoCliente).join(',')
      : values?.tipoCliente || null

    props?.callBack && props?.callBack(customerTypes)
  }

  // Get unique customer types to avoid duplicates
  const uniqueCustomerTypes = useMemo(() => {
    const seen = new Set()
    return ecfStore
      .filter((v) => {
        if (seen.has(v.tipoCliente)) {
          return false
        }
        seen.add(v.tipoCliente)
        return true
      })
      .map((v) => ({
        label: v.descripcion,
        tipoCliente: v.tipoCliente,
      }))
  }, [ecfStore])

  return (
    <Autocomplete
      multiple={!!props.multiple}
      options={uniqueCustomerTypes}
      filterSelectedOptions
      value={selectCustomerTypeValues}
      size={props.size || 'medium'}
      isOptionEqualToValue={(option, value) =>
        option.tipoCliente === value.tipoCliente
      }
      id="customer-types-dropdown"
      getOptionLabel={(option) =>
        (option.tipoCliente && `${option.tipoCliente} - ${option.label}`) || ''
      }
      sx={props.sx || { mt: 0, ml: 0 }}
      onChange={handleSelection}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || 'Tipo de Cliente *'}
          placeholder={props.label || 'Tipo de Cliente'}
        />
      )}
    />
  )
}
