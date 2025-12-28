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

const PhoneStep = ({ value, onChange }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Format phone number
    let input = e.target.value.replace(/\D/g, '')
    if (input.length > 10) input = input.slice(0, 10)

    let formatted = ''
    if (input.length > 0) {
      formatted = input.slice(0, 3)
      if (input.length > 3) {
        formatted += '-' + input.slice(3, 6)
      }
      if (input.length > 6) {
        formatted += '-' + input.slice(6, 10)
      }
    }

    onChange(formatted || input)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          ¿Cuál es tu número de teléfono?
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Lo usaremos para contactarte sobre tu cuenta
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="Teléfono"
        placeholder="809-000-0000"
        value={value}
        onChange={handleChange}
        autoFocus
        helperText="Formato: 809-000-0000"
      />
    </Box>
  )
}

export default PhoneStep
