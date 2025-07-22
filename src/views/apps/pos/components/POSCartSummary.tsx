import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  TextField,
  Chip,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { POSCartItem } from 'src/types/apps/posTypes'
import formatCurrency from 'src/utils/formatCurrency'
import { usePermissions } from 'src/hooks/usePermissions'

const StyledCartCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(1),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  minHeight: 0, // Important for flex child with overflow
}))

const StyledCartList = styled(Box)({
  flex: 1,
  overflow: 'auto',
  padding: 0,
})

const StyledCartItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  alignItems: 'flex-start',
}))

const StyledSummarySection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}))

const StyledQuantityControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
}))

interface POSCartSummaryProps {
  cart: POSCartItem[]
  totals: {
    subtotal: number
    descuentoTotal: number
    impuestoTotal: number
    total: number
  }
  onUpdateQuantity: (itemId: string, updates: Partial<POSCartItem>) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
  onClearCart: () => void
}

const POSCartSummary: React.FC<POSCartSummaryProps> = ({
  cart,
  totals,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onClearCart,
}) => {
  const theme = useTheme()
  const { hasPermission } = usePermissions()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleClearCartClick = () => {
    setConfirmOpen(true)
  }

  const handleConfirmClear = () => {
    setConfirmOpen(false)
    onClearCart()
  }

  const handleCancelClear = () => {
    setConfirmOpen(false)
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      onUpdateQuantity(itemId, { cantidad: newQuantity })
    }
  }

  const getProductImage = (item: POSCartItem): string => {
    if (item.producto.imagenes && item.producto.imagenes.length > 0) {
      const defaultImage = item.producto.imagenes.find(
        (img) => img.esImagenPredeterminada,
      )
      return (
        defaultImage?.rutaPublica ||
        item.producto.imagenes[0]?.rutaPublica ||
        ''
      )
    }
    return ''
  }

  return (
    <StyledCartCard>
      <CardHeader
        title={`Carrito (${cart.length})`}
        titleTypographyProps={{ variant: 'h6', fontSize: '1rem' }}
        action={
          cart.length > 0 &&
          hasPermission('pos.clearCart') && (
            <IconButton
              size="small"
              onClick={handleClearCartClick}
              color="error"
            >
              <Icon icon="mdi:trash-can-outline" />
            </IconButton>
          )
        }
        sx={{ pb: 1 }}
      />

      <StyledCartList>
        {cart.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Icon
              icon="mdi:cart-outline"
              fontSize={48}
              style={{ color: '#ccc', marginBottom: 16 }}
            />
            <Typography variant="body2" color="text.secondary">
              Tu carrito está vacío
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Selecciona productos para agregar al carrito
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {cart.map((item) => {
              const productImage = getProductImage(item)

              return (
                <StyledCartItem key={item.id}>
                  <Box sx={{ mr: 2, flexShrink: 0 }}>
                    {productImage ? (
                      <Box
                        component="img"
                        src={productImage}
                        alt={item.producto.nombre}
                        sx={{
                          width: 40,
                          height: 40,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: theme.palette.grey[200],
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon icon="mdi:package-variant" fontSize={20} />
                      </Box>
                    )}
                  </Box>

                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, lineHeight: 1.2 }}
                      >
                        {item.producto.nombre}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {item.producto.codigo}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          >
                            {formatCurrency(item.subtotal)}
                          </Typography>

                          <Chip
                            label={`${formatCurrency(item.precio)} x ${
                              item.cantidad
                            }`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>

                        <StyledQuantityControl>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item.id, item.cantidad - 1)
                            }
                            disabled={item.cantidad <= 1}
                          >
                            <Icon icon="mdi:minus" fontSize={16} />
                          </IconButton>

                          <TextField
                            size="small"
                            value={item.cantidad}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 1
                              handleQuantityChange(item.id, newQuantity)
                            }}
                            inputProps={{
                              style: {
                                textAlign: 'center',
                                padding: '4px 8px',
                              },
                              min: 1,
                            }}
                            sx={{ width: 60 }}
                          />

                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item.id, item.cantidad + 1)
                            }
                          >
                            <Icon icon="mdi:plus" fontSize={16} />
                          </IconButton>
                        </StyledQuantityControl>
                      </Box>
                    }
                  />

                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onRemoveItem(item.id)}
                      color="error"
                    >
                      <Icon icon="mdi:close" fontSize={16} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </StyledCartItem>
              )
            })}
          </List>
        )}
      </StyledCartList>

      {cart.length > 0 && (
        <StyledSummarySection>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">
                {formatCurrency(totals.subtotal)}
              </Typography>
            </Box>

            {totals.descuentoTotal > 0 && (
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="body2" color="error">
                  Descuento:
                </Typography>
                <Typography variant="body2" color="error">
                  -{formatCurrency(totals.descuentoTotal)}
                </Typography>
              </Box>
            )}

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2">ITBIS:</Typography>
              <Typography variant="body2">
                {formatCurrency(totals.impuestoTotal)}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Total:
              </Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                {formatCurrency(totals.total)}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={onCheckout}
            startIcon={<Icon icon="mdi:cash-register" />}
            sx={{ mb: 1 }}
          >
            Procesar Pago
          </Button>
        </StyledSummarySection>
      )}

      {/* Confirmation Modal */}
      {confirmOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.3)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Card sx={{ minWidth: 320, p: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ¿Seguro que deseas vaciar el carrito?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={handleCancelClear}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleConfirmClear}
                >
                  Vaciar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </StyledCartCard>
  )
}

export default POSCartSummary
