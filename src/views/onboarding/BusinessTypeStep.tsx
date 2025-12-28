// ** React Imports

// ** MUI Components
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

interface Props {
  businessType: string
  industry: string
  onChange: (businessType: string, industry: string) => void
}

const businessTypes = [
  'Retail / Minorista',
  'Mayorista / Distribuidor',
  'Manufactura',
  'Servicios',
  'Restaurante / Cafetería',
  'Farmacia',
  'Supermercado',
  'Ferretería',
  'Tecnología',
  'Otro',
]

const industries = [
  'Alimentos y Bebidas',
  'Construcción',
  'Educación',
  'Electrónica',
  'Farmacéutico',
  'Moda y Textiles',
  'Salud',
  'Tecnología',
  'Transporte',
  'Turismo y Hospitalidad',
  'Otro',
]

const BusinessTypeStep = ({ businessType, industry, onChange }: Props) => {
  const handleBusinessTypeChange = (_event: any, newValue: string | null) => {
    onChange(newValue || '', industry)
  }

  const handleIndustryChange = (_event: any, newValue: string | null) => {
    onChange(businessType, newValue || '')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Cuéntanos sobre tu negocio
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Esto nos ayudará a personalizar tu experiencia
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            options={businessTypes}
            value={businessType || null}
            onChange={handleBusinessTypeChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tipo de Negocio"
                placeholder="Selecciona el tipo de negocio"
                autoFocus
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            options={industries}
            value={industry || null}
            onChange={handleIndustryChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Industria"
                placeholder="Selecciona tu industria"
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default BusinessTypeStep
