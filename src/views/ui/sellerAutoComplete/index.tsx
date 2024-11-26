import { Autocomplete, AutocompleteValue, TextField } from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import select from 'src/@core/theme/overrides/select'
import { AppDispatch, RootState } from 'src/store'
import { fetchSellers } from 'src/store/apps/seller'

interface SellerAutocompleteProps {
  selectedSellers?: string
  multiple?: boolean
  callBack: (values: string) => void
}

interface SellerOptions {
  label: string
  codigo: string
}
export const SellerAutocomplete = (props: SellerAutocompleteProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const sellerStore = useSelector((state: RootState) => state.sellers)

  const findSellerLabel = (codigo: string) => {
    return sellerStore?.data.find((v) => v.codigo === codigo)?.nombre || ''
  }
  const selectSellerValues =
    props.selectedSellers
      ?.split(',')
      .map((v) => ({ codigo: v, label: findSellerLabel(v) }))
      .filter((item) => item.codigo && item.label) || []
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
      isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
      id="sellers-dropdown"
      getOptionLabel={(option) => `${option.codigo}-${option.label}` || ''}
      sx={{ mt: 3, ml: 3 }}
      onChange={handleSelection}
      renderInput={(params) => (
        <TextField {...params} label="Vendedores" placeholder="Vendedores" />
      )}
    />
  )
}
