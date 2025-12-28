// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { RecentActivity } from 'src/types/apps/dashboardTypes'

interface Props {
  data: RecentActivity[]
}

const DashboardRecentActivity = ({ data }: Props) => {
  const theme = useTheme()

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'order':
        return 'mdi:cart'
      case 'collection':
        return 'mdi:cash'
      case 'transport':
        return 'mdi:truck'
      case 'product':
        return 'mdi:package-variant'
      default:
        return 'mdi:information'
    }
  }

  const getActivityColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return theme.palette.success.main
      case 'warning':
        return theme.palette.warning.main
      case 'error':
        return theme.palette.error.main
      default:
        return theme.palette.info.main
    }
  }

  const getStatusLabel = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return 'Completado'
      case 'warning':
        return 'Pendiente'
      case 'error':
        return 'Error'
      default:
        return 'En Proceso'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)

    if (diff < 60) return `Hace ${diff}m`
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)}h`
    return date.toLocaleDateString()
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Actividad Reciente"
        subheader="Últimas acciones"
        sx={{
          '& .MuiCardHeader-title': {
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          },
        }}
      />
      <CardContent sx={{ maxHeight: { xs: 500, sm: 400 }, overflow: 'auto' }}>
        {data.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
              textAlign: 'center',
            }}
          >
            <Icon
              icon="mdi:timeline-clock"
              fontSize={48}
              color={theme.palette.text.secondary}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No hay actividad reciente
            </Typography>
          </Box>
        ) : (
          data.map((activity, index) => (
            <Box
              key={activity.id}
              sx={{
                display: 'flex',
                mb: index !== data.length - 1 ? 3 : 0,
                pb: index !== data.length - 1 ? 3 : 0,
                borderBottom:
                  index !== data.length - 1
                    ? `1px solid ${theme.palette.divider}`
                    : 'none',
              }}
            >
              <Box
                sx={{
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  minWidth: { xs: 36, sm: 40 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  backgroundColor: `${getActivityColor(activity.status)}15`,
                  mr: { xs: 2, sm: 3 },
                }}
              >
                <Icon
                  icon={getActivityIcon(activity.type)}
                  fontSize={22}
                  style={{ color: getActivityColor(activity.status) }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {activity.description}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <Chip
                    size="small"
                    label={getStatusLabel(activity.status)}
                    sx={{
                      height: { xs: 18, sm: 20 },
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      backgroundColor: `${getActivityColor(activity.status)}15`,
                      color: getActivityColor(activity.status),
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }}
                  >
                    {formatTime(activity.timestamp)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default DashboardRecentActivity
