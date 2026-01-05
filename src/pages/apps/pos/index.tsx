import {
  AppBar,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import Icon from 'src/@core/components/icon'

// Redux
import { usePOS } from '@/views/apps/pos/hook/usePOS'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { setInitialTurnoData } from 'src/store/apps/pos'
import { fetchData, fetchProductDetail } from 'src/store/apps/products'

// Layout
import FullscreenPOSLayout from 'src/layouts/FullscreenPOSLayout'

// Components
import OnlineStatusIndicator from '@/views/apps/pos/components/OnlineStatusIndicator'
import { usePOSPersistence } from '@/views/apps/pos/hook/usePOSPersistence'
import AbrirTurnoModal from 'src/views/apps/pos/AbrirTurnoModal'
import CerrarTurnoModal from 'src/views/apps/pos/CerrarTurnoModal'
import {
  POSAreaFilter,
  POSCartSummary,
  POSCustomerSection,
  POSPaymentDialog,
  POSProductGrid,
  POSQuantityDialog,
} from 'src/views/apps/pos/components'
import { DocumentRendererModal } from 'src/views/ui/documentRenderer'

// Types
import { CustomerType } from 'src/types/apps/customerType'
import { TurnoType } from 'src/types/apps/posType'
import { POSAreaFilter as AreaFilterType } from 'src/types/apps/posTypes'
import { ProductType } from 'src/types/apps/productTypes'

// Component Props Interface
interface POSPageProps {
  initialTurnoData?: TurnoType | null
  hasTurnoOpen?: boolean
  skipSSR?: boolean
}

// Utils
import { addNewDocument } from '@/store/apps/documents'
import { transformPOSDataToDocument } from '@/utils/transformPaymentData'
import toast from 'react-hot-toast'
import { usePermissions } from 'src/hooks/usePermissions'
import { v4 as uuidV4 } from 'uuid'
import { AuthContext } from '../../../context/AuthContext'
import { useBarcodeScan } from '../../../hooks/useBarcodeScan'
import { TipoDocumentoNumerico } from '../../../types/apps/reportsTypes'
import { usePOSStore } from '../../../views/apps/pos/hook/usePOSStore'

const StyledMainContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
})

const StyledContentContainer = styled(Box)({
  flex: 1,
  overflow: 'hidden',
})

const StyledLeftPanel = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

const StyledRightPanel = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

const StyledSearchBar = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  flexShrink: 0,
}))

const StyledProductArea = styled(Box)({
  flex: 1,
  overflow: 'auto',
  padding: 8,
})

const POSPage: NextPage<POSPageProps> = ({
  initialTurnoData = null,
  hasTurnoOpen = false,
  skipSSR = false,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const { user, loading: authLoading } = useContext(AuthContext)
  const {
    heldCarts,
    holdCart,
    resumeCart,
    removeHeldCart,
    pendingOrders,
    savePendingOrder,
    syncPendingOrders,
    cacheProducts,
    loadProductCache,
    cachedProducts,
  } = usePOSPersistence()

  // POS Turno Management
  const {
    store: posStore,
    isTurnoOpen,
    hasTurnoActual,
    loadTurnoActual,
    showAbrirTurnoModal,
    showCerrarTurnoModal,
  } = usePOS()

  const [activeHeldCartId, setActiveHeldCartId] = useState<string | null>(null)

  // Check POS access permission on client side only - wait for auth to load
  useEffect(() => {
    if (!authLoading && !hasPermission('pos.allowCashierAccess')) {
      router.push('/401') // Redirect to unauthorized page
    }
  }, [hasPermission, router, authLoading])

  // Don't render anything while loading auth or if user doesn't have permission
  if (authLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="h6" color="text.secondary">
          Cargando...
        </Typography>
      </Box>
    )
  }

  if (!hasPermission('pos.allowCashierAccess')) {
    return null
  }

  // Redux selectors
  const productStore = useSelector((state: RootState) => state.products)
  const { data: products, areas, isLoading } = productStore

  // POS Store
  const {
    cart,
    customer,
    selectedArea,
    searchQuery,
    paymentMethod,
    isProcessing,
    addToCart,
    updateCartItem,
    removeFromCart,
    setCustomer,
    setSelectedArea,
    setSearchQuery,
    clearCart,
    getTotals,
    setIsProcessing,
  } = usePOSStore()

  // Local state
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  )
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [savedDocumentNo, setSavedDocumentNo] = useState<string | null>(null)

  // Filtered products based on search and area
  const filteredProducts = useMemo(() => {
    return products.filter((product: ProductType) => {
      const matchesSearch =
        !searchQuery ||
        product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.codigoBarra.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesArea = !selectedArea || product.area === selectedArea

      return matchesSearch && matchesArea && product.status === 'A'
    })
  }, [products, searchQuery, selectedArea])

  // Transform areas to POSAreaFilter format
  const posAreas: AreaFilterType[] = useMemo(() => {
    return areas.map((area: string, index: number) => ({
      area: area,
      iDArea: index + 1,
      count: products.filter((p: ProductType) => p.area === area).length,
    }))
  }, [areas, products])

  // Load initial data
  useEffect(() => {
    loadProducts()

    // If we have initial turno data from SSR, use it instead of fetching
    if (initialTurnoData && !skipSSR) {
      dispatch(setInitialTurnoData(initialTurnoData))
    } else {
      // Enhanced client-side loading with immediate feedback
      loadTurnoActual() // Fetch turno data on client side
    }
  }, [initialTurnoData, skipSSR])

  // Enhanced loading check with better UX
  const isInitialLoading =
    posStore.isTurnoActualLoading && !posStore.turnoActual
  const shouldShowTurnoModal =
    !isInitialLoading &&
    !isTurnoOpen &&
    !posStore.isAbrirTurnoModalOpen &&
    !hasTurnoOpen

  // Check if turno is required but not open
  useEffect(() => {
    // Only check after initial load is complete and modal is not already open
    if (shouldShowTurnoModal) {
      // Add a small delay to prevent flicker during page load
      const timer = setTimeout(() => {
        if (!isTurnoOpen && !posStore.isAbrirTurnoModalOpen) {
          showAbrirTurnoModal()
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [shouldShowTurnoModal, showAbrirTurnoModal]) // Close modal when turno becomes open
  useEffect(() => {
    if (isTurnoOpen && posStore.isAbrirTurnoModalOpen) {
      console.log('Turno is now open, closing modal')
      // Force close the modal since a turno is now open
      dispatch({ type: 'appPos/toggleAbrirTurnoModal', payload: null })
    }
  }, [isTurnoOpen, posStore.isAbrirTurnoModalOpen, dispatch])

  // Load areas after products are loaded
  useEffect(() => {
    if (products.length > 0 && areas.length === 0) {
      loadAreas()
    }
  }, [products.length, areas.length])

  const loadProducts = async () => {
    try {
      // Fetch products using Redux store
      await dispatch(
        fetchData({
          query: '',
          status: 'A', // Only active products for POS
          pageSize: 1000,
          pageNumber: 0,
        }),
      )
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const loadAreas = async () => {
    try {
      // If areas are not loaded, fetch product detail to get areas
      if (products.length > 0) {
        await dispatch(fetchProductDetail(products[0].codigo))
      }
    } catch (error) {
      console.error('Error loading areas:', error)
    }
  }

  const handleProductSelect = (product: ProductType) => {
    // Don't allow product selection if turno is not open
    if (!isTurnoOpen) {
      toast.error('Debe abrir un turno antes de realizar ventas')
      return
    }

    setSelectedProduct(product)
    setQuantityDialogOpen(true)
  }

  const handleAddToCart = (
    product: ProductType,
    quantity: number,
    price: number,
  ) => {
    addToCart(product, quantity, price)
    setQuantityDialogOpen(false)
    setSelectedProduct(null)
  }

  const handleCustomerSelect = (selectedCustomer: CustomerType) => {
    setCustomer({
      customer: selectedCustomer,
      isNew: false,
    })
  }

  const handleNewCustomer = (customerData: any) => {
    setCustomer({
      isNew: true,
      tempData: customerData,
    })
  }

  // Hold current cart for later
  const handleHoldCart = async () => {
    if (cart.length === 0) return
    await holdCart(cart, customer)
    clearCart()
    setCustomer(null)
  }

  // Resume a held cart
  const handleResumeCart = async (id: string) => {
    const held = await resumeCart(id)
    if (held) {
      // Restore cart and customer

      await clearCart()
      if (held.cart && Array.isArray(held.cart)) {
        held.cart.forEach((item) => {
          // item: { producto, cantidad, precio }
          if (item.producto && item.cantidad && item.precio !== undefined) {
            addToCart(item.producto, item.cantidad, item.precio)
          }
        })
      }
      if (held.customer) setCustomer(held.customer)
      setActiveHeldCartId(id)
      await removeHeldCart(id)
    }
  }

  // Save order locally if offline, or process and sync online
  const handleProcessPayment = async (paymentData: any) => {
    setIsProcessing(true)
    try {
      if (navigator.onLine) {
        // Online: transform and send to backend
        const payload = transformPOSDataToDocument(paymentData)

        payload.localidadId = parseInt(user?.warehouse || '1')
        payload.firebaseUserId = user?.userId

        // Handle customer data based on type
        if (paymentData.customer?.isNew) {
          // New customer - add clienteNuevo object
          if (payload.clienteNuevo) {
            payload.clienteNuevo.codigo = uuidV4()
            payload.clienteNuevo.localidadId = parseInt(user?.warehouse || '1')
            payload.clienteNuevo.vendedor = user?.sellerCode || ''
            payload.clienteNuevo.tipoComprobante = '02'

            // Set condicionPago to first payment type with dias = 0
            console.log(
              'POS: Looking for payment type with dias = 0 from:',
              paymentData.paymentTypes,
            )
            const defaultPaymentType = paymentData.paymentTypes?.find(
              (pt: any) => pt.dias === 0,
            )
            payload.condicionPago = defaultPaymentType?.condicionPago || '00' // Default
            console.log('POS: Found payment type:', defaultPaymentType)
          }
        } else if (paymentData.customer?.customer) {
          // Existing customer - set codigoCliente and remove clienteNuevo
          payload.codigoCliente = paymentData.customer.customer.codigo
          payload.nombreCliente = paymentData.customer.customer.nombre
          delete payload.clienteNuevo
        } else {
          // Cliente Mostrador - remove clienteNuevo
          delete payload.clienteNuevo
        }

        const result = await dispatch(addNewDocument(payload)).unwrap()

        // Extract document number from response and trigger print
        if (result?.data?.noPedidoStr) {
          setSavedDocumentNo(result.data.noPedidoStr)
          setShowPrintModal(true)
        }
      } else {
        // Offline: save order locally
        await savePendingOrder(cart, customer)
        toast.success('Venta guardada localmente')
      }
      clearCart()
      setCustomer(null)
      setPaymentDialogOpen(false)
    } catch (error: any) {
      console.error('Error processing payment:', error)
      toast.error(
        error?.message || 'Error procesando el pago. Intente nuevamente.',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  // Sync pending orders when online
  useEffect(() => {
    if (navigator.onLine && pendingOrders.length > 0) {
      // Replace with your backend sync logic
      syncPendingOrders(async (order) => {
        // TODO: Send order to backend
        console.log('Syncing order:', order)
      })
    }
  }, [pendingOrders, syncPendingOrders])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const handleGoToMainPage = () => {
    router.push('/')
    handleMenuClose()
  }

  const handleCloseTurno = () => {
    if (posStore.turnoActual) {
      showCerrarTurnoModal(posStore.turnoActual)
    }
    handleMenuClose()
  }

  // Use custom hook for global barcode scan detection
  useBarcodeScan({
    products,
    onProductFound: (product) => {
      if (!isTurnoOpen) {
        toast.error('Debe abrir un turno antes de realizar ventas')
        return
      }
      addToCart(product, 1, product.precio1)
    },
    minBarcodeLength: 6,
  })

  const totals = getTotals()

  // Show loading state if we're still fetching turno data and don't have initial data
  if (isInitialLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="h6" color="text.secondary">
          Cargando información del turno...
        </Typography>
      </Box>
    )
  }

  return (
    <StyledMainContainer>
      {/* Payment Processing Overlay */}
      {isProcessing && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(255,255,255,0.5)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6">Procesando pago...</Typography>
        </Box>
      )}

      {/* Turno Required Overlay */}
      {shouldShowTurnoModal && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.3)',
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Card sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
            <Box sx={{ mb: 3 }}>
              <Icon icon="mdi:cash-register" fontSize="4rem" color="primary" />
            </Box>
            <Typography variant="h6" gutterBottom>
              Turno Requerido
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Debe abrir un turno antes de realizar ventas en el POS
            </Typography>
            <Button
              variant="contained"
              startIcon={<Icon icon="mdi:play-circle" />}
              onClick={showAbrirTurnoModal}
              size="large"
              fullWidth
            >
              Abrir Turno
            </Button>
          </Card>
        </Box>
      )}
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          {/* Mseller Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img
              src="/images/logos/mseller-logo-dark.png"
              alt="Mseller Logo"
              style={{ height: 40, paddingLeft: '8px' }}
            />
          </Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Punto de Venta (POS)
            {posStore.isTurnoActualLoading ? (
              <Typography
                variant="caption"
                display="block"
                color="warning.main"
              >
                Verificando turno...
              </Typography>
            ) : posStore.turnoActual ? (
              <Typography
                variant="caption"
                display="block"
                color="success.main"
              >
                Turno Activo - {posStore.turnoActual.codigoVendedor}
              </Typography>
            ) : (
              <Typography variant="caption" display="block" color="error.main">
                Sin turno activo
              </Typography>
            )}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Online/Offline Status Indicator */}
            <OnlineStatusIndicator />
            <Button
              variant="contained"
              startIcon={<Icon icon="mdi:cart-outline" />}
              onClick={() => setPaymentDialogOpen(true)}
              disabled={cart.length === 0 || !isTurnoOpen}
            >
              Cobrar ({cart.length})
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleHoldCart}
              disabled={cart.length === 0 || !isTurnoOpen}
            >
              Hold Sale
            </Button>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleGoToMainPage}>
                <ListItemIcon>
                  <Icon icon="mdi:home" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Ir a Página Principal</ListItemText>
              </MenuItem>

              {/* Close Turno Option */}
              {isTurnoOpen && (
                <MenuItem onClick={handleCloseTurno}>
                  <ListItemIcon>
                    <Icon icon="mdi:cash-register" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Cerrar Turno</ListItemText>
                </MenuItem>
              )}

              {/* Resume held carts */}
              {heldCarts.map((held) => (
                <MenuItem
                  key={held.id}
                  onClick={() => handleResumeCart(held.id)}
                >
                  <ListItemIcon>
                    <Icon icon="mdi:restore" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    Resume Sale (
                    {held.customer?.customer?.nombre || 'Sin cliente'})
                  </ListItemText>
                </MenuItem>
              ))}
            </Menu>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{
                border: 1,
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Icon icon="mdi:dots-vertical" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <StyledContentContainer className="pos-content-container">
        {/* Left Panel - Products */}
        <StyledLeftPanel className="pos-left-panel">
          {/* Search Bar */}
          <StyledSearchBar>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar producto por nombre, código o código de barras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="mdi:magnify" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <Icon icon="mdi:close" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </StyledSearchBar>

          {/* Area Filter */}
          <POSAreaFilter
            areas={posAreas}
            selectedArea={selectedArea}
            onAreaSelect={setSelectedArea}
          />

          {/* Products Grid */}
          <StyledProductArea>
            <POSProductGrid
              products={filteredProducts}
              onProductSelect={handleProductSelect}
              isLoading={isLoading}
              isMobile={isMobile}
            />
          </StyledProductArea>
        </StyledLeftPanel>

        {/* Right Panel - Cart & Customer */}
        <StyledRightPanel className="pos-right-panel">
          {/* Customer Section */}
          <POSCustomerSection
            customer={customer}
            onCustomerSelect={handleCustomerSelect}
            onNewCustomer={handleNewCustomer}
            onClearCustomer={() => setCustomer(null)}
          />

          {/* Cart Summary */}
          <POSCartSummary
            cart={cart}
            totals={totals}
            onUpdateQuantity={updateCartItem}
            onRemoveItem={removeFromCart}
            onCheckout={() => setPaymentDialogOpen(true)}
            onClearCart={clearCart}
          />
        </StyledRightPanel>
      </StyledContentContainer>

      {/* Dialogs */}
      <POSQuantityDialog
        open={quantityDialogOpen}
        product={selectedProduct}
        onClose={() => {
          setQuantityDialogOpen(false)
          setSelectedProduct(null)
        }}
        onAddToCart={handleAddToCart}
      />

      <POSPaymentDialog
        open={paymentDialogOpen}
        customer={customer}
        cart={cart}
        totals={totals}
        onClose={() => setPaymentDialogOpen(false)}
        onProcessPayment={handleProcessPayment}
        isProcessing={isProcessing}
      />

      {/* POS Turno Modals */}
      <AbrirTurnoModal />
      <CerrarTurnoModal />

      {/* Print Receipt Modal */}
      {showPrintModal && savedDocumentNo && (
        <DocumentRendererModal
          open={showPrintModal}
          onClose={() => {
            setShowPrintModal(false)
            setSavedDocumentNo(null)
          }}
          documentNo={savedDocumentNo}
          tipoDocumento={TipoDocumentoNumerico.Recibo}
          autoPrint={true}
          showPreview={false}
          onPrintCompleted={() => {
            setShowPrintModal(false)
            setSavedDocumentNo(null)
          }}
          onPrintCancelled={() => {
            setShowPrintModal(false)
            setSavedDocumentNo(null)
          }}
        />
      )}
    </StyledMainContainer>
  )
}

POSPage.authGuard = false
POSPage.getLayout = (page: React.ReactElement) => (
  <FullscreenPOSLayout>{page}</FullscreenPOSLayout>
)

// Enhanced client-side approach to minimize flicker
// This approach provides immediate loading feedback and smooth transitions
export const getServerSideProps = async () => {
  // For now, we skip SSR due to complex auth requirements (X-URL, localStorage tokens)
  // Instead, we provide enhanced client-side loading with better UX
  return {
    props: {
      initialTurnoData: null,
      hasTurnoOpen: false,
      skipSSR: true,
    },
  }
}

// Future: If you want to implement SSR later, you would need to:
// 1. Store auth tokens in httpOnly cookies instead of localStorage
// 2. Store X-URL configuration in cookies or database
// 3. Implement proper server-side session management
// 4. Create server-side restClient configuration

export default POSPage
