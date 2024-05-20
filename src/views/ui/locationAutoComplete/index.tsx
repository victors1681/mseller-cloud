import { Autocomplete, AutocompleteValue, TextField } from '@mui/material';
import { SyntheticEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import { fetchData as fetchLocations } from 'src/store/apps/location';

interface LocationAutocompleteProps {
  selectedLocation?: string;
  multiple?: boolean;
  callBack: (values: AutocompleteValue<LocationOptions, any, any, any>) => void;
}

interface LocationOptions {
  label: string;
  codigo: string;
}

export const LocationAutocomplete = (props: LocationAutocompleteProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const locationStore = useSelector((state: RootState) => state.locations);

  const findLocationLabel = (codigo: string) => {
    return locationStore?.data.find((v) => v.codigo === codigo)?.descripcion || '';
  };

  const selectLocation = props.selectedLocation?.split(",")
    .map((v) => ({ codigo: v, label: findLocationLabel(v) }))
    .filter((item) => item.codigo && item.label) || [];

  useEffect(() => {
    if (!locationStore?.data?.length) {
      dispatch(fetchLocations());
    }
  }, [locationStore.data?.length, dispatch]);

  const handleSelection = (
    _: SyntheticEvent<Element, Event>,
    values: AutocompleteValue<any, any, any, any>,
  ) => {
    const locations = Array.isArray(values)
      ? values.map((v) => v.codigo).join(',')
      : values?.codigo || null

    props?.callBack && props?.callBack(locations)
  }

  return (
    <Autocomplete
      multiple={!!props.multiple}
      options={locationStore.data.map((v) => ({
        label: v.descripcion,
        codigo: v.codigo,
      }))}
      filterSelectedOptions
      value={selectLocation}
      isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
      id="locations-dropdown"
      getOptionLabel={(option) => `${option.codigo}-${option.label}` || ''}
      sx={{ mt: 0, ml: 0 }}
      onChange={handleSelection}
      renderInput={(params) => (
        <TextField {...params} label="Localidades" placeholder="Localidades" />
      )}
    />
  );
};

export default LocationAutocomplete;
