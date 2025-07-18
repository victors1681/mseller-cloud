import React, { useState, useEffect, useMemo } from 'react'
import { NextPage } from 'next'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Paper,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchData, fetchProductDetail } from 'src/store/apps/products'

// Layout
import FullscreenPOSLayout from 'src/layouts/FullscreenPOSLayout'

// Components
import {
  POSProductGrid,
  POSCartSummary,
  POSCustomerSection,
  POSAreaFilter,
  POSQuantityDialog,
  POSPaymentDialog,
} from 'src/views/apps/pos/components'

// Types
import { ProductType } from 'src/types/apps/productTypes'
import { CustomerType } from 'src/types/apps/customerType'
import {
  POSCartItem,
  POSCustomer,
  POSAreaFilter as AreaFilterType,
} from 'src/types/apps/posTypes'

// Utils
import { usePOSStore } from '../../../hooks/usePOSStore'
import { usePermissions } from 'src/hooks/usePermissions'

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

const POSPage: NextPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { hasPermission } = usePermissions()

  // Check POS access permission on client side only
  useEffect(() => {
    if (!hasPermission('pos.allowCashierAccess')) {
      router.push('/401') // Redirect to unauthorized page
    }
  }, [hasPermission, router])

  // Don't render anything if user doesn't have permission
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
  } = usePOSStore()

  // Local state
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  )
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)

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
  }, [])

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
          pageNumber: 1,
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

  const handleCheckout = () => {
    if (cart.length === 0) return
    setPaymentDialogOpen(true)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const handleGoToMainPage = () => {
    router.push('/home')
    handleMenuClose()
  }

  const handleProcessPayment = async (paymentData: any) => {
    try {
      // TODO: Process payment and create invoice
      console.log('Processing payment:', paymentData)

      // Clear cart after successful payment
      clearCart()
      setCustomer(null)
      setPaymentDialogOpen(false)

      // Show success message
      // TODO: Add toast notification
    } catch (error) {
      console.error('Error processing payment:', error)
      // TODO: Show error message
    }
  }

  const totals = getTotals()

  return (
    <StyledMainContainer>
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
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Icon icon="mdi:cart-outline" />}
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Cobrar ({cart.length})
            </Button>

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
            onCheckout={handleCheckout}
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

      {/* Header Menu */}
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
      </Menu>
    </StyledMainContainer>
  )
}

POSPage.authGuard = false
POSPage.getLayout = (page: React.ReactElement) => (
  <FullscreenPOSLayout>{page}</FullscreenPOSLayout>
)

export default POSPage
