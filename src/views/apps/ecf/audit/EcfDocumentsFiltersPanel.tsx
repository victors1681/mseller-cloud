// ** React Imports
import { useCallback, useState } from 'react'

// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  debounce,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import {
  clearFilters,
  fetchEcfDocuments,
  updateFilters,
} from 'src/store/apps/ecf/ecfDocumentosSlice'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import {
  EcfDocumentoFilters,
  EcfDocumentType,
  EcfStatusEnum,
  JobStatus,
} from 'src/types/apps/ecfDocumentoTypes'

// ** Custom Component Imports
import LocationAutoComplete from 'src/views/ui/locationAutoComplete'

interface Props {
  onApplyFilters?: (filters: EcfDocumentoFilters) => void
}

const EcfDocumentsFiltersPanel = ({ onApplyFilters }: Props) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.ecfDocumentos)

  // ** State
  const [localFilters, setLocalFilters] = useState<EcfDocumentoFilters>(
    store.params,
  )
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // ** Handlers
  const handleFilterChange = (field: keyof EcfDocumentoFilters, value: any) => {
    const newFilters = { ...localFilters, [field]: value }
    setLocalFilters(newFilters)

    // Auto-apply certain filters with debounce
    if (
      ['documentoId', 'codigoCliente', 'codigoVendedor', 'ncf'].includes(field)
    ) {
      debouncedApplyFilters(newFilters)
    }
  }

  const debouncedApplyFilters = useCallback(
    debounce((filters: EcfDocumentoFilters) => {
      dispatch(updateFilters(filters))
      dispatch(fetchEcfDocuments({ ...filters, pageNumber: 1 }))
      onApplyFilters?.(filters)
    }, 500),
    [dispatch, onApplyFilters],
  )

  const handleApplyFilters = () => {
    dispatch(updateFilters(localFilters))
    dispatch(fetchEcfDocuments({ ...localFilters, pageNumber: 1 }))
    onApplyFilters?.(localFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters: EcfDocumentoFilters = {
      pageNumber: 1,
      pageSize: store.pageSize,
    }
    setLocalFilters(clearedFilters)
    dispatch(clearFilters())
    dispatch(fetchEcfDocuments(clearedFilters))
    onApplyFilters?.(clearedFilters)
  }

  const getActiveFiltersCount = () => {
    const { pageNumber, pageSize, ...otherFilters } = localFilters
    return Object.values(otherFilters).filter(
      (value) => value !== undefined && value !== null && value !== '',
    ).length
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">Filtros de Búsqueda</Typography>
            {getActiveFiltersCount() > 0 && (
              <Chip
                size="small"
                label={`${getActiveFiltersCount()} filtros activos`}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        }
        action={
          <IconButton
            size="small"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Icon
              icon={showAdvancedFilters ? 'mdi:chevron-up' : 'mdi:chevron-down'}
            />
          </IconButton>
        }
      />
      <CardContent>
        {/* Basic Filters */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="ID Documento"
              placeholder="Buscar por ID..."
              value={localFilters.documentoId || ''}
              onChange={(e) =>
                handleFilterChange('documentoId', e.target.value)
              }
              InputProps={{
                startAdornment: (
                  <Icon
                    icon="mdi:magnify"
                    style={{ marginRight: 8, color: '#666' }}
                  />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Código Cliente"
              placeholder="Código de cliente..."
              value={localFilters.codigoCliente || ''}
              onChange={(e) =>
                handleFilterChange('codigoCliente', e.target.value)
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="NCF"
              placeholder="Buscar por NCF..."
              value={localFilters.ncf || ''}
              onChange={(e) => handleFilterChange('ncf', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Estado ECF</InputLabel>
              <Select
                value={localFilters.statusEcf || ''}
                label="Estado ECF"
                onChange={(e) =>
                  handleFilterChange('statusEcf', e.target.value)
                }
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value={EcfStatusEnum.ECF_MSELLER}>
                  ecf mSeller
                </MenuItem>
                <MenuItem value={EcfStatusEnum.ACCEPTED}>Aceptado</MenuItem>
                <MenuItem value={EcfStatusEnum.REJECTED}>Rechazado</MenuItem>
                <MenuItem value={EcfStatusEnum.IN_PROCESS}>En Proceso</MenuItem>
                <MenuItem value={EcfStatusEnum.PENDING}>Pendiente</MenuItem>
                <MenuItem value={EcfStatusEnum.ERROR}>Error</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        <Collapse in={showAdvancedFilters}>
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Filtros Avanzados
              </Typography>
            </Divider>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Código Vendedor"
                  placeholder="Código de vendedor..."
                  value={localFilters.codigoVendedor || ''}
                  onChange={(e) =>
                    handleFilterChange('codigoVendedor', e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <LocationAutoComplete
                  selectedLocation={localFilters.localidadId?.toString()}
                  callBack={(value: string) =>
                    handleFilterChange(
                      'localidadId',
                      value ? Number(value) : undefined,
                    )
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Tipo Documento ECF</InputLabel>
                  <Select
                    value={localFilters.tipoDocumentoEcf || ''}
                    label="Tipo Documento ECF"
                    onChange={(e) =>
                      handleFilterChange('tipoDocumentoEcf', e.target.value)
                    }
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value={EcfDocumentType.Invoice}>Factura</MenuItem>
                    <MenuItem value={EcfDocumentType.CreditNote}>
                      Nota de Crédito
                    </MenuItem>
                    <MenuItem value={EcfDocumentType.DebitNote}>
                      Nota de Débito
                    </MenuItem>
                    <MenuItem value={EcfDocumentType.Cancellation}>
                      Anulación
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Estado del Job</InputLabel>
                  <Select
                    value={localFilters.jobStatus ?? ''}
                    label="Estado del Job"
                    onChange={(e) =>
                      handleFilterChange(
                        'jobStatus',
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value={JobStatus.Pending}>Pendiente</MenuItem>
                    <MenuItem value={JobStatus.Running}>En Ejecución</MenuItem>
                    <MenuItem value={JobStatus.Completed}>Completado</MenuItem>
                    <MenuItem value={JobStatus.Failed}>Fallido</MenuItem>
                    <MenuItem value={JobStatus.Cancelled}>Cancelado</MenuItem>
                    <MenuItem value={JobStatus.Retrying}>Reintentando</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Tipo eCF</InputLabel>
                  <Select
                    value={localFilters.tipoeCF || ''}
                    label="Tipo eCF"
                    onChange={(e) =>
                      handleFilterChange(
                        'tipoeCF',
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value={31}>
                      31 - Factura de Crédito Fiscal
                    </MenuItem>
                    <MenuItem value={32}>32 - Factura de Consumo</MenuItem>
                    <MenuItem value={33}>33 - Nota de Débito</MenuItem>
                    <MenuItem value={34}>34 - Nota de Crédito</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha Desde"
                  value={localFilters.fechaCreacionDesde || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'fechaCreacionDesde',
                      e.target.value || undefined,
                    )
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha Hasta"
                  value={localFilters.fechaCreacionHasta || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'fechaCreacionHasta',
                      e.target.value || undefined,
                    )
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>NCF Auto-actualizado</InputLabel>
                  <Select
                    value={localFilters.ncfAutoActualizado ?? ''}
                    label="NCF Auto-actualizado"
                    onChange={(e) =>
                      handleFilterChange(
                        'ncfAutoActualizado',
                        e.target.value === ''
                          ? undefined
                          : e.target.value === 'true',
                      )
                    }
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="true">Sí</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        {/* Action Buttons */}
        <Box
          sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}
        >
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            startIcon={<Icon icon="mdi:filter-remove" />}
            disabled={store.loading}
          >
            Limpiar Filtros
          </Button>
          <Button
            variant="contained"
            onClick={handleApplyFilters}
            startIcon={<Icon icon="mdi:filter-check" />}
            disabled={store.loading}
          >
            Aplicar Filtros
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default EcfDocumentsFiltersPanel
