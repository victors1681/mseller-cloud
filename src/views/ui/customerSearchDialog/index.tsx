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
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { AppDispatch, RootState } from 'src/store'
import { fetchData } from 'src/store/apps/clients'
import { CustomerType } from 'src/types/apps/customerType'
import AddClientModal from './AddClientModal'

interface CustomerSearchDialogProps {
  open: boolean
  onClose: () => void
  onSelectCustomer: (customer: CustomerType) => void
  title?: string
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showAddNewButton?: boolean
}

const CustomerSearchDialog: React.FC<CustomerSearchDialogProps> = ({
  open,
  onClose,
  onSelectCustomer,
  title = 'Buscar Cliente',
  maxWidth = 'md',
  showAddNewButton = true,
}) => {
  // ** State
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [localLoading, setLocalLoading] = useState(false)
  const [addClientModalOpen, setAddClientModalOpen] = useState(false)

  // ** Refs
  const searchInputRef = useRef<HTMLInputElement>(null)

  // ** Responsive
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ** Redux
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.clients)

  // ** Debounced search function
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout

    const searchFunction = (query: string, page: number) => {
      clearTimeout(timeoutId)
      setLocalLoading(true)

      timeoutId = setTimeout(() => {
        dispatch(
          fetchData({
            query,
            pageNumber: page,
            dates: [],
            procesado: '',
            vendedor: '',
          }),
        ).finally(() => {
          setLocalLoading(false)
        })
      }, 300)
    }

    // Return a function that includes cleanup
    return searchFunction
  }, [dispatch])

  // ** Effects

  useEffect(() => {
    if (open) {
      setSearchTerm('')
      setCurrentPage(0)
      // Initial load when dialog opens
      debouncedSearch('', 0)

      // Auto focus on desktop browsers (Chrome, Firefox, etc.)
      if (!isMobile) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus()
        }, 150)

        return () => clearTimeout(timer)
      }
    }
  }, [open, debouncedSearch, isMobile])

  // Separate effect for search term changes
  useEffect(() => {
    if (open) {
      debouncedSearch(searchTerm, currentPage)
    }
  }, [searchTerm, currentPage, debouncedSearch, open])

  // ** Handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    setCurrentPage(0) // Reset to first page when searching
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page)
  }

  const handleSelectCustomer = (customer: CustomerType) => {
    onSelectCustomer(customer)
    onClose()
  }

  const handleClose = () => {
    setSearchTerm('')
    setCurrentPage(0)
    onClose()
  }

  const handleAddNewClient = () => {
    setAddClientModalOpen(true)
  }

  const handleCloseAddClientModal = () => {
    setAddClientModalOpen(false)
  }

  const handleClientCreated = (newClient: CustomerType) => {
    setAddClientModalOpen(false)
    // Refresh the search to include the new client
    debouncedSearch(searchTerm, 0)
    // Optionally auto-select the new client
    onSelectCustomer(newClient)
    onClose()
  }

  const isLoading = store.isLoading || localLoading

  // Mobile card component
  const CustomerCard = ({ customer }: { customer: CustomerType }) => (
    <Card
      sx={{
        mb: 2,
        '&:hover': { boxShadow: 4 },
        cursor: 'pointer',
      }}
      onClick={() => handleSelectCustomer(customer)}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: '1rem', fontWeight: 600 }}
          >
            {customer.nombre}
          </Typography>
          <Chip
            label={customer.status || 'N/A'}
            color={customer.status === 'ACTIVO' ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.875rem' }}
          >
            <Icon
              icon="mdi:identifier"
              fontSize="0.875rem"
              style={{ marginRight: 4, verticalAlign: 'middle' }}
            />
            Código: {customer.codigo}
          </Typography>
        </Box>

        {customer.telefono1 && (
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              <Icon
                icon="mdi:phone"
                fontSize="0.875rem"
                style={{ marginRight: 4, verticalAlign: 'middle' }}
              />
              {customer.telefono1}
            </Typography>
          </Box>
        )}

        {customer.ciudad && (
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              <Icon
                icon="mdi:map-marker"
                fontSize="0.875rem"
                style={{ marginRight: 4, verticalAlign: 'middle' }}
              />
              {customer.ciudad}
            </Typography>
          </Box>
        )}
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
            handleSelectCustomer(customer)
          }}
        >
          Seleccionar
        </Button>
      </CardActions>
    </Card>
  )

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
            minHeight: isMobile ? '100vh' : '40vh',
            maxHeight: isMobile ? '100vh' : '90vh',
            width: isMobile ? '100%' : 'auto',
            margin: isMobile ? 0 : 'auto',
          },
        }}
      >
        <DialogTitle
          sx={{
            p: { xs: 2, sm: 3 },
            pb: { xs: 1, sm: 2 },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                fontWeight: { xs: 600, sm: 500 },
              }}
            >
              {title}
            </Typography>
            <IconButton
              onClick={handleClose}
              size={isMobile ? 'medium' : 'small'}
              sx={{
                minHeight: { xs: 44, sm: 'auto' },
                minWidth: { xs: 44, sm: 'auto' },
              }}
            >
              <Icon icon="mdi:close" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: { xs: 2, sm: 3 },
            '& .MuiTextField-root': {
              '& .MuiInputLabel-root': {
                fontSize: { xs: '1rem', sm: '0.875rem' },
              },
            },
          }}
        >
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <TextField
              fullWidth
              size={isMobile ? 'medium' : 'small'}
              label="Buscar por código o nombre"
              placeholder="Ingrese código o nombre del cliente..."
              value={searchTerm}
              onChange={handleSearchChange}
              inputRef={searchInputRef}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1 }}>
                    <Icon icon="mdi:magnify" fontSize="1.25rem" />
                  </Box>
                ),
                sx: {
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '1rem', sm: '0.875rem' },
                    padding: { xs: '14px 8px', sm: '12px 8px' },
                  },
                },
              }}
            />

            {/* Add New Client Button */}
            {showAddNewButton && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: isMobile ? 'center' : 'flex-end',
                  mb: 2,
                  pt: 2,
                  width: '100%',
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAddNewClient}
                  startIcon={<Icon icon="mdi:plus" />}
                  size={isMobile ? 'medium' : 'small'}
                  fullWidth={isSmallMobile}
                  sx={{
                    minHeight: { xs: 44, sm: 'auto' },
                    fontSize: { xs: '0.875rem', sm: '0.75rem' },
                    fontWeight: 500,
                  }}
                >
                  <Box
                    component="span"
                    sx={{ display: { xs: 'none', sm: 'inline' } }}
                  >
                    Agregar Nuevo Cliente
                  </Box>
                  <Box
                    component="span"
                    sx={{ display: { xs: 'inline', sm: 'none' } }}
                  >
                    Nuevo Cliente
                  </Box>
                </Button>
              </Box>
            )}
          </Box>

          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="300px"
            >
              <CircularProgress size={40} />
            </Box>
          ) : (
            <>
              {/* Desktop Table View */}
              {!isMobile ? (
                <TableContainer component={Paper} sx={{ maxHeight: '400px' }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Código
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Nombre
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Teléfono
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Ciudad
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Estado
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                          Acciones
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {store.data?.length > 0 ? (
                        store.data.map((customer) => (
                          <TableRow
                            key={customer.codigo}
                            hover
                            sx={{
                              cursor: 'pointer',
                              '&:hover': { backgroundColor: 'action.hover' },
                            }}
                          >
                            <TableCell>
                              <Typography
                                variant="body2"
                                fontWeight="medium"
                                sx={{ fontSize: '0.875rem' }}
                              >
                                {customer.codigo}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ fontSize: '0.875rem' }}
                              >
                                {customer.nombre}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ fontSize: '0.875rem' }}
                              >
                                {customer.telefono1 || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ fontSize: '0.875rem' }}
                              >
                                {customer.ciudad || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={customer.status || 'N/A'}
                                color={
                                  customer.status === 'ACTIVO'
                                    ? 'success'
                                    : 'default'
                                }
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleSelectCustomer(customer)}
                                startIcon={<Icon icon="mdi:check" />}
                              >
                                Seleccionar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Typography variant="body2" color="textSecondary">
                              {searchTerm
                                ? 'No se encontraron clientes con los criterios de búsqueda'
                                : 'No hay clientes disponibles'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                /* Mobile Card View */
                <Box
                  sx={{
                    maxHeight: isSmallMobile ? '60vh' : '400px',
                    overflow: 'auto',
                    px: 1,
                  }}
                >
                  {store.data?.length > 0 ? (
                    store.data.map((customer) => (
                      <CustomerCard key={customer.codigo} customer={customer} />
                    ))
                  ) : (
                    <Card sx={{ textAlign: 'center', py: 4 }}>
                      <CardContent>
                        <Icon
                          icon="mdi:account-search"
                          fontSize="3rem"
                          style={{ color: '#ccc', marginBottom: 16 }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          {searchTerm
                            ? 'No se encontraron clientes con los criterios de búsqueda'
                            : 'No hay clientes disponibles'}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              )}

              {/* Pagination */}
              {store.totalPages > 1 && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mt={2}
                  px={isMobile ? 1 : 0}
                >
                  <Pagination
                    count={store.totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
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

              {/* Results info */}
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
                  Mostrando {store.data?.length || 0} de{' '}
                  {store.totalResults || 0} resultados
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ fontSize: isMobile ? '0.875rem' : '0.75rem' }}
                >
                  Página {currentPage} de {store.totalPages || 1}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: { xs: 3, sm: 2 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 },
            '& .MuiButton-root': {
              minHeight: { xs: 48, sm: 'auto' },
              fontSize: { xs: '1rem', sm: '0.875rem' },
            },
          }}
        >
          <Button
            onClick={handleClose}
            color="secondary"
            size={isMobile ? 'large' : 'medium'}
            fullWidth={isSmallMobile}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              fontWeight: { xs: 600, sm: 'normal' },
              textTransform: { xs: 'none', sm: 'uppercase' },
              borderRadius: { xs: 2, sm: 1 },
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Client Modal */}
      <AddClientModal
        open={addClientModalOpen}
        onClose={handleCloseAddClientModal}
        onClientCreated={handleClientCreated}
      />
    </>
  )
}

export default CustomerSearchDialog
