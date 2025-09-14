// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { GridRowId } from '@mui/x-data-grid'
import { useState } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface ReportOption {
  label: string
  action: () => void
  icon: string
}

interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
  placeholder: string
  reportOptions?: ReportOption[]
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, selectedRows, handleFilter, reportOptions } = props

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleOptionClick = (action: () => void) => {
    action()
    handleMenuClose()
  }

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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {selectedRows.length > 0 &&
          reportOptions &&
          reportOptions.length > 0 && (
            <>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={handleMenuClick}
                endIcon={<Icon icon="mdi:chevron-down" />}
              >
                Reportes ({selectedRows.length})
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {reportOptions.map((option, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleOptionClick(option.action)}
                    sx={{ '& svg': { mr: 2 } }}
                  >
                    <Icon icon={option.icon} fontSize={20} />
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder={props.placeholder}
          onChange={(e) => handleFilter(e.target.value)}
        />
        {/* <Button
          sx={{ mb: 2 }}
          component={Link}
          variant="contained"
          href="/apps/invoice/add"
        >
          Crear Transporte
        </Button> */}
      </Box>
    </Box>
  )
}

export default TableHeader
