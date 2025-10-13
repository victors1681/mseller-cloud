// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { Typography, useMediaQuery } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useTheme } from '@mui/material/styles'
import formatCurrency from 'src/utils/formatCurrency'

interface Props {
  defaultPrice: number
  prices: number[]
}
const PriceDisplay = ({ prices, defaultPrice }: Props) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ** Hooks
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        variant="text"
        aria-controls="simple-menu"
        aria-haspopup="true"
        size="small"
        onClick={handleClick}
        sx={{
          fontSize: isSmallScreen ? '0.75rem' : 'inherit',
          padding: isSmallScreen ? '2px 6px' : '6px 8px',
          minWidth: isSmallScreen ? 'auto' : '64px',
        }}
      >
        {formatCurrency(defaultPrice)}
      </Button>
      <Menu
        keepMounted
        id="simple-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
      >
        {prices.map((p, index) => (
          <MenuItem onClick={handleClose} key={index}>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: isSmallScreen ? '0.75rem' : 'inherit' }}
            >
              Precio{index + 2}: {formatCurrency(p)}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default PriceDisplay
