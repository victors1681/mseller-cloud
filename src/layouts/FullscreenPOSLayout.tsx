import React, { ReactNode } from 'react'
import { Box, CssBaseline, GlobalStyles } from '@mui/material'
import { styled } from '@mui/material/styles'

// Global styles to ensure full screen without any interference
const globalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      html: {
        height: '100%',
        overflow: 'hidden',
      },
      body: {
        height: '100%',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      },
      '#__next': {
        height: '100%',
        overflow: 'hidden',
      },
      // Override any existing layout styles
      '.layout-wrapper': {
        display: 'none !important',
      },
      '.layout-content-wrapper': {
        display: 'none !important',
      },
    })}
  />
)

const StyledFullscreenPOSLayout = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  zIndex: 1300, // Above most other components
  display: 'flex',
  flexDirection: 'column',

  // Touch-friendly styles
  '& *': {
    userSelect: 'none',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    boxSizing: 'border-box',
  },

  // Allow text selection in input fields
  '& input, & textarea': {
    userSelect: 'text',
    WebkitUserSelect: 'text',
  },

  // Ensure proper touch interactions
  '& button, & [role="button"]': {
    minHeight: 44,
    minWidth: 44,
    cursor: 'pointer',
    '&:active': {
      transform: 'scale(0.95)',
      transition: 'transform 0.1s ease',
    },
  },

  // Optimize for desktop screens
  [theme.breakpoints.up('lg')]: {
    '& .pos-content-container': {
      display: 'flex',
      flexDirection: 'row',
      height: 'calc(100vh - 64px)', // Subtract header height
      overflow: 'hidden',
    },
    '& .pos-left-panel': {
      flex: '0 0 65%',
      borderRight: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    '& .pos-right-panel': {
      flex: '0 0 35%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
  },

  // Optimize for tablet screens (iPad, etc.)
  [theme.breakpoints.between('md', 'lg')]: {
    '& .pos-content-container': {
      display: 'flex',
      flexDirection: 'row',
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
    },
    '& .pos-left-panel': {
      flex: '0 0 60%',
      borderRight: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    '& .pos-right-panel': {
      flex: '0 0 40%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    '& .MuiCard-root': {
      borderRadius: theme.spacing(2),
    },
    '& .MuiButton-root': {
      borderRadius: theme.spacing(1.5),
      fontSize: '1rem',
      padding: theme.spacing(1.5, 3),
      minHeight: 48,
    },
    '& .MuiIconButton-root': {
      padding: theme.spacing(1.5),
      minWidth: 48,
      minHeight: 48,
    },
  },

  // Mobile/small tablet optimizations
  [theme.breakpoints.down('md')]: {
    '& .pos-content-container': {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
    },
    '& .pos-left-panel': {
      flex: '0 0 60%',
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    '& .pos-right-panel': {
      flex: '0 0 40%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    '& .MuiButton-root': {
      minHeight: 48,
      fontSize: '0.9rem',
      borderRadius: theme.spacing(1),
    },
    '& .MuiTextField-root': {
      '& .MuiInputBase-root': {
        minHeight: 48,
      },
    },
    '& .MuiIconButton-root': {
      minWidth: 44,
      minHeight: 44,
    },
  },

  // Very small screens (phones)
  [theme.breakpoints.down('sm')]: {
    '& .pos-content-container': {
      flexDirection: 'column',
    },
    '& .pos-left-panel': {
      flex: '0 0 55%',
    },
    '& .pos-right-panel': {
      flex: '0 0 45%',
    },
  },

  // Scrollbar styling
  '& ::-webkit-scrollbar': {
    width: 8,
    height: 8,
  },
  '& ::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.grey[100],
  },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 4,
    '&:hover': {
      backgroundColor: theme.palette.grey[400],
    },
  },

  // Prevent zoom on double tap (iOS Safari) and touch manipulation
  '& *, & input, & textarea, & button': {
    touchAction: 'manipulation',
  },
}))

interface FullscreenPOSLayoutProps {
  children: ReactNode
}

const FullscreenPOSLayout: React.FC<FullscreenPOSLayoutProps> = ({
  children,
}) => {
  return (
    <>
      <CssBaseline />
      {globalStyles}
      <StyledFullscreenPOSLayout>{children}</StyledFullscreenPOSLayout>
    </>
  )
}

export default FullscreenPOSLayout
