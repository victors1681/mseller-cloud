// ** React Imports
import { useCallback, useState } from 'react'

// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// ** Third Party Imports
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { CuentaCxc } from 'src/types/apps/cxcTypes'

// ** Utils
import formatCurrency from 'src/utils/formatCurrency'

// ** Components
import CxcStatusBadge from './CxcStatusBadge'

interface CxcCardProps {
  cxc: CuentaCxc
  onPayment?: (cxc: CuentaCxc) => void
  onCreditNote?: (cxc: CuentaCxc) => void
  onDebitNote?: (cxc: CuentaCxc) => void
  onReturn?: (cxc: CuentaCxc) => void
  onViewDetail?: (cxc: CuentaCxc) => void
  onViewClient?: (cxc: CuentaCxc) => void
  compact?: boolean
}

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-2px)',
  },
  '&.overdue': {
    borderLeft: `4px solid ${theme.palette.error.main}`,
    backgroundColor: 'rgba(255, 82, 82, 0.04)',
  },
  '&.paid': {
    borderLeft: `4px solid ${theme.palette.success.main}`,
  },
  '&.partial-payment': {
    borderLeft: `4px solid ${theme.palette.info.main}`,
  },
}))

const ProgressBar = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 4,
  backgroundColor: theme.palette.grey[300],
  borderRadius: 2,
  overflow: 'hidden',
  marginTop: theme.spacing(1),
}))

const ProgressFill = styled(Box)<{ percentage: number; status: string }>(
  ({ theme, percentage, status }) => ({
    height: '100%',
    width: `${percentage}%`,
    backgroundColor:
      status === 'Pagado'
        ? theme.palette.success.main
        : status === 'PagoParcial'
        ? theme.palette.info.main
        : status === 'Vencido'
        ? theme.palette.error.main
        : theme.palette.warning.main,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.standard,
    }),
  }),
)

const CxcCard: React.FC<CxcCardProps> = ({
  cxc,
  onPayment,
  onCreditNote,
  onDebitNote,
  onReturn,
  onViewDetail,
  onViewClient,
  compact = false,
}) => {
  // ** Hooks
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showDetails, setShowDetails] = useState(false)

  // ** Handlers
  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      setAnchorEl(event.currentTarget)
    },
    [],
  )

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleCardClick = useCallback(() => {
    if (onViewDetail) {
      onViewDetail(cxc)
    }
  }, [cxc, onViewDetail])

  const handleToggleDetails = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      setShowDetails(!showDetails)
    },
    [showDetails],
  )

  // ** Computed values
  const isOverdue = cxc.estaVencido
  const cardClassName =
    cxc.estado === 'Pagado'
      ? 'paid'
      : cxc.estado === 'PagoParcial'
      ? 'partial-payment'
      : isOverdue
      ? 'overdue'
      : ''

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
    } catch {
      return 'Fecha inválida'
    }
  }

  return (
    <StyledCard
      className={cardClassName}
      onClick={handleCardClick}
      elevation={2}
    >
      <CardContent sx={{ pb: compact ? 2 : 3 }}>
        {/* Header Row */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box flex={1}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: isMobile ? '1rem' : '1.125rem',
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              {cxc.numeroCxc}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              Doc: {cxc.numeroDocumento}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <CxcStatusBadge status={cxc.estado} size="small" />

            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{
                p: 0.5,
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <Icon icon="mdi:dots-vertical" fontSize="1.25rem" />
            </IconButton>
          </Stack>
        </Box>

        {/* Client Info */}
        <Box mb={2}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              fontSize: isMobile ? '0.875rem' : '1rem',
              color: 'text.primary',
              mb: 0.5,
            }}
          >
            {cxc.cliente?.nombre || 'Cliente no disponible'}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
          >
            Código: {cxc.codigoCliente}
          </Typography>
        </Box>

        {/* Amount Info */}
        <Box mb={2}>
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 1 : 2}
            alignItems={isMobile ? 'flex-start' : 'center'}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  fontSize: isMobile ? '1rem' : '1.125rem',
                }}
              >
                {formatCurrency(cxc.montoTotal)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Pendiente
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  fontSize: isMobile ? '1rem' : '1.125rem',
                  color: cxc.saldoPendiente > 0 ? 'error.main' : 'success.main',
                }}
              >
                {formatCurrency(cxc.saldoPendiente)}
              </Typography>
            </Box>
          </Stack>

          {/* Progress Bar */}
          <ProgressBar>
            <ProgressFill
              percentage={cxc.porcentajePagado}
              status={cxc.estado}
            />
          </ProgressBar>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: 'block' }}
          >
            {cxc.porcentajePagado.toFixed(1)}% pagado
          </Typography>
        </Box>

        {/* Date Info */}
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={isMobile ? 1 : 2}
          sx={{ mb: compact ? 0 : 2 }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Emisión
            </Typography>
            <Typography variant="body2">
              {formatDate(cxc.fechaEmision)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Vencimiento
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: isOverdue ? 'error.main' : 'text.primary',
                fontWeight: isOverdue ? 600 : 400,
              }}
            >
              {formatDate(cxc.fechaVencimiento)}
            </Typography>
          </Box>

          {isOverdue && (
            <Box>
              <Chip
                label={`${cxc.diasVencimiento} días`}
                color="error"
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>
          )}
        </Stack>

        {/* Collapsible Details */}
        {!compact && (
          <Collapse in={showDetails}>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={1}>
              {cxc.condicionPago && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Condición de Pago
                  </Typography>
                  <Typography variant="body2">{cxc.condicionPago}</Typography>
                </Box>
              )}

              {cxc.localidad && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Localidad
                  </Typography>
                  <Typography variant="body2">
                    {cxc.localidad.nombre}
                  </Typography>
                </Box>
              )}

              {cxc.movimientos && cxc.movimientos.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Último Movimiento
                  </Typography>
                  <Typography variant="body2">
                    {cxc.movimientos[0].tipoMovimientoDescripcion} -{' '}
                    {formatCurrency(cxc.movimientos[0].monto)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(cxc.movimientos[0].fechaMovimiento)}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Collapse>
        )}
      </CardContent>

      {/* Actions */}
      {!compact && (
        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
          <Button
            size="small"
            onClick={handleToggleDetails}
            startIcon={
              <Icon
                icon={showDetails ? 'mdi:chevron-up' : 'mdi:chevron-down'}
              />
            }
          >
            {showDetails ? 'Menos' : 'Más'} detalles
          </Button>

          {onViewClient && (
            <Button
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation()
                onViewClient(cxc)
              }}
            >
              Ver Cliente
            </Button>
          )}
        </CardActions>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {onViewDetail && (
          <MenuItem
            onClick={() => {
              handleMenuClose()
              onViewDetail(cxc)
            }}
          >
            <ListItemIcon>
              <Icon icon="mdi:eye-outline" />
            </ListItemIcon>
            <ListItemText>Ver Detalle</ListItemText>
          </MenuItem>
        )}

        {onPayment && cxc.saldoPendiente > 0 && (
          <MenuItem
            onClick={() => {
              handleMenuClose()
              onPayment(cxc)
            }}
          >
            <ListItemIcon>
              <Icon icon="mdi:cash" />
            </ListItemIcon>
            <ListItemText>Registrar Pago</ListItemText>
          </MenuItem>
        )}

        {onCreditNote && cxc.saldoPendiente > 0 && (
          <MenuItem
            onClick={() => {
              handleMenuClose()
              onCreditNote(cxc)
            }}
          >
            <ListItemIcon>
              <Icon icon="mdi:note-edit-outline" />
            </ListItemIcon>
            <ListItemText>Nota de Crédito</ListItemText>
          </MenuItem>
        )}

        {onDebitNote && (
          <MenuItem
            onClick={() => {
              handleMenuClose()
              onDebitNote(cxc)
            }}
          >
            <ListItemIcon>
              <Icon icon="mdi:note-plus-outline" />
            </ListItemIcon>
            <ListItemText>Nota de Débito</ListItemText>
          </MenuItem>
        )}

        {onReturn && cxc.saldoPendiente > 0 && (
          <MenuItem
            onClick={() => {
              handleMenuClose()
              onReturn(cxc)
            }}
          >
            <ListItemIcon>
              <Icon icon="mdi:keyboard-return" />
            </ListItemIcon>
            <ListItemText>Devolución</ListItemText>
          </MenuItem>
        )}

        {onViewClient && (
          <MenuItem
            onClick={() => {
              handleMenuClose()
              onViewClient(cxc)
            }}
          >
            <ListItemIcon>
              <Icon icon="mdi:account-outline" />
            </ListItemIcon>
            <ListItemText>Ver Cliente</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </StyledCard>
  )
}

export default CxcCard
