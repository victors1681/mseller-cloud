// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'
import { GridRowId } from '@mui/x-data-grid'

interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
  placeholder: string
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, selectedRows, handleFilter } = props

  // ** Hooks
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      sx={{
        p: isMobile ? 3 : 5,
        pb: isMobile ? 2 : 3,
        width: '100%',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        flexWrap: 'wrap',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: isMobile ? 'center' : 'space-between',
        gap: isMobile ? 2 : 0,
      }}
    >
      {!isMobile && <div></div>}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 2 : 0,
          width: isMobile ? '100%' : 'auto',
        }}
      >
        <TextField
          size="small"
          value={value}
          sx={{
            mr: isMobile ? 0 : 4,
            mb: isMobile ? 0 : 2,
            width: isMobile ? '100%' : 'auto',
          }}
          placeholder={props.placeholder}
          onChange={(e) => handleFilter(e.target.value)}
        />
        <Button
          sx={{
            mb: isMobile ? 0 : 2,
            width: isMobile ? '100%' : 'auto',
            fontSize: isSmallScreen ? '0.875rem' : 'inherit',
          }}
          component={Link}
          variant="contained"
          href="/apps/products/add/new"
        >
          {isSmallScreen ? '+ Producto' : 'Crear Producto'}
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
