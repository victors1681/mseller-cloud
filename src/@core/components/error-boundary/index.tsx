// ** React Imports
import { Component, ErrorInfo, ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Datadog
import { trackReactError } from 'src/configs/datadogConfig'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw',
  },
}))

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Track error in Datadog
    trackReactError(error, errorInfo, errorInfo.componentStack || undefined)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.href = '/'
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '100vh',
            justifyContent: 'center',
          }}
        >
          <BoxWrapper>
            <Typography variant="h1" sx={{ mb: 2.5 }}>
              Oops!
            </Typography>
            <Typography
              variant="h5"
              sx={{ mb: 2.5, fontSize: '1.5rem !important' }}
            >
              Algo salió mal
            </Typography>
            <Typography variant="body2" sx={{ mb: 4 }}>
              Ha ocurrido un error inesperado. Por favor, intenta recargar la
              página.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  bgcolor: 'error.light',
                  borderRadius: 1,
                  textAlign: 'left',
                  maxWidth: '600px',
                  overflow: 'auto',
                }}
              >
                <Typography variant="caption" component="pre">
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
          </BoxWrapper>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={this.handleReload}
              variant="contained"
              sx={{ px: 5.5 }}
              startIcon={<Icon icon="mdi:refresh" />}
            >
              Recargar Página
            </Button>
            <Button
              onClick={this.handleReset}
              variant="outlined"
              sx={{ px: 5.5 }}
              startIcon={<Icon icon="mdi:home" />}
            >
              Volver al Inicio
            </Button>
          </Box>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
