// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { toggleDetailModal } from 'src/store/apps/ecf/ecfDocumentosSlice'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import {
  JobStatus,
  ecfStatusObj,
  getJobStatusDescription,
  jobStatusColors,
} from 'src/types/apps/ecfDocumentoTypes'

interface DetailItemProps {
  label: string
  value: string | number | boolean | null | undefined
  fullWidth?: boolean
  chip?: boolean
  chipColor?: string
  monospace?: boolean
}

const DetailItem = ({
  label,
  value,
  fullWidth,
  chip,
  chipColor,
  monospace,
}: DetailItemProps) => {
  const displayValue =
    value === null || value === undefined ? '-' : String(value)

  return (
    <Grid item xs={fullWidth ? 12 : 12} sm={fullWidth ? 12 : 6}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '0.5px',
            mb: 0.5,
            display: 'block',
          }}
        >
          {label}
        </Typography>
        {chip ? (
          <Chip
            size="small"
            label={displayValue}
            color={chipColor as any}
            variant="filled"
            sx={{ fontSize: '0.75rem' }}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              fontFamily: monospace ? 'monospace' : 'inherit',
              fontSize: monospace ? '0.875rem' : 'inherit',
              wordBreak: 'break-word',
            }}
          >
            {displayValue}
          </Typography>
        )}
      </Box>
    </Grid>
  )
}

const EcfDocumentDetailModal = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.ecfDocumentos)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  // ** State
  const [expandedSection, setExpandedSection] = useState<string | false>(
    'basic',
  )

  // ** Handlers
  const handleClose = () => {
    dispatch(toggleDetailModal(null))
  }

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedSection(isExpanded ? panel : false)
    }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss', { locale: es })
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

  const parseDgiiResponses = () => {
    if (!store.selectedItem?.dgiiResponses) return []
    try {
      const rawData = JSON.parse(store.selectedItem.dgiiResponses)

      // Handle case where it's an array of stringified JSON objects
      if (Array.isArray(rawData)) {
        return rawData.map((item, index) => {
          if (typeof item === 'string') {
            try {
              return {
                index: index + 1,
                timestamp: new Date().toISOString(), // Could be extracted if available
                data: JSON.parse(item),
              }
            } catch {
              return {
                index: index + 1,
                timestamp: new Date().toISOString(),
                data: item, // Keep as string if can't parse
              }
            }
          }
          return {
            index: index + 1,
            timestamp: new Date().toISOString(),
            data: item,
          }
        })
      }

      // Handle case where it's already an object
      return [
        {
          index: 1,
          timestamp: new Date().toISOString(),
          data: rawData,
        },
      ]
    } catch {
      return []
    }
  }

  if (!store.selectedItem) return null

  const documento = store.selectedItem

  return (
    <Dialog
      open={store.isDetailModalOpen}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: fullScreen ? '100vh' : '80vh',
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h6" component="div">
              Detalles del Documento ECF
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {documento.documentoId}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ color: 'text.secondary' }}
          >
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {/* Basic Information */}
          <Accordion
            expanded={expandedSection === 'basic'}
            onChange={handleAccordionChange('basic')}
          >
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Typography variant="h6">Información Básica</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <DetailItem
                  label="ID Documento"
                  value={documento.documentoId}
                />
                <DetailItem
                  label="Tipo Documento"
                  value={documento.tipoDocumento}
                />
                <DetailItem
                  label="Tipo Documento ECF"
                  value={documento.tipoDocumentoEcf}
                  chip
                  chipColor="primary"
                />
                <DetailItem
                  label="Código Cliente"
                  value={documento.codigoCliente}
                />
                <DetailItem
                  label="Código Vendedor"
                  value={documento.codigoVendedor}
                />
                <DetailItem
                  label="Localidad ID"
                  value={documento.localidadId}
                />
                <DetailItem
                  label="Fecha Documento"
                  value={formatDate(documento.fechaDocumento)}
                />
                <DetailItem label="Business ID" value={documento.businessId} />
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* ECF Response Data */}
          <Accordion
            expanded={expandedSection === 'ecf'}
            onChange={handleAccordionChange('ecf')}
          >
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Typography variant="h6">Datos de Respuesta ECF</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <DetailItem
                  label="NCF"
                  value={documento.ncf}
                  monospace
                  fullWidth
                />
                <DetailItem
                  label="Descripción NCF"
                  value={documento.ncfDescripcion}
                />
                <DetailItem label="Tipo eCF" value={documento.tipoeCF} />
                <DetailItem label="QR URL" value={documento.qrUrl} fullWidth />
                <DetailItem
                  label="Internal Track ID"
                  value={documento.internalTrackId}
                />
                <DetailItem
                  label="Security Code"
                  value={documento.securityCode}
                />
                <DetailItem
                  label="Signed Date"
                  value={formatDate(documento.signedDate)}
                />
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Status Information */}
          <Accordion
            expanded={expandedSection === 'status'}
            onChange={handleAccordionChange('status')}
          >
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Typography variant="h6">Estado y Seguimiento</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <DetailItem
                  label="Estado ECF"
                  value={documento.statusEcf || 'Sin estado'}
                  chip
                  chipColor={getStatusColor(documento.statusEcf)}
                />
                <DetailItem
                  label="Última Actualización Estado"
                  value={formatDate(documento.statusEcfUltimaActualizacion)}
                />
                <DetailItem
                  label="NCF Auto-actualizado"
                  value={documento.ncfAutoActualizado ? 'Sí' : 'No'}
                  chip
                  chipColor={
                    documento.ncfAutoActualizado ? 'success' : 'default'
                  }
                />
                <DetailItem
                  label="Fecha Auto-actualización NCF"
                  value={formatDate(documento.ncfFechaAutoActualizado)}
                />
                <DetailItem
                  label="Asignación Automática"
                  value={documento.asignacionAutomatica ? 'Sí' : 'No'}
                  chip
                  chipColor={
                    documento.asignacionAutomatica ? 'success' : 'default'
                  }
                />
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Job Tracking */}
          <Accordion
            expanded={expandedSection === 'job'}
            onChange={handleAccordionChange('job')}
          >
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Typography variant="h6">Seguimiento de Job</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <DetailItem label="Job ID" value={documento.jobId} />
                <DetailItem
                  label="Estado del Job"
                  value={
                    documento.jobStatus !== null &&
                    documento.jobStatus !== undefined
                      ? getJobStatusDescription(documento.jobStatus)
                      : '-'
                  }
                  chip
                  chipColor={getJobStatusColor(documento.jobStatus)}
                />
                <DetailItem
                  label="Fecha en Cola"
                  value={formatDate(documento.jobQueuedAt)}
                />
                <DetailItem
                  label="Fecha de Inicio"
                  value={formatDate(documento.jobStartedAt)}
                />
                <DetailItem
                  label="Fecha de Finalización"
                  value={formatDate(documento.jobCompletedAt)}
                />
                <DetailItem
                  label="Número de Reintentos"
                  value={documento.jobRetryCount}
                />
                <DetailItem
                  label="Máximo de Reintentos"
                  value={documento.jobRetryMaxAttempts}
                />
                {documento.jobErrorMessage && (
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          letterSpacing: '0.5px',
                          mb: 1,
                          display: 'block',
                        }}
                      >
                        Mensaje de Error
                      </Typography>
                      <Card
                        variant="outlined"
                        sx={{
                          bgcolor: 'error.light',
                          color: 'error.contrastText',
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: 'pre-wrap',
                              fontFamily: 'monospace',
                              fontSize: '0.875rem',
                            }}
                          >
                            {documento.jobErrorMessage}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Document References */}
          {(documento.documentoReferenciadoId ||
            documento.motivoReferencia) && (
            <Accordion
              expanded={expandedSection === 'references'}
              onChange={handleAccordionChange('references')}
            >
              <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                <Typography variant="h6">Referencias de Documento</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <DetailItem
                    label="Documento Referenciado ID"
                    value={documento.documentoReferenciadoId}
                  />
                  <DetailItem
                    label="ECF Referenciado ID"
                    value={documento.documentoReferenciadoEcfId}
                  />
                  <DetailItem
                    label="Motivo de Referencia"
                    value={documento.motivoReferencia}
                    fullWidth
                  />
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          {/* DGII Response History */}
          {documento.dgiiResponses && (
            <Accordion
              expanded={expandedSection === 'dgii'}
              onChange={handleAccordionChange('dgii')}
            >
              <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                <Typography variant="h6">
                  Historial de Respuestas DGII ({parseDgiiResponses().length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {parseDgiiResponses().map((response, index) => (
                    <Card key={index} variant="outlined">
                      <CardContent>
                        {/* Response Header */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Typography variant="subtitle2" color="primary">
                            Respuesta #{response.index}
                          </Typography>
                          {response.data?.estado && (
                            <Chip
                              size="small"
                              label={response.data.estado}
                              color={
                                response.data.estado === 'Rechazado'
                                  ? 'error'
                                  : response.data.estado === 'Aceptado'
                                  ? 'success'
                                  : 'default'
                              }
                              variant="filled"
                            />
                          )}
                        </Box>

                        {/* Response Content */}
                        {typeof response.data === 'object' &&
                        response.data !== null ? (
                          <Grid container spacing={2}>
                            {/* Common DGII fields */}
                            {response.data.rnc && (
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  RNC
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontFamily: 'monospace' }}
                                >
                                  {response.data.rnc}
                                </Typography>
                              </Grid>
                            )}
                            {response.data.ecf && (
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  e-CF
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontFamily: 'monospace' }}
                                >
                                  {response.data.ecf}
                                </Typography>
                              </Grid>
                            )}
                            {response.data.encf && (
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  e-NCF
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontFamily: 'monospace' }}
                                >
                                  {response.data.encf}
                                </Typography>
                              </Grid>
                            )}
                            {response.data.internalTrackId && (
                              <Grid item xs={12}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  Internal Track ID
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.75rem',
                                  }}
                                >
                                  {response.data.internalTrackId}
                                </Typography>
                              </Grid>
                            )}
                            {response.data.securityCode && (
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  Código de Seguridad
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontFamily: 'monospace' }}
                                >
                                  {response.data.securityCode}
                                </Typography>
                              </Grid>
                            )}
                            {response.data.signedDate && (
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  Fecha Firma
                                </Typography>
                                <Typography variant="body2">
                                  {response.data.signedDate}
                                </Typography>
                              </Grid>
                            )}
                            {response.data.qr_url && (
                              <Grid item xs={12}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  QR URL
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.75rem',
                                    wordBreak: 'break-all',
                                  }}
                                >
                                  {response.data.qr_url}
                                </Typography>
                              </Grid>
                            )}

                            {/* Error messages */}
                            {response.data.mensajes &&
                              Array.isArray(response.data.mensajes) && (
                                <Grid item xs={12}>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                  >
                                    Mensajes
                                  </Typography>
                                  <Box sx={{ mt: 1 }}>
                                    {response.data.mensajes.map(
                                      (mensaje: any, msgIndex: number) => (
                                        <Card
                                          key={msgIndex}
                                          variant="outlined"
                                          sx={{ mb: 1, bgcolor: 'error.light' }}
                                        >
                                          <CardContent
                                            sx={{
                                              py: 1,
                                              '&:last-child': { pb: 1 },
                                            }}
                                          >
                                            <Typography
                                              variant="body2"
                                              color="error.contrastText"
                                            >
                                              <strong>
                                                Código {mensaje.codigo}:
                                              </strong>{' '}
                                              {mensaje.valor}
                                            </Typography>
                                          </CardContent>
                                        </Card>
                                      ),
                                    )}
                                  </Box>
                                </Grid>
                              )}

                            {/* Status and additional fields */}
                            {response.data.codigo && (
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  Código
                                </Typography>
                                <Typography variant="body2">
                                  {response.data.codigo}
                                </Typography>
                              </Grid>
                            )}
                            {response.data.secuenciaUtilizada !== undefined && (
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  Secuencia Utilizada
                                </Typography>
                                <Chip
                                  size="small"
                                  label={
                                    response.data.secuenciaUtilizada
                                      ? 'Sí'
                                      : 'No'
                                  }
                                  color={
                                    response.data.secuenciaUtilizada
                                      ? 'success'
                                      : 'default'
                                  }
                                  variant="outlined"
                                />
                              </Grid>
                            )}
                          </Grid>
                        ) : (
                          // Fallback for non-object responses
                          <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                            <CardContent>
                              <pre
                                style={{
                                  fontSize: '0.75rem',
                                  fontFamily: 'monospace',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                  margin: 0,
                                }}
                              >
                                {typeof response.data === 'string'
                                  ? response.data
                                  : JSON.stringify(response.data, null, 2)}
                              </pre>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Audit Information */}
          <Accordion
            expanded={expandedSection === 'audit'}
            onChange={handleAccordionChange('audit')}
          >
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Typography variant="h6">Información de Auditoría</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <DetailItem
                  label="Usuario Creación"
                  value={documento.usuarioCreacion}
                />
                <DetailItem
                  label="Fecha Creación"
                  value={formatDate(documento.fechaCreacion)}
                />
                <DetailItem
                  label="Usuario Modificación"
                  value={documento.usuarioModificacion}
                />
                <DetailItem
                  label="Fecha Modificación"
                  value={formatDate(documento.fechaModificacion)}
                />
                {documento.metadataJson && (
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          letterSpacing: '0.5px',
                          mb: 1,
                          display: 'block',
                        }}
                      >
                        Metadata JSON
                      </Typography>
                      <Card variant="outlined">
                        <CardContent>
                          <pre
                            style={{
                              fontSize: '0.75rem',
                              fontFamily: 'monospace',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              maxHeight: '200px',
                              overflow: 'auto',
                              margin: 0,
                            }}
                          >
                            {JSON.stringify(
                              JSON.parse(documento.metadataJson),
                              null,
                              2,
                            )}
                          </pre>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EcfDocumentDetailModal
