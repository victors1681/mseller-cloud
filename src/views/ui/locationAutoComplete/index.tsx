import { Autocomplete, AutocompleteValue, TextField } from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchData as fetchLocations } from 'src/store/apps/location'

interface LocationAutocompleteProps {
  multiple?: boolean
  callBack: (values: AutocompleteValue<LocationOptions, any, any, any>) => void
}

interface LocationOptions {
  label: string
  codigo: string
}
export const LocationAutocomplete = (props: LocationAutocompleteProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const locationStore = useSelector((state: RootState) => state.locations)

  useEffect(() => {
    if (!locationStore?.data?.length) {
      dispatch(fetchLocations())
    }
  }, [locationStore.data?.length])

  const handleSelection = (
    _: SyntheticEvent<Element, Event>,
    values: AutocompleteValue<any, any, any, any>,
  ) => {
    const locations = Array.isArray(values)
      ? values.map((v) => v.id).join(',')
      : values?.id || null

    props?.callBack && props?.callBack(locations)
  }
  return (
    <Autocomplete
      multiple={!!props.multiple}
      options={locationStore.data.map((v) => ({
        label: v.descripcion,
        id: v.id,
      }))}
      filterSelectedOptions
      // defaultValue={[]}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      id="locations-dropdown"
      getOptionLabel={(option) => `${option.id}-${option.label}` || ''}
      sx={{ mt: 0, ml: 0 }}
      onChange={handleSelection}
      renderInput={(params) => (
        <TextField {...params} label="Localidades" placeholder="Localidades" />
      )}
    />
  )
}
