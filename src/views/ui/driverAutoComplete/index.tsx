import { Autocomplete, AutocompleteValue, TextField } from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchData as fetchDrivers } from 'src/store/apps/driver'

interface DriverAutocompleteProps {
  multiple: boolean
  callBack: (values: AutocompleteValue<DriverOptions, any, any, any>) => void
}

interface DriverOptions {
  label: string
  codigo: string
}
export const DriverAutocomplete = (props: DriverAutocompleteProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const driverStore = useSelector((state: RootState) => state.drivers)

  useEffect(() => {
    if (!driverStore?.data?.length) {
      dispatch(fetchDrivers({ pageSize: 100 }))
    }
  }, [driverStore.data?.length])

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
      multiple={props.multiple}
      options={driverStore.data.map((v) => ({
        label: v.nombre,
        codigo: v.codigo,
      }))}
      filterSelectedOptions
      // defaultValue={[]}
      isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
      id="drivers-dropdown"
      getOptionLabel={(option) => `${option.codigo}-${option.label}` || ''}
      sx={{ mt: 3, ml: 3 }}
      onChange={handleSelection}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Distribuidores"
          placeholder="Distribuidores"
        />
      )}
    />
  )
}
