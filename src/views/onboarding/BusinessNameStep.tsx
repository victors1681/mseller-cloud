// ** React Imports
import { ChangeEvent } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

interface Props {
  value: string
  onChange: (value: string) => void
}

const BusinessNameStep = ({ value, onChange }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          ¿Cuál es el nombre de tu negocio?
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Este nombre aparecerá en tus facturas y documentos
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="Nombre del Negocio"
        placeholder="Ej: Mi Empresa SRL"
        value={value}
        onChange={handleChange}
        autoFocus
      />
    </Box>
  )
}

export default BusinessNameStep
