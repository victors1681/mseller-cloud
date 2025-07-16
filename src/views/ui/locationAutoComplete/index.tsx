import {
  Autocomplete,
  AutocompleteValue,
  TextField,
  SxProps,
  Theme,
} from '@mui/material'
import { SyntheticEvent, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchLocations as fetchLocations } from 'src/store/apps/location'

interface LocationAutocompleteProps {
  selectedLocation?: string
  multiple?: boolean
  callBack: (values: string) => void
  sx?: SxProps<Theme>
}

interface LocationOptions {
  label: string
  id: string
}

export const LocationAutocomplete = (props: LocationAutocompleteProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const locationStore = useSelector((state: RootState) => state.locations)

  const findLocationLabel = (id: string) => {
    return (
      locationStore?.data.find((v) => v.id.toString() === id)?.descripcion || ''
    )
  }

  const selectLocation = useMemo(() => {
    if (props.multiple) {
      return (
        props.selectedLocation
          ?.split(',')
          .map((v) => ({ id: v.toString(), label: findLocationLabel(v) }))
          .filter((item) => item.id.toString() && item.label) || []
      )
    } else {
      if (
        props.selectedLocation &&
        !locationStore.data.some(
          (s) => s.id.toString() === props.selectedLocation,
        )
      ) {
        return []
      }

      return props.selectedLocation
        ? [
            {
              id: props.selectedLocation.toString(),
              label: findLocationLabel(props.selectedLocation),
            },
          ][0]
        : []
    }
  }, [props.selectedLocation, props.multiple])

  console.log('selectLocation', selectLocation)
  useEffect(() => {
    if (!locationStore?.data?.length) {
      dispatch(fetchLocations())
    }
  }, [locationStore.data?.length, dispatch])

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
        id: v.id.toString(),
      }))}
      filterSelectedOptions
      value={selectLocation}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      id="locations-dropdown"
      getOptionLabel={(option) =>
        (option.id && `${option.id}-${option.label}`) || ''
      }
      sx={{ mt: 0, ml: 0, ...props.sx }}
      onChange={handleSelection}
      renderInput={(params) => (
        <TextField {...params} label="Localidades" placeholder="Localidades" />
      )}
    />
  )
}

export default LocationAutocomplete
