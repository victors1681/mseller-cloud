import React, { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Pagination,
  IconButton,
  Chip,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { RootState, AppDispatch } from 'src/store'
import { fetchData } from 'src/store/apps/clients'
import { CustomerType } from 'src/types/apps/customerType'

interface CustomerSearchDialogProps {
  open: boolean
  onClose: () => void
  onSelectCustomer: (customer: CustomerType) => void
  title?: string
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const CustomerSearchDialog: React.FC<CustomerSearchDialogProps> = ({
  open,
  onClose,
  onSelectCustomer,
  title = 'Buscar Cliente',
  maxWidth = 'md',
}) => {
  // ** State
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [localLoading, setLocalLoading] = useState(false)

  // ** Redux
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.clients)

  // ** Debounced search function
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return (query: string, page: number) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setLocalLoading(true)
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
  }, [dispatch])

  // ** Effects

  useEffect(() => {
    setSearchTerm('')
    setCurrentPage(0)
    if (open && (searchTerm || store.data.length === 0)) {
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

  const isLoading = store.isLoading || localLoading

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: { minHeight: '40vh', maxHeight: '90vh' },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={handleClose} size="small">
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            label="Buscar por código o nombre"
            placeholder="Ingrese código o nombre del cliente..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1 }}>
                  <Icon icon="mdi:magnify" fontSize="1.25rem" />
                </Box>
              ),
            }}
            sx={{ mb: 2 }}
          />
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
            <TableContainer component={Paper} sx={{ maxHeight: '400px' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ciudad</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
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

            {/* Pagination */}
            {store.totalPages > 1 && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={2}
              >
                <Pagination
                  count={store.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}

            {/* Results info */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
              px={1}
            >
              <Typography variant="caption" color="textSecondary">
                Mostrando {store.data?.length || 0} de {store.totalResults || 0}{' '}
                resultados
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Página {currentPage} de {store.totalPages || 1}
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CustomerSearchDialog
