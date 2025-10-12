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
import { fetchSellers } from 'src/store/apps/seller'

interface SellerAutocompleteProps {
  selectedSellers?: string
  multiple?: boolean
  callBack: (values: string) => void
  sx?: SxProps<Theme>
  size?: 'small' | 'medium'
}

interface SellerOptions {
  label: string
  codigo: string
}
export const SellerAutocomplete = (props: SellerAutocompleteProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const sellerStore = useSelector((state: RootState) => state.sellers)

  const findSellerLabel = (codigo: string) => {
    return (
      sellerStore?.data.find((v) => v.codigo === codigo)?.nombre.trim() || ''
    )
  }
  const selectSellerValues = useMemo(() => {
    if (props.multiple) {
      return (
        props.selectedSellers
          ?.split(',')
          .map((v) => ({ codigo: v, label: findSellerLabel(v) }))
          .filter((item) => item.codigo && item.label) || []
      )
    } else {
      return props.selectedSellers
        ? [
            {
              codigo: props.selectedSellers,
              label: findSellerLabel(props.selectedSellers),
            },
          ][0]
        : []
    }
  }, [props.selectedSellers, props.multiple]) // Recompute only when selectedSellers or multiple changes

  useEffect(() => {
    if (!sellerStore?.data?.length) {
      dispatch(
        fetchSellers({
          pageSize: 100,
        }),
      )
    }
  }, [sellerStore.data?.length, dispatch])

  const handleSelection = (
    _: SyntheticEvent<Element, Event>,
    values: AutocompleteValue<any, any, any, any>,
  ) => {
    const sellers = Array.isArray(values)
      ? values.map((v) => v.codigo).join(',')
      : values?.codigo || null

    props?.callBack && props?.callBack(sellers)
  }

  return (
    <Autocomplete
      multiple={!!props.multiple}
      options={sellerStore.data.map((v) => ({
        label: v.nombre,
        codigo: v.codigo,
      }))}
      filterSelectedOptions
      value={selectSellerValues}
      size={props.size || 'medium'}
      isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
      id="sellers-dropdown"
      getOptionLabel={(option) =>
        (option.codigo && `${option.codigo}-${option.label}`) || ''
      }
      sx={props.sx || { mt: 0, ml: 0 }}
      onChange={handleSelection}
      renderInput={(params) => (
        <TextField {...params} label="Vendedores" placeholder="Vendedores" />
      )}
    />
  )
}
