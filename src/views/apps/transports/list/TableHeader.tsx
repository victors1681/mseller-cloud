// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import { GridRowId } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
  placeholder: string
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, selectedRows, handleFilter } = props

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Select
        size="small"
        displayEmpty
        defaultValue=""
        sx={{ mr: 4, mb: 2 }}
        disabled={selectedRows && selectedRows.length === 0}
        renderValue={(selected) =>
          selected.length === 0 ? 'Acciones' : selected
        }
      >
        <MenuItem disabled>Acciones</MenuItem>
        <MenuItem value="1">Aprobar</MenuItem>
        <MenuItem value="3">Retener</MenuItem>
        <MenuItem value="delete">Eliminar</MenuItem>
      </Select>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder={props.placeholder}
          onChange={(e) => handleFilter(e.target.value)}
        />
        <Button
          sx={{ mb: 2 }}
          component={Link}
          variant="contained"
          href="/apps/invoice/add"
        >
          Crear Pedido
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
