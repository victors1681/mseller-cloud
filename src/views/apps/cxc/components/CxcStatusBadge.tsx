// ** React Imports
import { FC } from 'react'

// ** MUI Imports
import { Chip, ChipProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// ** Types
import { EstadoCxc } from 'src/types/apps/cxcTypes'

interface CxcStatusBadgeProps {
  status: EstadoCxc
  size?: ChipProps['size']
  variant?: ChipProps['variant']
}

const CxcStatusBadge: FC<CxcStatusBadgeProps> = ({
  status,
  size = 'small',
  variant = 'filled',
}) => {
  const theme = useTheme()

  const getStatusConfig = (status: EstadoCxc) => {
    switch (status) {
      case EstadoCxc.Pendiente:
        return {
          label: 'Pendiente',
          color: 'warning' as const,
          icon: '⏳',
          backgroundColor: theme.palette.warning.light,
          textColor: theme.palette.warning.contrastText || '#fff',
        }
      case EstadoCxc.PagoParcial:
        return {
          label: 'Pago Parcial',
          color: 'info' as const,
          icon: '💰',
          backgroundColor: theme.palette.info.light,
          textColor: theme.palette.info.contrastText || '#fff',
        }
      case EstadoCxc.Pagado:
        return {
          label: 'Pagado',
          color: 'success' as const,
          icon: '✅',
          backgroundColor: theme.palette.success.light,
          textColor: theme.palette.success.contrastText || '#fff',
        }
      case EstadoCxc.Vencido:
        return {
          label: 'Vencido',
          color: 'error' as const,
          icon: '🚨',
          backgroundColor: theme.palette.error.light,
          textColor: theme.palette.error.contrastText || '#fff',
        }
      case EstadoCxc.Anulado:
        return {
          label: 'Anulado',
          color: 'default' as const,
          icon: '❌',
          backgroundColor: theme.palette.grey[300],
          textColor: theme.palette.text.primary,
        }
      default:
        return {
          label: status,
          color: 'default' as const,
          icon: '',
          backgroundColor: theme.palette.grey[300],
          textColor: theme.palette.text.primary,
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Chip
      label={`${config.icon} ${config.label}`}
      color={config.color}
      size={size}
      variant={variant}
      sx={{
        fontWeight: 600,
        '& .MuiChip-label': {
          fontSize: size === 'small' ? '0.75rem' : '0.875rem',
          px: size === 'small' ? 1 : 1.5,
        },
        // Mobile optimization
        [theme.breakpoints.down('sm')]: {
          '& .MuiChip-label': {
            fontSize: '0.75rem',
            px: 1,
          },
        },
      }}
    />
  )
}

export default CxcStatusBadge
