import React, { ReactNode } from 'react'
import { Box, CssBaseline } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledPOSLayout = styled(Box)(({ theme }) => ({
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,

  // Touch-friendly styles
  '& *': {
    userSelect: 'none',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
  },

  // Ensure proper touch interactions
  '& button, & [role="button"]': {
    minHeight: 44,
    minWidth: 44,
    '&:active': {
      transform: 'scale(0.95)',
    },
  },

  // Optimize for tablet screens
  [theme.breakpoints.between('sm', 'lg')]: {
    '& .MuiCard-root': {
      borderRadius: theme.spacing(2),
    },
    '& .MuiButton-root': {
      borderRadius: theme.spacing(1.5),
      fontSize: '1rem',
      padding: theme.spacing(1.5, 3),
    },
    '& .MuiIconButton-root': {
      padding: theme.spacing(1.5),
    },
  },

  // Mobile optimizations
  [theme.breakpoints.down('sm')]: {
    '& .MuiButton-root': {
      minHeight: 48,
      fontSize: '0.9rem',
    },
    '& .MuiTextField-root': {
      '& .MuiInputBase-root': {
        minHeight: 48,
      },
    },
  },
}))

interface POSLayoutProps {
  children: ReactNode
}

const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <StyledPOSLayout>{children}</StyledPOSLayout>
    </>
  )
}

export default POSLayout
