import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { AppDispatch, RootState } from 'src/store'
import { fetchData as fetchProducts } from 'src/store/apps/products'
import { ProductType } from 'src/types/apps/productTypes'
import AddProductModal from './AddProductModal'

interface ProductSearchDialogProps {
  open: boolean
  onClose: () => void
  onSelectProduct: (
    product: ProductType & {
      selectedPrice?: number
      selectedPriceLabel?: string
    },
  ) => void
  title?: string
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const ProductSearchDialog = (props: ProductSearchDialogProps) => {
  const {
    open,
    onClose,
    onSelectProduct,
    title = 'Buscar Producto',
    maxWidth = 'lg',
  } = props

  const dispatch = useDispatch<AppDispatch>()
  const productStore = useSelector((state: RootState) => state.products)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // ** Responsive
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedPrices, setSelectedPrices] = useState<Record<string, number>>(
    {},
  ) // Track selected price for each product
  const [showAddProductModal, setShowAddProductModal] = useState(false)

  // Simple debounce hook
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      return () => {
        clearTimeout(handler)
      }
    }, [value, delay])

    return debouncedValue
  }

  const debouncedSearchValue = useDebounce(searchValue, 500)

  // Special functionality: detect #{code} pattern for direct product code search
  const handleSpecialSearch = async (input: string) => {
    const hashPattern = /^([A-Za-z0-9-]+)#$/
    const match = input.match(hashPattern)

    if (match) {
      const productCode = match[1]
      setLoading(true)
      try {
        // Dispatch the API call and wait for the response
        const result = await dispatch(
          fetchProducts({
            codigoProducto: productCode,
            query: '',
            status: '',
            pageNumber: 0,
          }),
        ).unwrap()

        return result.totalResults > 0
      } catch (error) {
        console.error('Error fetching product by code:', error)
        return false
      } finally {
        setLoading(false)
      }
    }
    return false
  }

  // Search products based on input
  const searchProducts = useCallback(
    async (searchTerm: string, pageNum: number = 0) => {
      if (!searchTerm.trim() && !open) return

      setLoading(true)
      try {
        // Check for special #{code} pattern first
        const isSpecialSearch = await handleSpecialSearch(searchTerm)

        if (!isSpecialSearch) {
          // Regular search
          await dispatch(
            fetchProducts({
              query: searchTerm,
              status: '',
              pageNumber: pageNum,
            }),
          ).unwrap()
        }
      } catch (error) {
        console.error('Error searching products:', error)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, open],
  )

  // Effect to search when dialog opens or search term changes
  useEffect(() => {
    if (open) {
      if (debouncedSearchValue || productStore.data.length === 0) {
        searchProducts(debouncedSearchValue, page)
      }
    }
  }, [open, debouncedSearchValue, page, searchProducts])

  useEffect(() => {
    setSearchValue('')
    setPage(0)
    setSelectedPrices({})

    if (open && searchInputRef.current) {
      // Focus the search input after a small delay to ensure dialog is fully rendered
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [open])

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
    setPage(0) // Reset to first page when searching
  }

  // Handle product selection
  const handleSelectProduct = (product: ProductType) => {
    onSelectProduct(product)
    onClose()
  }

  // Handle dialog close
  const handleClose = () => {
    setSearchValue('')
    setPage(0)
    setSelectedPrices({}) // Reset selected prices
    setShowAddProductModal(false) // Close the add product modal
    onClose()
  }

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
    }).format(amount)
  }

  // Get status chip color
  const getStatusColor = (status: string) => {
    return status === 'A' ? 'success' : 'error'
  }

  // Get status label
  const getStatusLabel = (status: string) => {
    return status === 'A' ? 'Activo' : 'Inactivo'
  }

  // Get available prices for a product
  const getAvailablePrices = (product: ProductType) => {
    const prices = []
    if (product.precio1 > 0)
      prices.push({ label: 'Precio 1', value: product.precio1, key: 'precio1' })
    if (product.precio2 > 0)
      prices.push({ label: 'Precio 2', value: product.precio2, key: 'precio2' })
    if (product.precio3 > 0)
      prices.push({ label: 'Precio 3', value: product.precio3, key: 'precio3' })
    if (product.precio4 > 0)
      prices.push({ label: 'Precio 4', value: product.precio4, key: 'precio4' })
    if (product.precio5 > 0)
      prices.push({ label: 'Precio 5', value: product.precio5, key: 'precio5' })
    return prices
  }

  // Get selected price for a product
  const getSelectedPrice = (product: ProductType) => {
    return selectedPrices[product.codigo] || product.precio1 || 0
  }

  // Handle product creation and selection
  const handleProductCreated = (newProduct: ProductType) => {
    setShowAddProductModal(false)
    // Refresh the product list to include the new product
    searchProducts(searchValue, 0)
    // Auto-select the newly created product
    setTimeout(() => {
      handleSelectProduct(newProduct)
    }, 100)
  }

  // Handle price selection change
  const handlePriceChange = (productCode: string, price: number) => {
    setSelectedPrices((prev) => ({
      ...prev,
      [productCode]: price,
    }))
  }

  // Calculate displayed products based on pagination
  const displayedProducts = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return productStore.data.slice(startIndex, endIndex)
  }, [productStore.data, page, rowsPerPage])

  // Mobile card component
  const ProductCard = ({ product }: { product: ProductType }) => {
    const availablePrices = getAvailablePrices(product)
    const selectedPrice = getSelectedPrice(product)

    const handleProductSelect = () => {
      const productWithSelectedPrice = {
        ...product,
        selectedPrice: selectedPrice,
        selectedPriceLabel:
          availablePrices.find((p) => p.value === selectedPrice)?.label ||
          'Precio 1',
      }
      handleSelectProduct(productWithSelectedPrice)
    }

    return (
      <Card
        sx={{
          mb: 2,
          '&:hover': { boxShadow: 4 },
          cursor: 'pointer',
        }}
        onClick={handleProductSelect}
      >
        <CardContent sx={{ pb: 1 }}>
          {/* Header with name and status */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={1}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ fontSize: '1rem', fontWeight: 600, flex: 1, pr: 1 }}
            >
              {product.nombre}
            </Typography>
            <Chip
              label={getStatusLabel(product.status)}
              color={getStatusColor(product.status)}
              size="small"
            />
          </Box>

          {/* Description */}
          {product.descripcion && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.875rem',
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.descripcion.replace(/<[^>]*>/g, '')}
            </Typography>
          )}

          {/* Product code */}
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              <Icon
                icon="mdi:barcode"
                fontSize="0.875rem"
                style={{ marginRight: 4, verticalAlign: 'middle' }}
              />
              Código: {product.codigo}
            </Typography>
          </Box>

          {/* Inventory */}
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              <Icon
                icon="mdi:package-variant"
                fontSize="0.875rem"
                style={{ marginRight: 4, verticalAlign: 'middle' }}
              />
              Stock: {product.existenciaAlmacen1.toLocaleString()}{' '}
              {product.unidad}
            </Typography>
          </Box>

          {/* Price selection */}
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem', mb: 0.5 }}
            >
              <Icon
                icon="mdi:currency-usd"
                fontSize="0.875rem"
                style={{ marginRight: 4, verticalAlign: 'middle' }}
              />
              Precio:
            </Typography>
            {availablePrices.length > 1 ? (
              <FormControl size="small" fullWidth>
                <Select
                  value={selectedPrice}
                  onChange={(e) => {
                    e.stopPropagation()
                    handlePriceChange(product.codigo, Number(e.target.value))
                  }}
                  onClick={(e) => e.stopPropagation()}
                  sx={{ '& .MuiSelect-select': { py: 1 } }}
                >
                  {availablePrices.map((price) => (
                    <MenuItem key={price.key} value={price.value}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {price.label} - {formatCurrency(price.value)}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : availablePrices.length === 1 ? (
              <Typography
                variant="body1"
                fontWeight="medium"
                color="primary.main"
              >
                {formatCurrency(availablePrices[0].value)}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Sin precio
              </Typography>
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            fullWidth
            startIcon={<Icon icon="mdi:check" />}
            onClick={(e) => {
              e.stopPropagation()
              handleProductSelect()
            }}
          >
            Seleccionar
          </Button>
        </CardActions>
      </Card>
    )
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={isMobile ? false : maxWidth}
        fullWidth={!isMobile}
        fullScreen={isSmallMobile}
        PaperProps={{
          sx: {
            height: isMobile ? '100vh' : '80vh',
            maxHeight: isMobile ? '100vh' : '800px',
            width: isMobile ? '100%' : 'auto',
            margin: isMobile ? 0 : 'auto',
          },
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            paddingTop={isMobile ? 1 : 0}
          >
            {title}
            <IconButton onClick={handleClose} size="small">
              <Icon icon="mdi:close" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: isMobile ? 2 : 3 }}>
          <Box mb={3}>
            <TextField
              fullWidth
              inputRef={searchInputRef}
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Buscar por código, nombre o descripción. Use código# para búsqueda directa"
              size={isMobile ? 'medium' : 'small'}
              autoFocus={!isMobile}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="mdi:magnify" />
                  </InputAdornment>
                ),
                endAdornment: loading ? (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ) : null,
                sx: {
                  '& .MuiInputBase-input': {
                    fontSize: isMobile ? '1rem' : '0.875rem',
                    padding: isMobile ? '12px 8px' : undefined,
                  },
                },
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: isMobile ? '1rem' : '0.875rem',
                },
              }}
            />
          </Box>

          {/* Desktop Table View */}
          {!isMobile ? (
            <>
              <TableContainer component={Paper} sx={{ maxHeight: '400px' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>Inventario</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell align="center">Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading && productStore.data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            py={3}
                          >
                            <CircularProgress />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : displayedProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Box py={3}>
                            {searchValue
                              ? 'No se encontraron productos'
                              : 'Ingrese un término de búsqueda'}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedProducts.map((product) => {
                        const availablePrices = getAvailablePrices(product)
                        const selectedPrice = getSelectedPrice(product)

                        return (
                          <TableRow
                            key={product.codigo}
                            hover
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                              // Create a modified product with the selected price
                              const productWithSelectedPrice = {
                                ...product,
                                selectedPrice: selectedPrice,
                                selectedPriceLabel:
                                  availablePrices.find(
                                    (p) => p.value === selectedPrice,
                                  )?.label || 'Precio 1',
                              }
                              handleSelectProduct(productWithSelectedPrice)
                            }}
                          >
                            <TableCell>{product.codigo}</TableCell>
                            <TableCell>
                              <Box>
                                <Box fontWeight="medium">{product.nombre}</Box>
                                {product.descripcion && (
                                  <Box
                                    fontSize="0.875rem"
                                    color="text.secondary"
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      maxWidth: '300px',
                                    }}
                                  >
                                    {product.descripcion.replace(
                                      /<[^>]*>/g,
                                      '',
                                    )}
                                  </Box>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                {availablePrices.length > 1 ? (
                                  <FormControl
                                    size="small"
                                    sx={{ minWidth: 120 }}
                                  >
                                    <Select
                                      value={selectedPrice}
                                      onChange={(e) => {
                                        e.stopPropagation()
                                        handlePriceChange(
                                          product.codigo,
                                          Number(e.target.value),
                                        )
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {availablePrices.map((price) => (
                                        <MenuItem
                                          key={price.key}
                                          value={price.value}
                                        >
                                          <Box>
                                            <Typography
                                              variant="body2"
                                              fontWeight="medium"
                                            >
                                              {price.label}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                            >
                                              {formatCurrency(price.value)}
                                            </Typography>
                                          </Box>
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                ) : availablePrices.length === 1 ? (
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      {formatCurrency(availablePrices[0].value)}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {availablePrices[0].label}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Sin precio
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {product.existenciaAlmacen1.toLocaleString()}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {product.unidad}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getStatusLabel(product.status)}
                                color={getStatusColor(product.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="contained"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Create a modified product with the selected price
                                  const productWithSelectedPrice = {
                                    ...product,
                                    selectedPrice: selectedPrice,
                                    selectedPriceLabel:
                                      availablePrices.find(
                                        (p) => p.value === selectedPrice,
                                      )?.label || 'Precio 1',
                                  }
                                  handleSelectProduct(productWithSelectedPrice)
                                }}
                              >
                                Seleccionar
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {productStore.data.length > 0 && (
                <TablePagination
                  component="div"
                  count={productStore.data.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="Filas por página:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                  }
                />
              )}
            </>
          ) : (
            /* Mobile Card View */
            <>
              <Box
                sx={{
                  maxHeight: isSmallMobile ? '60vh' : '400px',
                  overflow: 'auto',
                  px: 1,
                }}
              >
                {loading && productStore.data.length === 0 ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="300px"
                  >
                    <CircularProgress size={40} />
                  </Box>
                ) : displayedProducts.length === 0 ? (
                  <Card sx={{ textAlign: 'center', py: 4 }}>
                    <CardContent>
                      <Icon
                        icon="mdi:package-variant"
                        fontSize="3rem"
                        style={{ color: '#ccc', marginBottom: 16 }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        {searchValue
                          ? 'No se encontraron productos'
                          : 'Ingrese un término de búsqueda'}
                      </Typography>
                    </CardContent>
                  </Card>
                ) : (
                  displayedProducts.map((product) => (
                    <ProductCard key={product.codigo} product={product} />
                  ))
                )}
              </Box>

              {/* Mobile Pagination */}
              {productStore.data.length > rowsPerPage && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mt={2}
                  px={isMobile ? 1 : 0}
                >
                  <Pagination
                    count={Math.ceil(productStore.data.length / rowsPerPage)}
                    page={page + 1}
                    onChange={(event, newPage) => setPage(newPage - 1)}
                    color="primary"
                    size={isMobile ? 'medium' : 'small'}
                    showFirstButton={!isSmallMobile}
                    showLastButton={!isSmallMobile}
                    siblingCount={isMobile ? 1 : 2}
                    boundaryCount={isSmallMobile ? 1 : 2}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        minWidth: isMobile ? 40 : 32,
                        height: isMobile ? 40 : 32,
                        fontSize: isMobile ? '1rem' : '0.875rem',
                        margin: isMobile ? '0 2px' : '0 1px',
                      },
                    }}
                  />
                </Box>
              )}

              {/* Mobile Results Info */}
              <Box
                display="flex"
                flexDirection={isSmallMobile ? 'column' : 'row'}
                justifyContent="space-between"
                alignItems={isSmallMobile ? 'center' : 'center'}
                mt={2}
                px={1}
                gap={isSmallMobile ? 1 : 0}
              >
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ fontSize: isMobile ? '0.875rem' : '0.75rem' }}
                >
                  Mostrando {displayedProducts.length} de{' '}
                  {productStore.data.length} productos
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ fontSize: isMobile ? '0.875rem' : '0.75rem' }}
                >
                  Página {page + 1} de{' '}
                  {Math.ceil(productStore.data.length / rowsPerPage)}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: isMobile ? 3 : 2,
            flexDirection: isSmallMobile ? 'column' : 'row',
            gap: isSmallMobile ? 1 : 0,
          }}
        >
          <Button
            onClick={() => setShowAddProductModal(true)}
            color="primary"
            variant="outlined"
            size="small"
            fullWidth={isSmallMobile}
            startIcon={<Icon icon="mdi:plus" />}
            sx={{
              order: 1,
            }}
          >
            {isMobile ? 'Crear Producto' : 'Nuevo Producto'}
          </Button>

          <Box sx={{ flex: 1 }} />

          <Button
            onClick={handleClose}
            color="secondary"
            size={isMobile ? 'large' : 'medium'}
            fullWidth={isSmallMobile}
            sx={{
              minHeight: isMobile ? 48 : 'auto',
              fontSize: isMobile ? '1rem' : '0.875rem',
              order: isSmallMobile ? 2 : 2,
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Product Modal */}
      <AddProductModal
        open={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onProductCreated={handleProductCreated}
      />
    </>
  )
}

export default ProductSearchDialog
