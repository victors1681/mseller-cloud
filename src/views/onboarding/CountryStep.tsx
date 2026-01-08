// ** React Imports
import { ChangeEvent, useEffect, useState } from 'react'

// ** MUI Components
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Countries List
import { countryList as countries } from 'src/utils/countryList'

interface Props {
  value: string
  rnc: string
  onChange: (country: string, rnc?: string) => void
}

const CountryStep = ({ value, rnc, onChange }: Props) => {
  const [rncError, setRncError] = useState<string>('')
  
  const isDominicanRepublic =
    value === 'República Dominicana' || value === 'Dominican Republic'

  const handleCountryChange = (_event: any, newValue: string | null) => {
    onChange(newValue || '', rnc)
  }

  const validateRnc = (rncValue: string): string => {
    if (!rncValue.trim()) {
      return ''
    }

    // Remove dashes and spaces to count only digits
    const digitsOnly = rncValue.replace(/[-\s]/g, '')

    // Check if all characters are digits
    if (!/^\d+$/.test(digitsOnly)) {
      return 'El RNC debe contener solo números'
    }

    // Check if length is 9 or 11
    if (digitsOnly.length !== 9 && digitsOnly.length !== 11) {
      return 'El RNC debe tener 9 u 11 dígitos'
    }

    return ''
  }

  const handleRncChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newRnc = e.target.value
    const error = validateRnc(newRnc)
    setRncError(error)
    onChange(value, newRnc)
  }

  // Clear RNC if country changes from Dominican Republic
  useEffect(() => {
    if (!isDominicanRepublic && rnc) {
      onChange(value, '')
      setRncError('')
    }
  }, [isDominicanRepublic])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          ¿En qué país opera tu negocio?
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Selecciona el país donde está registrado tu negocio
        </Typography>
      </Box>

      <Autocomplete
        fullWidth
        options={countries}
        value={value || null}
        onChange={handleCountryChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="País"
            placeholder="Selecciona un país"
            autoFocus
          />
        )}
      />

      <Collapse in={isDominicanRepublic}>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
            Información adicional requerida para República Dominicana
          </Typography>
          <TextField
            fullWidth
            label="RNC (Registro Nacional de Contribuyentes)"
            placeholder="000-0000000-0"
            value={rnc}
            onChange={handleRncChange}
            error={!!rncError}
            helperText={rncError || 'Formato: 000-0000000-0 (9 u 11 dígitos)'}
          />
        </Box>
      </Collapse>
    </Box>
  )
}

export default CountryStep
