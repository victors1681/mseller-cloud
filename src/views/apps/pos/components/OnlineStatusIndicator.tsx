import React from 'react'
import { Chip } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useOnlineStatus } from '../hook/useOnlineStatus'

interface OnlineStatusIndicatorProps {
  size?: 'small' | 'medium'
  variant?: 'filled' | 'outlined'
  labels?: {
    online: string
    offline: string
  }
  showLabel?: boolean
}

const OnlineStatusIndicator: React.FC<OnlineStatusIndicatorProps> = ({
  size = 'small',
  variant = 'outlined',
  labels = {
    online: 'En línea',
    offline: 'Sin conexión',
  },
  showLabel = true,
}) => {
  const isOnline = useOnlineStatus()

  return (
    <Chip
      icon={
        <Icon
          icon={isOnline ? 'mdi:wifi' : 'mdi:wifi-off'}
          style={{ color: isOnline ? '#4caf50' : '#f44336' }}
        />
      }
      label={
        showLabel ? (isOnline ? labels.online : labels.offline) : undefined
      }
      variant={variant}
      size={size}
      sx={{
        borderColor: isOnline ? 'success.main' : 'error.main',
        color: isOnline ? 'success.main' : 'error.main',
        backgroundColor:
          variant === 'filled'
            ? isOnline
              ? 'success.light'
              : 'error.light'
            : 'transparent',
        '& .MuiChip-icon': {
          color: isOnline ? 'success.main' : 'error.main',
        },
      }}
      aria-label={`Connection status: ${isOnline ? 'online' : 'offline'}`}
    />
  )
}

export default OnlineStatusIndicator
