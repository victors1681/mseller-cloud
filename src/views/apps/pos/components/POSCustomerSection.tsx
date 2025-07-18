import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { CustomerType } from 'src/types/apps/customerType'
import { POSCustomer } from 'src/types/apps/posTypes'
import CustomerSearchDialog from 'src/views/ui/customerSearchDialog'

const StyledCustomerCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  flexShrink: 0, // Don't shrink this component
}))

const StyledCustomerInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5),
}))

const StyledCustomerDetails = styled(Box)({
  flex: 1,
  minWidth: 0,
})

interface POSCustomerSectionProps {
  customer: POSCustomer | null
  onCustomerSelect: (customer: CustomerType) => void
  onNewCustomer: (customerData: any) => void
  onClearCustomer: () => void
}

const POSCustomerSection: React.FC<POSCustomerSectionProps> = ({
  customer,
  onCustomerSelect,
  onNewCustomer,
  onClearCustomer,
}) => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [newCustomerDialogOpen, setNewCustomerDialogOpen] = useState(false)
  const [newCustomerData, setNewCustomerData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    rnc: '',
  })

  const handleNewCustomerSave = () => {
    if (newCustomerData.nombre.trim()) {
      onNewCustomer(newCustomerData)
      setNewCustomerDialogOpen(false)
      setNewCustomerData({
        nombre: '',
        telefono: '',
        email: '',
        direccion: '',
        rnc: '',
      })
    }
  }

  const getCustomerInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <StyledCustomerCard>
        <CardHeader
          title="Cliente"
          titleTypographyProps={{
            variant: 'subtitle1',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
          action={
            customer && (
              <IconButton size="small" onClick={onClearCustomer}>
                <Icon icon="mdi:close" fontSize="small" />
              </IconButton>
            )
          }
          sx={{ pb: 0.5, pt: 1 }}
        />
        <CardContent sx={{ pt: 0, pb: 1 }}>
          {customer ? (
            <StyledCustomerInfo>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 32,
                  height: 32,
                  fontSize: '0.8rem',
                }}
              >
                {customer.isNew
                  ? getCustomerInitials(customer.tempData?.nombre || 'N/A')
                  : getCustomerInitials(customer.customer?.nombre || 'N/A')}
              </Avatar>

              <StyledCustomerDetails>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}
                >
                  {customer.isNew
                    ? customer.tempData?.nombre
                    : customer.customer?.nombre}
                </Typography>

                {customer.isNew ? (
                  <>
                    {customer.tempData?.telefono && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ fontSize: '0.7rem', lineHeight: 1.1 }}
                      >
                        Tel: {customer.tempData.telefono}
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      color="warning.main"
                      display="block"
                      sx={{ fontSize: '0.7rem', lineHeight: 1.1 }}
                    >
                      Cliente temporal
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ fontSize: '0.7rem', lineHeight: 1.1 }}
                    >
                      Código: {customer.customer?.codigo}
                    </Typography>
                    {customer.customer?.telefono1 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ fontSize: '0.7rem', lineHeight: 1.1 }}
                      >
                        Tel: {customer.customer.telefono1}
                      </Typography>
                    )}
                    {customer.customer?.balance !== undefined && (
                      <Typography
                        variant="caption"
                        color={
                          customer.customer.balance >= 0
                            ? 'success.main'
                            : 'error.main'
                        }
                        display="block"
                        sx={{ fontSize: '0.7rem', lineHeight: 1.1 }}
                      >
                        Balance: ${customer.customer.balance.toFixed(2)}
                      </Typography>
                    )}
                  </>
                )}
              </StyledCustomerDetails>
            </StyledCustomerInfo>
          ) : (
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Icon
                icon="mdi:account-outline"
                fontSize={24}
                style={{ color: '#ccc', marginBottom: 4 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: 'block' }}
              >
                Selecciona un cliente
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={
                    <Icon icon="mdi:account-search" fontSize="small" />
                  }
                  onClick={() => setSearchDialogOpen(true)}
                  fullWidth
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  Buscar
                </Button>

                <Button
                  variant="text"
                  size="small"
                  startIcon={<Icon icon="mdi:account-plus" fontSize="small" />}
                  onClick={() => setNewCustomerDialogOpen(true)}
                  fullWidth
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  Temporal
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </StyledCustomerCard>

      {/* Customer Search Dialog */}
      <CustomerSearchDialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        onSelectCustomer={(selectedCustomer: CustomerType) => {
          onCustomerSelect(selectedCustomer)
          setSearchDialogOpen(false)
        }}
        title="Seleccionar Cliente"
        maxWidth="md"
      />

      {/* New Customer Dialog */}
      <Dialog
        open={newCustomerDialogOpen}
        onClose={() => setNewCustomerDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon icon="mdi:account-plus" />
            Cliente Temporal
          </Box>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre *"
                value={newCustomerData.nombre}
                onChange={(e) =>
                  setNewCustomerData((prev) => ({
                    ...prev,
                    nombre: e.target.value,
                  }))
                }
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={newCustomerData.telefono}
                onChange={(e) =>
                  setNewCustomerData((prev) => ({
                    ...prev,
                    telefono: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="RNC"
                value={newCustomerData.rnc}
                onChange={(e) =>
                  setNewCustomerData((prev) => ({
                    ...prev,
                    rnc: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newCustomerData.email}
                onChange={(e) =>
                  setNewCustomerData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                multiline
                rows={2}
                value={newCustomerData.direccion}
                onChange={(e) =>
                  setNewCustomerData((prev) => ({
                    ...prev,
                    direccion: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setNewCustomerDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleNewCustomerSave}
            disabled={!newCustomerData.nombre.trim()}
          >
            Crear Cliente
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default POSCustomerSection
