// ** React Imports

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Utils
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

interface Props {
  title: string
  value: string | number
  subtitle: string
  icon: string
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  trend?: number
}

const DashboardStatsCard = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  trend,
}: Props) => {
  const theme = useTheme()
  const colorValue = theme.palette[color].main

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'visible',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: 'text.secondary',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              backgroundColor: hexToRGBA(colorValue, 0.1),
            }}
          >
            <Icon icon={icon} fontSize={32} style={{ color: colorValue }} />
          </Box>
        </Box>

        {trend !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Icon
              icon={trend >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'}
              fontSize={20}
              style={{
                color:
                  trend >= 0
                    ? theme.palette.success.main
                    : theme.palette.error.main,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                ml: 0.5,
                color: trend >= 0 ? 'success.main' : 'error.main',
                fontWeight: 600,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
              }}
            >
              {Math.abs(trend)}%
            </Typography>
            <Typography
              variant="caption"
              sx={{
                ml: 1,
                color: 'text.secondary',
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
              }}
            >
              vs último período
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default DashboardStatsCard
