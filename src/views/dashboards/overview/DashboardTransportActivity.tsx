// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { TransportActivity } from 'src/types/apps/dashboardTypes'

interface Props {
  data: TransportActivity[]
}

const DashboardTransportActivity = ({ data }: Props) => {
  const theme = useTheme()

  const getStatusColor = (status: TransportActivity['status']) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main
      case 'idle':
        return theme.palette.warning.main
      default:
        return theme.palette.error.main
    }
  }

  const getStatusLabel = (status: TransportActivity['status']) => {
    switch (status) {
      case 'active':
        return 'Activo'
      case 'idle':
        return 'Disponible'
      default:
        return 'Offline'
    }
  }

  return (
    <Card>
      <CardHeader
        title="Actividad de Transporte"
        subheader="Estado de distribuidores"
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
            <Icon icon="mdi:truck-delivery" fontSize={48} color={theme.palette.text.secondary} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No hay actividad de transporte
            </Typography>
          </Box>
        ) : (
          data.map((driver, index) => (
          <Box
            key={driver.driverId}
            sx={{
              mb: index !== data.length - 1 ? 4 : 0,
              pb: index !== data.length - 1 ? 4 : 0,
              borderBottom:
                index !== data.length - 1
                  ? `1px solid ${theme.palette.divider}`
                  : 'none',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  {driver.driverName}
                </Typography>
                <Chip
                  size="small"
                  label={getStatusLabel(driver.status)}
                  sx={{
                    height: { xs: 18, sm: 20 },
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    backgroundColor: `${getStatusColor(driver.status)}15`,
                    color: getStatusColor(driver.status),
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: { xs: 1, sm: 2 },
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  }}
                >
                  Rutas Activas
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  {driver.activeRoutes}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  }}
                >
                  Completadas Hoy
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  {driver.completedToday}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  }}
                >
                  Pendientes
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  {driver.pendingDeliveries}
                </Typography>
              </Box>
            </Box>

            {/* Delivery Statistics Breakdown */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                  mb: 1.5,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  fontWeight: 600,
                }}
              >
                Estado de Entregas
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                  },
                  gap: 1.5,
                }}
              >
                {/* Delivered */}
                <Tooltip title="Entregadas exitosamente" arrow placement="top">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: `${theme.palette.success.main}08`,
                      border: `1px solid ${theme.palette.success.main}20`,
                    }}
                  >
                    <Icon
                      icon="mdi:check-circle"
                      fontSize={18}
                      color={theme.palette.success.main}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          display: 'block',
                          fontSize: '0.65rem',
                        }}
                      >
                        Entregadas
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: theme.palette.success.main,
                        }}
                      >
                        {driver.deliveryStats.delivered}
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>

                {/* Not Delivered */}
                <Tooltip title="No entregadas" arrow placement="top">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: `${theme.palette.error.main}08`,
                      border: `1px solid ${theme.palette.error.main}20`,
                    }}
                  >
                    <Icon
                      icon="mdi:close-circle"
                      fontSize={18}
                      color={theme.palette.error.main}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          display: 'block',
                          fontSize: '0.65rem',
                        }}
                      >
                        No Entregadas
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: theme.palette.error.main,
                        }}
                      >
                        {driver.deliveryStats.notDelivered}
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>

                {/* Delivered Another Day */}
                <Tooltip title="Entregadas en otro día" arrow placement="top">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: `${theme.palette.warning.main}08`,
                      border: `1px solid ${theme.palette.warning.main}20`,
                    }}
                  >
                    <Icon
                      icon="mdi:calendar-clock"
                      fontSize={18}
                      color={theme.palette.warning.main}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          display: 'block',
                          fontSize: '0.65rem',
                        }}
                      >
                        Otro Día
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: theme.palette.warning.main,
                        }}
                      >
                        {driver.deliveryStats.deliveredAnotherDay}
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>

                {/* Partial Delivery */}
                <Tooltip title="Entregas parciales" arrow placement="top">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: `${theme.palette.info.main}08`,
                      border: `1px solid ${theme.palette.info.main}20`,
                    }}
                  >
                    <Icon
                      icon="mdi:package-variant"
                      fontSize={18}
                      color={theme.palette.info.main}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          display: 'block',
                          fontSize: '0.65rem',
                        }}
                      >
                        Parciales
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: theme.palette.info.main,
                        }}
                      >
                        {driver.deliveryStats.partialDelivery}
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>

                {/* Returned */}
                <Tooltip title="Devoluciones" arrow placement="top">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: `${theme.palette.grey[500]}08`,
                      border: `1px solid ${theme.palette.grey[500]}20`,
                    }}
                  >
                    <Icon
                      icon="mdi:package-up"
                      fontSize={18}
                      color={theme.palette.grey[500]}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          display: 'block',
                          fontSize: '0.65rem',
                        }}
                      >
                        Devoluciones
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: theme.palette.grey[600],
                        }}
                      >
                        {driver.deliveryStats.returned}
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>
              </Box>
            </Box>
            {driver.status === 'active' && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    mb: 1,
                    display: 'block',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  }}
                >
                  Progreso del día
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    (driver.completedToday /
                      (driver.completedToday + driver.pendingDeliveries)) *
                    100
                  }
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: theme.palette.action.hover,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundColor: theme.palette.success.main,
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        )))}
      </CardContent>
    </Card>
  )
}

export default DashboardTransportActivity
