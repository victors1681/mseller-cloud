// ** React Imports
import { ChangeEvent } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

interface Props {
  street: string
  city: string
  onStreetChange: (value: string) => void
  onCityChange: (value: string) => void
}

const AddressStep = ({ street, city, onStreetChange, onCityChange }: Props) => {
  const handleStreetChange = (e: ChangeEvent<HTMLInputElement>) => {
    onStreetChange(e.target.value)
  }

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    onCityChange(e.target.value)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          ¿Dónde está ubicado tu negocio?
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Ingresa la dirección física de tu negocio
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Calle / Dirección"
            placeholder="Calle, número, sector"
            value={street}
            onChange={handleStreetChange}
            autoFocus
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Ciudad"
            placeholder="Ciudad donde está ubicado el negocio"
            value={city}
            onChange={handleCityChange}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default AddressStep
