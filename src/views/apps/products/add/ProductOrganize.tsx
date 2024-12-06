'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'

const ProductOrganize = () => {
  // States
  const [vendor, setVendor] = useState('')
  const [category, setCategory] = useState('')
  const [collection, setCollection] = useState('')
  const [status, setStatus] = useState('')

  return (
    <Card>
      <CardHeader title="Organización" />
      <CardContent>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-5"
        >
          <div className="flex items-center gap-4">
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                label="Seleccionar Categoría"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="Household">Household</MenuItem>
                <MenuItem value="Office">Office</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Management">Management</MenuItem>
                <MenuItem value="Automotive">Automotive</MenuItem>
              </Select>
            </FormControl>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ProductOrganize
