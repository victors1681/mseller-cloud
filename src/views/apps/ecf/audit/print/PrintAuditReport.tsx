// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'

// ** Third Party Imports
import format from 'date-fns/format'
import { es } from 'date-fns/locale'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchEcfDocuments } from 'src/store/apps/ecf/ecfDocumentosSlice'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import {
  EcfDocumentoFilters,
  EcfDocumentoType,
  ecfDocumentTypeObj,
  ecfStatusObj,
  getEcfDocumentTypeLabel,
  JobStatus,
  jobStatusColors,
} from 'src/types/apps/ecfDocumentoTypes'

// ** Styled Components for Print
const PrintWrapper = styled(Box)(({ theme }) => ({
  '@media print': {
    padding: 0,
    '& .no-print': {
      display: 'none !important',
    },
    '& .MuiCard-root': {
      boxShadow: 'none',
    },
  },
}))

const PrintHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '@media print': {
    marginBottom: theme.spacing(2),
  },
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.75rem',
  padding: theme.spacing(1),
  '@media print': {
    fontSize: '0.7rem',
    padding: theme.spacing(0.5),
  },
}))

const PrintAuditReport = () => {
  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.ecfDocumentos)

  // ** State
  const [isReady, setIsReady] = useState(false)

  // ** Helper Functions
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es })
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return 'default'
    return ecfStatusObj[status] || 'default'
  }

  const getJobStatusColor = (status: JobStatus | null | undefined) => {
    if (status === null || status === undefined) return 'default'
    return jobStatusColors[status] || 'default'
  }

  const parseDgiiMessages = (dgiiResponsesJson: string | null | undefined) => {
    if (!dgiiResponsesJson) return []

    try {
      const responses = JSON.parse(dgiiResponsesJson)
      const messages: string[] = []

      if (Array.isArray(responses)) {
        responses.forEach((responseStr) => {
          try {
            const response = JSON.parse(responseStr)
            if (response.mensajes && Array.isArray(response.mensajes)) {
              response.mensajes.forEach((msg: any) => {
                if (msg.valor) {
                  messages.push(msg.valor)
                }
              })
            }
          } catch (e) {
            // Skip invalid JSON entries
          }
        })
      }

      return messages
    } catch (e) {
      return []
    }
  }

  // ** Parse URL filters
  const getFiltersFromURL = (): EcfDocumentoFilters => {
    const query = router.query
    const urlFilters: EcfDocumentoFilters = {
      pageNumber: query.pageNumber ? Number(query.pageNumber) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 1000,
    }

    if (query.documentoId) urlFilters.documentoId = String(query.documentoId)
    if (query.codigoCliente)
      urlFilters.codigoCliente = String(query.codigoCliente)
    if (query.codigoVendedor)
      urlFilters.codigoVendedor = String(query.codigoVendedor)
    if (query.ncf) urlFilters.ncf = String(query.ncf)
    if (query.statusEcf) urlFilters.statusEcf = String(query.statusEcf)
    if (query.tipoDocumentoEcf)
      urlFilters.tipoDocumentoEcf = Number(query.tipoDocumentoEcf)
    if (query.tipoDocumento)
      urlFilters.tipoDocumento = String(query.tipoDocumento) as any
    if (query.localidadId) urlFilters.localidadId = Number(query.localidadId)
    if (query.tipoeCF) urlFilters.tipoeCF = Number(query.tipoeCF)
    if (query.jobStatus)
      urlFilters.jobStatus = Number(query.jobStatus) as JobStatus
    if (query.fechaCreacionDesde)
      urlFilters.fechaCreacionDesde = String(query.fechaCreacionDesde)
    if (query.fechaCreacionHasta)
      urlFilters.fechaCreacionHasta = String(query.fechaCreacionHasta)
    if (query.fechaDocumentoDesde)
      urlFilters.fechaDocumentoDesde = String(query.fechaDocumentoDesde)
    if (query.fechaDocumentoHasta)
      urlFilters.fechaDocumentoHasta = String(query.fechaDocumentoHasta)
    if (query.ncfAutoActualizado)
      urlFilters.ncfAutoActualizado = query.ncfAutoActualizado === 'true'
    if (query.asignacionAutomatica)
      urlFilters.asignacionAutomatica = query.asignacionAutomatica === 'true'

    return urlFilters
  }

  // ** Fetch data on mount
  useEffect(() => {
    if (router.isReady) {
      const filters = getFiltersFromURL()
      dispatch(fetchEcfDocuments(filters)).then(() => {
        setIsReady(true)
        // Auto-print after data loads
        setTimeout(() => {
          window.print()
        }, 500)
      })
    }
  }, [router.isReady])

  if (!isReady || store.loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  const appliedFilters = getFiltersFromURL()

  return (
    <PrintWrapper sx={{ p: 4 }}>
      <Card>
        <CardContent>
          {/* Report Header */}
          <PrintHeader>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              Auditoría de Documentos ECF
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generado: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de Registros: {store.totalCount}
            </Typography>
          </PrintHeader>

          <Divider sx={{ my: 3 }} />

          {/* Applied Filters Summary */}
          {Object.keys(appliedFilters).length > 2 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Filtros Aplicados:
              </Typography>
              <Grid container spacing={1}>
                {appliedFilters.documentoId && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>ID Documento:</strong>{' '}
                      {appliedFilters.documentoId}
                    </Typography>
                  </Grid>
                )}
                {appliedFilters.codigoCliente && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Cliente:</strong> {appliedFilters.codigoCliente}
                    </Typography>
                  </Grid>
                )}
                {appliedFilters.codigoVendedor && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Vendedor:</strong> {appliedFilters.codigoVendedor}
                    </Typography>
                  </Grid>
                )}
                {appliedFilters.ncf && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>NCF:</strong> {appliedFilters.ncf}
                    </Typography>
                  </Grid>
                )}
                {appliedFilters.statusEcf && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Estado ECF:</strong> {appliedFilters.statusEcf}
                    </Typography>
                  </Grid>
                )}
                {appliedFilters.fechaCreacionDesde && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Fecha Desde:</strong>{' '}
                      {format(
                        new Date(appliedFilters.fechaCreacionDesde),
                        'dd/MM/yyyy',
                      )}
                    </Typography>
                  </Grid>
                )}
                {appliedFilters.fechaCreacionHasta && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Fecha Hasta:</strong>{' '}
                      {format(
                        new Date(appliedFilters.fechaCreacionHasta),
                        'dd/MM/yyyy',
                      )}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Divider sx={{ mt: 2 }} />
            </Box>
          )}

          {/* Data Table */}
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <StyledTableCell>
                    <strong>ID Documento</strong>
                  </StyledTableCell>
                  <StyledTableCell>
                    <strong>Tipo ECF</strong>
                  </StyledTableCell>
                  <StyledTableCell>
                    <strong>Cliente</strong>
                  </StyledTableCell>
                  <StyledTableCell>
                    <strong>NCF</strong>
                  </StyledTableCell>
                  <StyledTableCell>
                    <strong>Estado ECF</strong>
                  </StyledTableCell>
                  <StyledTableCell>
                    <strong>Fecha Creación</strong>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {store.data.map((documento: EcfDocumentoType) => {
                  const isRechazado = documento.statusEcf === 'Rechazado'
                  const dgiiMessages = isRechazado
                    ? parseDgiiMessages(documento.dgiiResponses)
                    : []

                  return (
                    <>
                      <TableRow key={documento.id} hover>
                        <StyledTableCell>
                          {documento.documentoId}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Chip
                            size="small"
                            label={getEcfDocumentTypeLabel(
                              documento.tipoDocumentoEcf ?? 0,
                            )}
                            color={
                              ecfDocumentTypeObj[
                                documento.tipoDocumentoEcf ?? 0
                              ] as any
                            }
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          {documento.codigoCliente}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
                        >
                          {documento.ncf || '-'}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Chip
                            size="small"
                            label={documento.statusEcf || 'Sin estado'}
                            color={getStatusColor(documento.statusEcf) as any}
                            variant="filled"
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              fontWeight: isRechazado ? 700 : 400,
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          {formatDate(documento.fechaCreacion)}
                        </StyledTableCell>
                      </TableRow>
                      {isRechazado && dgiiMessages.length > 0 && (
                        <TableRow key={`${documento.id}-messages`}>
                          <StyledTableCell
                            colSpan={6}
                            sx={{ pl: 4, backgroundColor: '#fff3e0' }}
                          >
                            <Box sx={{ py: 1 }}>
                              <Typography
                                variant="caption"
                                sx={{ fontWeight: 600, color: 'error.main' }}
                              >
                                Mensajes de Rechazo:
                              </Typography>
                              {dgiiMessages.map((message, index) => (
                                <Typography
                                  key={index}
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    mt: 0.5,
                                    color: 'text.secondary',
                                  }}
                                >
                                  • {message}
                                </Typography>
                              ))}
                            </Box>
                          </StyledTableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Section */}
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Total de Documentos:</strong> {store.data.length}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Documentos Aceptados:</strong>{' '}
                  {store.data.filter((d) => d.statusEcf === 'Aceptado').length}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Documentos Rechazados:</strong>{' '}
                  {store.data.filter((d) => d.statusEcf === 'Rechazado').length}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Documentos con Error:</strong>{' '}
                  {store.data.filter((d) => d.statusEcf === 'Error').length}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </PrintWrapper>
  )
}

export default PrintAuditReport
