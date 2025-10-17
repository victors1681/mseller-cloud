// ** React Imports
import { forwardRef, useCallback, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import { debounce } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Hidden from '@mui/material/Hidden'
import IconButton from '@mui/material/IconButton'
import { SelectChangeEvent } from '@mui/material/Select'
import { styled, useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, loadMoreData } from 'src/store/apps/products'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import TableHeader from 'src/views/apps/products/list/TableHeader'

// ** Styled Components
import OptionsMenu from 'src/@core/components/option-menu'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { ProductType } from 'src/types/apps/productTypes'
import ProductCard from 'src/views/apps/products/components/ProductCard'
import PriceDisplay from 'src/views/apps/products/list/PriceDisplay'
import ProductDetailModal from 'src/views/apps/products/list/ProductDetailModal'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: ProductType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: 'Código',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.codigo}</Typography>
    ),
  },
  {
    flex: 0.35,
    field: 'name',
    minWidth: 300,
    headerName: 'Nombre',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {row.nombre}
            </Typography>
            <Typography noWrap variant="caption">
              {row.area} - {row.iDArea}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'unit',
    headerName: 'Un',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.unidad}</Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'pack',
    headerName: 'Empaque',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.empaque}</Typography>
    ),
  },
  {
    flex: 0.2,
    field: 'price',
    minWidth: 200,
    headerName: 'Precios',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <PriceDisplay
              defaultPrice={row.precio1}
              prices={[row.precio2, row.precio3, row.precio4, row.precio5]}
            />
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'stock',
    headerName: 'Impuesto',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.impuesto}%</Typography>
    ),
  },

  {
    flex: 0.05,
    field: 'active',
    headerName: '',
    renderCell: ({ row }: CellType) =>
      row.status == 'A' ? (
        <Icon icon="lets-icons:check-fill" color="#56ca00" fontSize={20} />
      ) : (
        <Icon icon="bxs:x-circle" color="#ff4b51" fontSize={20} />
      ),
  },
]

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate =
    props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate =
    props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates
    ? props.setDates([])
    : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return (
    <TextField
      fullWidth
      inputRef={ref}
      {...updatedProps}
      label={props.label || ''}
      value={value}
    />
  )
})
/* eslint-enable */

const InvoiceList = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  )
  const [currentPage, setCurrentPage] = useState(0)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.products)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  //Initial Load
  useEffect(() => {
    dispatch(
      fetchData({
        query: value,
        status: statusValue,
        pageNumber: paginationModel.page,
      }),
    )
  }, [statusValue])

  const handlePagination = useCallback(
    (values: any) => {
      setPaginationModel(values)
      dispatch(
        fetchData({
          query: value,
          status: statusValue,
          pageNumber: values.page,
        }),
      )
    },
    [paginationModel, value, statusValue],
  )

  const performRequest = useCallback(
    (value: string) => {
      dispatch(
        fetchData({
          query: value,
          status: statusValue,
          pageNumber: paginationModel.page,
        }),
      )
    },
    [dispatch, statusValue, value, dates, paginationModel],
  )

  const fn = useCallback(
    debounce((val: string) => {
      setPaginationModel({ page: 1, pageSize: 20 })
      performRequest(val)
    }, 900),
    [],
  )

  const handleFilter = useCallback(
    (val: string) => {
      fn.clear()
      setValue(val)
      fn(val)
    },
    [fn],
  )

  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
  }

  const handleViewProduct = (product: ProductType) => {
    setSelectedProduct(product)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedProduct(null)
  }

  // Load More Handler for Mobile
  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    dispatch(
      loadMoreData({
        query: value,
        status: statusValue,
        pageNumber: nextPage,
        pageSize: 20,
      }),
    )
  }, [dispatch, value, statusValue, currentPage])

  // Reset page when search changes
  const resetAndSearch = useCallback(
    (searchValue: string) => {
      setCurrentPage(0)
      setPaginationModel({ page: 0, pageSize: 20 })
      dispatch(
        fetchData({
          query: searchValue,
          status: statusValue,
          pageNumber: 0,
        }),
      )
    },
    [dispatch, statusValue],
  )

  // Update filter handler to reset page
  const handleFilterMobile = useCallback(
    (val: string) => {
      fn.clear()
      setValue(val)
      if (isMobile) {
        resetAndSearch(val)
      } else {
        fn(val)
      }
    },
    [fn, isMobile, resetAndSearch],
  )

  // Check if there are more items to load
  const hasMore = store.totalResults > store.data.length

  // Create responsive columns based on screen size
  const getColumns = (): GridColDef[] => {
    const baseColumns: GridColDef[] = []

    // Always show: ID, Name, Price, Actions
    baseColumns.push({
      flex: isSmallScreen ? 0.15 : 0.1,
      field: 'id',
      minWidth: isSmallScreen ? 60 : 80,
      headerName: 'Código',
      renderCell: ({ row }: CellType) => (
        <Typography
          variant="body2"
          sx={{
            fontSize: isSmallScreen ? '0.75rem' : 'inherit',
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          onClick={() => handleViewProduct(row)}
        >
          {row.codigo}
        </Typography>
      ),
    })

    baseColumns.push({
      flex: isSmallScreen ? 0.45 : 0.35,
      field: 'name',
      minWidth: isSmallScreen ? 200 : 300,
      headerName: 'Producto',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                noWrap
                variant="body2"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  fontSize: isSmallScreen ? '0.75rem' : 'inherit',
                }}
              >
                {row.nombre}
              </Typography>
              <Typography
                noWrap
                variant="caption"
                sx={{ fontSize: isSmallScreen ? '0.6rem' : 'inherit' }}
              >
                {row.area} - {row.iDArea} | {row.unidad} | Imp: {row.impuesto}%
              </Typography>
              {isSmallScreen && (
                <Typography
                  variant="caption"
                  sx={{ fontSize: '0.6rem', color: 'text.secondary' }}
                >
                  Empaque: {row.empaque} | Factor: {row.factor}
                </Typography>
              )}
            </Box>
          </Box>
        )
      },
    })

    // Show unit, pack, tax, and factor only on larger screens
    if (!isMobile) {
      baseColumns.push({
        flex: 0.15,
        minWidth: 130,
        field: 'unit',
        headerName: 'Un',
        renderCell: ({ row }: CellType) => (
          <Typography variant="body2">{row.unidad}</Typography>
        ),
      })

      baseColumns.push({
        flex: 0.15,
        minWidth: 130,
        field: 'pack',
        headerName: 'Empaque',
        renderCell: ({ row }: CellType) => (
          <Typography variant="body2">{row.empaque}</Typography>
        ),
      })
    }

    // Always show price
    baseColumns.push({
      flex: isSmallScreen ? 0.25 : 0.2,
      field: 'price',
      minWidth: isSmallScreen ? 120 : 200,
      headerName: 'Precios',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <PriceDisplay
                defaultPrice={row.precio1}
                prices={[row.precio2, row.precio3, row.precio4, row.precio5]}
              />
            </Box>
          </Box>
        )
      },
    })

    // Show tax and factor only on larger screens
    if (!isMobile) {
      baseColumns.push({
        flex: 0.1,
        minWidth: 90,
        field: 'stock',
        headerName: 'Impuesto',
        renderCell: ({ row }: CellType) => (
          <Typography variant="body2">{row.impuesto}%</Typography>
        ),
      })

      baseColumns.push({
        flex: 0.1,
        minWidth: 80,
        field: 'fact',
        headerName: 'Factor',
        renderCell: ({ row }: CellType) => (
          <Typography variant="body2">{row.factor}</Typography>
        ),
      })
    }

    // Always show status and actions
    baseColumns.push({
      flex: 0.05,
      field: 'active',
      headerName: '',
      renderCell: ({ row }: CellType) =>
        row.status == 'A' ? (
          <Icon
            icon="lets-icons:check-fill"
            color="#56ca00"
            fontSize={isSmallScreen ? 16 : 20}
          />
        ) : (
          <Icon
            icon="bxs:x-circle"
            color="#ff4b51"
            fontSize={isSmallScreen ? 16 : 20}
          />
        ),
    })

    baseColumns.push({
      flex: isSmallScreen ? 0.15 : 0.1,
      minWidth: isSmallScreen ? 80 : 130,
      sortable: false,
      field: 'actions',
      headerName: 'Acciones',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Ver Detalle">
            <IconButton
              size="small"
              onClick={() => handleViewProduct(row)}
              sx={{
                minWidth: { xs: 32, sm: 'auto' },
                minHeight: { xs: 32, sm: 'auto' },
              }}
            >
              <Icon icon="mdi:eye-outline" fontSize={isSmallScreen ? 16 : 20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              component={Link}
              href={`/apps/products/add/${row.codigo}`}
              sx={{
                minWidth: { xs: 32, sm: 'auto' },
                minHeight: { xs: 32, sm: 'auto' },
              }}
            >
              <Icon icon="tabler:edit" fontSize={isSmallScreen ? 16 : 20} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    })

    return baseColumns
  }

  const columns = getColumns()

  return (
    <DatePickerWrapper>
      <Grid container spacing={isMobile ? 3 : 6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Productos"
              sx={{
                padding: isSmallScreen ? '16px' : '24px',
                '& .MuiCardHeader-title': {
                  fontSize: isSmallScreen ? '1.25rem' : '1.5rem',
                },
              }}
              action={
                <OptionsMenu
                  options={[
                    {
                      text: 'Importar',
                      icon: (
                        <Icon
                          icon="tabler:file-import"
                          fontSize={isSmallScreen ? 18 : 20}
                        />
                      ),
                    },
                    {
                      text: 'Exportar',
                      icon: (
                        <Icon
                          icon="clarity:export-line"
                          fontSize={isSmallScreen ? 18 : 20}
                        />
                      ),
                    },
                  ]}
                  iconButtonProps={{
                    size: isSmallScreen ? 'small' : 'medium',
                    sx: {
                      color: 'text.primary',
                      padding: isSmallScreen ? '4px' : '8px',
                    },
                  }}
                />
              }
            />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              value={value}
              selectedRows={selectedRows}
              handleFilter={isMobile ? handleFilterMobile : handleFilter}
              placeholder="Nombre o código"
            />

            {/* Desktop DataGrid */}
            <Hidden mdDown>
              <DataGrid
                autoHeight
                pagination
                rows={store.data}
                columns={columns}
                disableRowSelectionOnClick
                paginationModel={paginationModel}
                onPaginationModelChange={handlePagination}
                onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
                getRowId={(row) => row.codigo}
                paginationMode="server"
                loading={store.isLoading}
                rowCount={store.totalResults}
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    fontSize: isSmallScreen ? '0.75rem' : 'inherit',
                  },
                  '& .MuiDataGrid-cell': {
                    fontSize: isSmallScreen ? '0.75rem' : 'inherit',
                    padding: isSmallScreen ? '4px 8px' : '8px 16px',
                  },
                  '& .MuiDataGrid-row': {
                    minHeight: isSmallScreen ? '40px !important' : 'auto',
                  },
                  '& .MuiDataGrid-columnHeader': {
                    padding: isSmallScreen ? '4px 8px' : '8px 16px',
                  },
                }}
              />
            </Hidden>

            {/* Mobile Cards */}
            <Hidden mdUp>
              <Box sx={{ p: 2 }}>
                {store.isLoading && store.data.length === 0 ? (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', py: 4 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <Grid container spacing={2}>
                      {store.data.map((product) => (
                        <Grid item xs={12} sm={6} key={product.codigo}>
                          <ProductCard
                            product={product}
                            onViewDetails={handleViewProduct}
                          />
                        </Grid>
                      ))}
                    </Grid>

                    {/* Load More Button */}
                    {hasMore && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={handleLoadMore}
                          disabled={store.isLoadingMore}
                          sx={{
                            minWidth: 200,
                            minHeight: 48,
                            borderRadius: 3,
                          }}
                        >
                          {store.isLoadingMore ? (
                            <>
                              <CircularProgress size={20} sx={{ mr: 1 }} />
                              Cargando...
                            </>
                          ) : (
                            <>
                              <Icon icon="mdi:chevron-down" fontSize="1.5rem" />
                              Cargar Más
                            </>
                          )}
                        </Button>
                      </Box>
                    )}

                    {/* No more items message */}
                    {!hasMore && store.data.length > 0 && (
                      <Box sx={{ textAlign: 'center', mt: 3, py: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          No hay más productos para mostrar
                        </Typography>
                      </Box>
                    )}

                    {/* No results message */}
                    {store.data.length === 0 && !store.isLoading && (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                          No se encontraron productos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Intenta modificar los filtros de búsqueda
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Hidden>
          </Card>
        </Grid>
      </Grid>

      {/* Product Detail Modal */}
      <ProductDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </DatePickerWrapper>
  )
}

export default InvoiceList
