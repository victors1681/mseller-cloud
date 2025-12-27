// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import LinearProgress from '@mui/material/LinearProgress'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { TopProduct } from 'src/types/apps/dashboardTypes'

interface Props {
  data: TopProduct[]
}

const DashboardTopProducts = ({ data }: Props) => {
  const theme = useTheme()

  const maxSales = Math.max(...data.map((p) => p.sales))

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Top Productos"
        subheader="Más vendidos del período"
        sx={{
          '& .MuiCardHeader-title': {
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          },
        }}
      />
      <CardContent>
        {data.map((product, index) => (
          <Box
            key={product.id}
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                  minWidth: 0,
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
                    backgroundColor: theme.palette.primary.main,
                    color: 'common.white',
                    mr: { xs: 2, sm: 3 },
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    fontWeight: 600,
                  }}
                >
                  {index + 1}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {product.sales} unidades
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  textAlign: 'right',
                  minWidth: { xs: 80, sm: 100 },
                  ml: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  ${product.revenue.toLocaleString()}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Icon
                    icon={
                      product.trend >= 0
                        ? 'mdi:trending-up'
                        : 'mdi:trending-down'
                    }
                    fontSize={18}
                    style={{
                      color:
                        product.trend >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      ml: 0.5,
                      color: product.trend >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }}
                  >
                    {Math.abs(product.trend)}%
                  </Typography>
                </Box>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(product.sales / maxSales) * 100}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.palette.action.hover,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}

export default DashboardTopProducts
