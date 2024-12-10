import React from 'react'
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material'
import { Controller, Control, FieldValues } from 'react-hook-form'
import { SignUpRequest } from 'src/firebase'
import { countryList } from 'src/utils/countryList'

type CountryDropdownName = 'country'

interface CountryDropdownProps {
  name: CountryDropdownName
  control: Control<SignUpRequest>
  error?: string
  disabled?: boolean
}
export default function CountryDropdown({
  name,
  control,
  error,
  disabled,
}: CountryDropdownProps) {
  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel id="country-select-label">País</InputLabel>
      <Controller
        name={name}
        control={control}
        rules={{ required: 'Seleccione su país' }}
        render={({ field }) => (
          <Select
            labelId="country-select-label"
            id="select-country"
            {...field}
            label="País"
            displayEmpty
            disabled={!!disabled}
            error={!!error}
          >
            {countryList.length > 0 ? (
              countryList.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">
                <em>No countries available</em>
              </MenuItem>
            )}
          </Select>
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}
