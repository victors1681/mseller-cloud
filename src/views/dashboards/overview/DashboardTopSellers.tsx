// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Utils
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Types
import { TopSeller } from 'src/types/apps/dashboardTypes'

interface Props {
  data: TopSeller[]
}

const DashboardTopSellers = ({ data }: Props) => {
  const theme = useTheme()

  const getInitials = (name: string) => {
    const names = name.split(' ')
    return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0]
  }

  const maxRevenue = Math.max(...data.map((s) => s.revenue))

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return theme.palette.warning.main
      case 1:
        return theme.palette.info.main
      case 2:
        return theme.palette.success.main
      default:
        return theme.palette.grey[500]
    }
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return 'mdi:trophy'
      case 1:
        return 'mdi:medal'
      case 2:
        return 'mdi:medal-outline'
      default:
        return 'mdi:star-outline'
    }
  }

  const getAvatarBackground = (index: number) => {
    switch (index) {
      case 0:
        return `linear-gradient(135deg, ${theme.palette.warning.dark} 0%, ${theme.palette.warning.main} 100%)`
      case 1:
        return `linear-gradient(135deg, ${theme.palette.info.dark} 0%, ${theme.palette.info.main} 100%)`
      case 2:
        return `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`
      default:
        return `linear-gradient(135deg, ${theme.palette.grey[700]} 0%, ${theme.palette.grey[600]} 100%)`
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Top Vendedores"
        subheader="Mejores desempeños"
        sx={{
          '& .MuiCardHeader-title': {
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          },
        }}
      />
      <CardContent>
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
            <Icon icon="mdi:account-group" fontSize={48} color={theme.palette.text.secondary} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No hay vendedores para mostrar
            </Typography>
          </Box>
        ) : (
          data.map((seller, index) => (
          <Box
            key={seller.id}
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
                mb: 2,
              }}
            >
              {/* Rank Badge */}
              <Box
                sx={{
                  position: 'relative',
                  mr: { xs: 2, sm: 3 },
                }}
              >
                <Avatar
                  src={seller.avatar}
                  sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    fontSize: { xs: '1.125rem', sm: '1.25rem' },
                    fontWeight: 700,
                    background: getAvatarBackground(index),
                    color: 'common.white',
                    border: `3px solid ${hexToRGBA(getRankColor(index), 0.2)}`,
                    boxShadow: `0 4px 8px ${hexToRGBA(
                      getRankColor(index),
                      0.3,
                    )}`,
                  }}
                >
                  {getInitials(seller.name)}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: getRankColor(index),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${theme.palette.background.paper}`,
                  }}
                >
                  <Icon
                    icon={getRankIcon(index)}
                    fontSize={14}
                    style={{ color: 'white' }}
                  />
                </Box>
              </Box>

              {/* Seller Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {seller.name}
                  </Typography>
                  <Chip
                    size="small"
                    label={`#${index + 1}`}
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: hexToRGBA(getRankColor(index), 0.15),
                      color: getRankColor(index),
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Icon
                      icon="mdi:cart"
                      fontSize={16}
                      style={{ color: theme.palette.primary.main }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        color: 'text.secondary',
                      }}
                    >
                      {seller.orders} órdenes
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Icon
                      icon="mdi:cash"
                      fontSize={16}
                      style={{ color: theme.palette.success.main }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        color: 'text.secondary',
                      }}
                    >
                      {seller.collections} cobros
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        color: 'text.secondary',
                      }}
                    >
                      Ingresos
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                        color: theme.palette.primary.main,
                      }}
                    >
                      ${seller.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(seller.revenue / maxRevenue) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: hexToRGBA(getRankColor(index), 0.15),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: getRankColor(index),
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default DashboardTopSellers
