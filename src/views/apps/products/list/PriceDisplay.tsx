// ** React Imports
import { MouseEvent, useState } from 'react'

// ** MUI Imports
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import formatCurrency from 'src/utils/formatCurrency'
import Link from 'next/link'
import { Typography } from '@mui/material'

interface Props {
  defaultPrice: number
  prices: number[]
}
const PriceDisplay = ({ prices, defaultPrice }: Props) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

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
          <MenuItem onClick={handleClose}>
            <Typography variant="subtitle2">
              Precio{index + 2}: {formatCurrency(p)}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default PriceDisplay
