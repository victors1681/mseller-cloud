// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Hidden,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** API Client
import restClient from 'src/configs/restClient'

// ** Store Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  clearFilters,
  deleteReportTemplate,
  fetchReportTemplates,
  setFilters,
} from 'src/store/apps/reports'
import { saveConfiguration } from 'src/store/apps/settings/templateConfigSlice'

// ** Type Imports
import {
  getTipoDocumentoName,
  ReportCategory,
  ReportFrequency,
  ReportsFilters,
  TemplateStatus,
} from 'src/types/apps/reportsTypes'

// ** Component Imports
import CreateReportTemplateModal from './components/CreateReportTemplateModal'
import ReportTemplateCard from './components/ReportTemplateCard'

// ** Utils
import { formatDate } from 'src/utils/formatDate'

const ReportsListView = () => {
  // ** Hooks
  const router = useRouter()
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // ** State
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState<string>('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewTemplateName, setPreviewTemplateName] = useState<string>('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  // ** Redux State
  const { templates, templatesTotal, isLoading, isProcessing, filters, error } =
    useAppSelector((state) => state.reports)

  // ** Local Filters State
  const [localFilters, setLocalFilters] = useState<{
    search: string
    categoria: ReportCategory | ''
    estado: TemplateStatus | ''
    frecuencia: ReportFrequency | ''
  }>({
    search: filters.search || '',
    categoria: filters.categoria || '',
    estado: filters.estado || '',
    frecuencia: filters.frecuencia || '',
  })

  // ** Effects
  useEffect(() => {
    loadReports()
  }, [page, rowsPerPage, filters])

  // ** Load Reports
  const loadReports = () => {
    dispatch(
      fetchReportTemplates({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        filters,
      }),
    )
  }

  // ** Handle Filter Change
  const handleFilterChange = (field: string, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // ** Apply Filters
  const handleApplyFilters = () => {
    setPage(0)
    const filters: ReportsFilters = {
      search: localFilters.search || undefined,
      categoria: localFilters.categoria || undefined,
      estado: localFilters.estado || undefined,
      frecuencia: localFilters.frecuencia || undefined,
    }
    dispatch(setFilters(filters))
  }

  // ** Clear Filters
  const handleClearFilters = () => {
    setLocalFilters({
      search: '',
      categoria: '',
      estado: '',
      frecuencia: '',
    })
    dispatch(clearFilters())
    setPage(0)
  }

  // ** Handle Page Change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // ** Handle Rows Per Page Change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // ** Handle View Detail
  const handleViewDetail = (id: number) => {
    router.push(`/apps/reports/detail/${id}`)
  }

  // ** Handle Delete
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta plantilla de reporte?')) {
      try {
        await dispatch(deleteReportTemplate(id)).unwrap()
        loadReports()
      } catch (error) {
        console.error('Error deleting report template:', error)
      }
    }
  }

  // ** Handle Set as Default
  const handleSetAsDefault = async (
    templateId: number,
    tipoDocumento: number,
  ) => {
    try {
      await dispatch(
        saveConfiguration({
          tipoDocumento,
          plantillaId: templateId,
          activo: true,
        }),
      ).unwrap()

      toast.success('Plantilla configurada como predeterminada exitosamente')
      loadReports()
    } catch (error: any) {
      // If configuration already exists, the error message will indicate that
      if (
        error &&
        typeof error === 'string' &&
        error.includes('already exists')
      ) {
        toast.error(
          'Ya existe una configuración. Use la página de configuración de plantillas para actualizar.',
        )
      } else {
        toast.error(
          error || 'Error al configurar la plantilla como predeterminada',
        )
      }
    }
  }

  // ** Handle Preview
  const handlePreview = async (id: number, name: string) => {
    setPreviewLoading(true)
    setPreviewModalOpen(true)
    setPreviewHtml('')
    setPreviewTemplateName(name)

    try {
      const response = await restClient.get(
        `/api/portal/PlantillaReporte/${id}/preview`,
        {
          responseType: 'text',
          headers: {
            Accept: 'text/html',
          },
        },
      )
      setPreviewHtml(response.data)
    } catch (error) {
      toast.error('Error al cargar la vista previa')
      console.error('Error loading preview:', error)
      setPreviewModalOpen(false)
    } finally {
      setPreviewLoading(false)
    }
  }

  // ** Get Status Color
  const getStatusColor = (estado: TemplateStatus) => {
    switch (estado) {
      case TemplateStatus.Active:
        return 'success'
      case TemplateStatus.Inactive:
        return 'error'
      default:
        return 'default'
    }
  }

  // ** Get Category Color
  const getCategoryColor = (categoria: ReportCategory) => {
    switch (categoria) {
      case ReportCategory.Ventas:
        return 'primary'
      case ReportCategory.Inventario:
        return 'secondary'
      case ReportCategory.CuentasPorCobrar:
        return 'warning'
      case ReportCategory.Financiero:
        return 'success'
      default:
        return 'info'
    }
  }

  return (
    <>
      <Grid container spacing={3}>
        {/* Header Card */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Plantillas de Reportes"
              action={
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Icon icon="mdi:cog-outline" />}
                    onClick={() => router.push('/apps/settings/templates')}
                    sx={{
                      minHeight: { xs: 44, sm: 'auto' },
                    }}
                  >
                    Configurar Plantillas
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Icon icon="mdi:plus" />}
                    onClick={() => setCreateModalOpen(true)}
                    sx={{
                      minHeight: { xs: 44, sm: 'auto' },
                    }}
                  >
                    Nueva Plantilla
                  </Button>
                </Box>
              }
            />
            {isLoading && <LinearProgress />}
          </Card>
        </Grid>

        {/* Filters Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} sm={6} lg={3}>
                  <TextField
                    fullWidth
                    label="Buscar"
                    placeholder="Nombre o descripción"
                    value={localFilters.search}
                    onChange={(e) =>
                      handleFilterChange('search', e.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <Icon icon="mdi:magnify" style={{ marginRight: 8 }} />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                  <TextField
                    select
                    fullWidth
                    label="Categoría"
                    value={localFilters.categoria}
                    onChange={(e) =>
                      handleFilterChange('categoria', e.target.value)
                    }
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {Object.values(ReportCategory).map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                  <TextField
                    select
                    fullWidth
                    label="Estado"
                    value={localFilters.estado}
                    onChange={(e) =>
                      handleFilterChange('estado', e.target.value)
                    }
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {Object.values(TemplateStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                  <TextField
                    select
                    fullWidth
                    label="Frecuencia"
                    value={localFilters.frecuencia}
                    onChange={(e) =>
                      handleFilterChange('frecuencia', e.target.value)
                    }
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {Object.values(ReportFrequency).map((freq) => (
                      <MenuItem key={freq} value={freq}>
                        {freq}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleClearFilters}
                      startIcon={<Icon icon="mdi:filter-off" />}
                    >
                      Limpiar
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleApplyFilters}
                      startIcon={<Icon icon="mdi:filter" />}
                    >
                      Aplicar Filtros
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Desktop Table View */}
        <Hidden mdDown>
          <Grid item xs={12}>
            <Card>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Alcance</TableCell>
                      <TableCell>Fecha Creación</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading && templates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : templates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No se encontraron plantillas de reportes
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      templates.map((template) => (
                        <TableRow
                          key={template.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleViewDetail(template.id)}
                        >
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {template.nombre}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block' }}
                              >
                                {getTipoDocumentoName(
                                  template.tipoDocumento ||
                                    template.tipoModulo ||
                                    0,
                                )}
                              </Typography>
                              {template.descripcion && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {template.descripcion.substring(0, 50)}
                                  {template.descripcion.length > 50
                                    ? '...'
                                    : ''}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                template.tipoPlantilla === 1 ? 'Print' : 'Email'
                              }
                              size="small"
                              color={
                                template.tipoPlantilla === 1
                                  ? 'primary'
                                  : 'secondary'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                template.habilitado ? 'Activo' : 'Inactivo'
                              }
                              size="small"
                              color={template.habilitado ? 'success' : 'error'}
                            />
                          </TableCell>
                          <TableCell>
                            {template.isGlobal ? (
                              <Chip
                                label="Global (Sólo lectura)"
                                size="small"
                                color="warning"
                                icon={<Icon icon="mdi:earth" />}
                              />
                            ) : (
                              <Chip
                                label="Local"
                                size="small"
                                color="default"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDate(template.fechaCreacion)}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePreview(template.id, template.nombre)
                              }}
                              title="Vista previa"
                            >
                              <Icon icon="mdi:eye-outline" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSetAsDefault(
                                  template.id,
                                  template.tipoDocumento,
                                )
                              }}
                              title="Establecer como predeterminada"
                            >
                              <Icon icon="mdi:star-outline" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewDetail(template.id)
                              }}
                              title="Editar"
                            >
                              <Icon icon="mdi:pencil-outline" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(template.id)
                              }}
                              disabled={isProcessing || template.isGlobal}
                              title="Eliminar"
                            >
                              <Icon icon="mdi:delete-outline" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={templatesTotal}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 50, 100]}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count}`
                }
              />
            </Card>
          </Grid>
        </Hidden>

        {/* Mobile Card View */}
        <Hidden mdUp>
          <Grid item xs={12}>
            {isLoading && templates.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                </CardContent>
              </Card>
            ) : templates.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron plantillas de reportes
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {templates.map((template) => (
                  <Grid item xs={12} key={template.id}>
                    <ReportTemplateCard
                      template={template}
                      onView={() => handleViewDetail(template.id)}
                      onPreview={() =>
                        handlePreview(template.id, template.nombre)
                      }
                      onSetAsDefault={() =>
                        handleSetAsDefault(template.id, template.tipoDocumento)
                      }
                      onDelete={() => handleDelete(template.id)}
                      isDeleting={isProcessing}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            {templates.length > 0 && (
              <Card sx={{ mt: 2 }}>
                <TablePagination
                  component="div"
                  count={templatesTotal}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 20, 50]}
                  labelRowsPerPage="Por página:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} de ${count}`
                  }
                />
              </Card>
            )}
          </Grid>
        </Hidden>
      </Grid>

      {/* Create Modal */}
      <CreateReportTemplateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false)
          loadReports()
        }}
      />

      {/* Preview Modal */}
      <Dialog
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={fullScreen}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon="mdi:eye-outline" fontSize={24} />
            Vista Previa - {previewTemplateName}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '80vh' }}>
          {previewLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress />
            </Box>
          ) : previewHtml ? (
            <iframe
              srcDoc={previewHtml}
              title="Preview"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Typography color="text.secondary">
                No se pudo cargar la vista previa
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setPreviewModalOpen(false)}>Cerrar</Button>
          <Button
            variant="contained"
            startIcon={<Icon icon="mdi:printer" />}
            onClick={() => {
              const iframe = document.querySelector(
                'iframe[title="Preview"]',
              ) as HTMLIFrameElement
              if (iframe?.contentWindow) {
                iframe.contentWindow.print()
              }
            }}
            disabled={!previewHtml}
          >
            Imprimir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ReportsListView
