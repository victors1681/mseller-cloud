import {
  Autocomplete,
  AutocompleteValue,
  TextField,
  SxProps,
  Theme,
} from '@mui/material'
import { SyntheticEvent, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchData as fetchDrivers } from 'src/store/apps/driver'

interface DriverAutocompleteProps {
  selectedDrivers?: string
  multiple: boolean
  callBack: (values: string) => void
  sx?: SxProps<Theme>
}

interface DriverOptions {
  label: string
  codigo: string
}
export const DriverAutocomplete = (props: DriverAutocompleteProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const driverStore = useSelector((state: RootState) => state.drivers)

  const findDriverLabel = (codigo: string) => {
    return driverStore?.data.find((v) => v.codigo === codigo)?.nombre || ''
  }

  const selectDriverValues =
    props.selectedDrivers
      ?.split(',')
      .map((v) => ({ codigo: v, label: findDriverLabel(v) }))
      .filter((item) => item.codigo && item.label) || []

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
      value={selectDriverValues}
      isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
      id="drivers-dropdown"
      getOptionLabel={(option) => `${option.codigo}-${option.label}` || ''}
      sx={{ mt: 3, ml: 3, ...props.sx }}
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
