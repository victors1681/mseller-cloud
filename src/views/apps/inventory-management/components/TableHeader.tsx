// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface TableHeaderProps {
  value: string
  toggle: () => void
  handleFilter: (val: string) => void
  children?: ReactNode
}

const TableHeader = ({
  value,
  handleFilter,
  toggle,
  children,
}: TableHeaderProps) => {
  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}
      >
        <TextField
          size="small"
          value={value}
          sx={{ mr: 6, mb: 2 }}
          placeholder="Buscar..."
          onChange={(e) => handleFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="mdi:magnify" fontSize={20} />
              </InputAdornment>
            ),
          }}
        />
        {children}
      </Box>
    </Box>
  )
}

export default TableHeader
