// ** React Imports
import { useMemo } from 'react'

// ** MUI Imports
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import {
  MovimientoInventarioResponse,
  TipoMovimientoInventario,
} from 'src/types/apps/inventoryMovementsTypes'

// ** Utils
import { formatCurrency } from 'src/utils/formatCurrency'

interface MovementStatsCardProps {
  movements: MovimientoInventarioResponse[]
}

const MovementStatsCard = ({ movements }: MovementStatsCardProps) => {
  // ** Calculate stats
  const stats = useMemo(() => {
    const totalMovements = movements.length

    const entradas = movements.filter(
      (m) => m.tipoMovimiento === TipoMovimientoInventario.Entrada,
    )
    const salidas = movements.filter(
      (m) => m.tipoMovimiento === TipoMovimientoInventario.Salida,
    )
    const ajustes = movements.filter(
      (m) => m.tipoMovimiento === TipoMovimientoInventario.Ajuste,
    )
    const devoluciones = movements.filter(
      (m) => m.tipoMovimiento === TipoMovimientoInventario.Devolucion,
    )

    const totalEntradas = entradas.reduce((sum, m) => sum + m.cantidad, 0)
    const totalSalidas = salidas.reduce((sum, m) => sum + m.cantidad, 0)
    const totalAjustes = ajustes.reduce((sum, m) => sum + m.cantidad, 0)
    const totalDevoluciones = devoluciones.reduce(
      (sum, m) => sum + m.cantidad,
      0,
    )

    const valorEntradas = entradas.reduce((sum, m) => sum + m.valorTotal, 0)
    const valorSalidas = salidas.reduce((sum, m) => sum + m.valorTotal, 0)
    const valorAjustes = ajustes.reduce((sum, m) => sum + m.valorTotal, 0)
    const valorDevoluciones = devoluciones.reduce(
      (sum, m) => sum + m.valorTotal,
      0,
    )

    const valorTotal =
      valorEntradas + valorSalidas + valorAjustes + valorDevoluciones

    return {
      totalMovements,
      totalEntradas,
      totalSalidas,
      totalAjustes,
      totalDevoluciones,
      valorEntradas,
      valorSalidas,
      valorAjustes,
      valorDevoluciones,
      valorTotal,
    }
  }, [movements])

  const statItems = [
    {
      title: 'Total de Movimientos',
      value: stats.totalMovements.toString(),
      icon: 'mdi:swap-horizontal',
      color: 'primary',
    },
    {
      title: 'Entradas',
      value: `${stats.totalEntradas.toFixed(2)} unidades`,
      subtitle: formatCurrency(stats.valorEntradas),
      icon: 'mdi:arrow-down',
      color: 'success',
    },
    {
      title: 'Salidas',
      value: `${stats.totalSalidas.toFixed(2)} unidades`,
      subtitle: formatCurrency(Math.abs(stats.valorSalidas)),
      icon: 'mdi:arrow-up',
      color: 'error',
    },
    {
      title: 'Ajustes',
      value: `${stats.totalAjustes.toFixed(2)} unidades`,
      subtitle: formatCurrency(Math.abs(stats.valorAjustes)),
      icon: 'mdi:playlist-edit',
      color: 'info',
    },
    {
      title: 'Devoluciones',
      value: `${stats.totalDevoluciones.toFixed(2)} unidades`,
      subtitle: formatCurrency(Math.abs(stats.valorDevoluciones)),
      icon: 'mdi:keyboard-return',
      color: 'warning',
    },
    {
      title: 'Valor Total',
      value: formatCurrency(Math.abs(stats.valorTotal)),
      icon: 'mdi:currency-usd',
      color: 'secondary',
    },
  ]

  return (
    <Card>
      <CardHeader
        title="Resumen de Movimientos"
        subheader="Estadísticas de los movimientos filtrados"
      />
      <CardContent>
        <Grid container spacing={4}>
          {statItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: (theme) => theme.shadows[4],
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    mb: 2,
                    backgroundColor:
                      item.color === 'primary'
                        ? 'primary.light'
                        : item.color === 'success'
                        ? 'success.light'
                        : item.color === 'error'
                        ? 'error.light'
                        : item.color === 'info'
                        ? 'info.light'
                        : item.color === 'warning'
                        ? 'warning.light'
                        : 'secondary.light',
                    color: `${item.color}.main`,
                  }}
                >
                  <Icon icon={item.icon} fontSize="1.5rem" />
                </Box>

                <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                  {item.value}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {item.title}
                </Typography>

                {item.subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {item.subtitle}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default MovementStatsCard
