// ** React Imports

// ** MUI Imports
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Utils
import formatDate from 'src/utils/formatDate'

// ** Types
import {
  EcfStatusEnum,
  ecfStatusLabels,
  ecfStatusObj,
  getJobStatusColor,
  JobStatus,
  jobStatusLabels,
} from 'src/types/apps/ecfDocumentoTypes'

interface EcfDocumento {
  id?: number
  documentoId?: string
  tipoDocumento?: string
  tipoDocumentoEcf?: string
  codigoCliente?: string
  codigoVendedor?: string
  localidadId?: number
  fechaDocumento?: string
  qrUrl?: string
  internalTrackId?: string
  securityCode?: string
  signedDate?: string
  ncf?: string // NCF assigned by DGII
  ncfDescripcion?: string // Description of NCF type
  statusEcf?: EcfStatusEnum // Uses EcfStatusEnum descriptions
  statusEcfUltimaActualizacion?: string // ISO 8601 date string
  dgiiResponses?: string
  ncfAutoActualizado?: boolean
  ncfFechaAutoActualizado?: string
  jobId?: string
  jobStatus?: JobStatus
  jobQueuedAt?: string
  jobStartedAt?: string
  jobCompletedAt?: string
  jobErrorMessage?: string
  jobRetryCount?: number
  jobRetryMaxAttempts?: number
  documentoReferenciadoId?: string
  documentoReferenciadoEcfId?: number
  motivoReferencia?: string
  usuarioCreacion?: string
  fechaCreacion?: string
  usuarioModificacion?: string
  fechaModificacion?: string
  asignacionAutomatica?: boolean
  metadataJson?: string
  businessId?: string
}

interface EcfDocumentModalProps {
  open: boolean
  onClose: () => void
  ecfDocumento: EcfDocumento | null
  documentTitle?: string
}

const EcfDocumentModal = ({
  open,
  onClose,
  ecfDocumento,
  documentTitle,
}: EcfDocumentModalProps) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  if (!ecfDocumento) return null

  const getStatusColor = (
    status?: string | number | boolean | EcfStatusEnum | JobStatus,
  ):
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning' => {
    if (!status) return 'info'

    // For JobStatus, use the predefined color mapping
    if (
      typeof status === 'number' &&
      Object.values(JobStatus).includes(status)
    ) {
      const color = getJobStatusColor(status as JobStatus)
      // Map to valid MUI Chip colors
      switch (color) {
        case 'primary':
          return 'primary'
        case 'secondary':
          return 'secondary'
        case 'success':
          return 'success'
        case 'error':
          return 'error'
        case 'warning':
          return 'warning'
        case 'info':
          return 'info'
        default:
          return 'default'
      }
    }

    // For ECF status, use the predefined color mapping
    if (Object.values(EcfStatusEnum).includes(status as EcfStatusEnum)) {
      const color = ecfStatusObj[status as EcfStatusEnum]
      // Map to valid MUI Chip colors
      switch (color) {
        case 'primary':
          return 'primary'
        case 'secondary':
          return 'secondary'
        case 'success':
          return 'success'
        case 'error':
          return 'error'
        case 'warning':
          return 'warning'
        case 'info':
          return 'info'
        default:
          return 'default'
      }
    }

    // Fallback for other statuses
    const statusStr = String(status).toLowerCase()
    switch (statusStr) {
      case 'completed':
      case 'approved':
        return 'success'
      case 'pending':
      case 'inprogress':
        return 'warning'
      case 'failed':
      case 'rejected':
        return 'error'
      case 'cancelled':
        return 'default'
      default:
        return 'info'
    }
  }

  const InfoRow = ({
    label,
    value,
    fullWidth = false,
  }: {
    label: string
    value?: string | number | boolean
    fullWidth?: boolean
  }) => {
    if (value === undefined || value === null || value === '') return null

    return (
      <Grid item xs={12} sm={fullWidth ? 12 : 6}>
        <Box
          sx={{
            mb: { xs: 1.5, sm: 2 },
            p: { xs: 1.5, sm: 0 },
            backgroundColor: { xs: 'action.hover', sm: 'transparent' },
            borderRadius: { xs: 1, sm: 0 },
            border: { xs: '1px solid', sm: 'none' },
            borderColor: { xs: 'divider', sm: 'transparent' },
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: { xs: 500, sm: 400 },
              mb: { xs: 0.5, sm: 1 },
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              wordBreak: 'break-word',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              lineHeight: { xs: 1.3, sm: 1.5 },
            }}
          >
            {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value}
          </Typography>
        </Box>
      </Grid>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: { xs: 0, md: 2 },
          margin: { xs: 0, sm: 2 },
          maxHeight: { xs: '100vh', sm: '90vh' },
          height: { xs: '100%', sm: 'auto' },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: { xs: 1, sm: 2 },
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          position: 'sticky',
          top: 0,
          backgroundColor: 'background.paper',
          zIndex: 1,
          borderBottom: { xs: '1px solid', sm: 'none' },
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box sx={{ display: 'flex', fontSize: { xs: 20, sm: 24 } }}>
            <Icon icon="material-symbols:receipt" />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                lineHeight: { xs: 1.2, sm: 1.6 },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: { xs: 'nowrap', sm: 'normal' },
              }}
            >
              Comprobante Fiscal Electrónico
            </Typography>
            {documentTitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  mt: { xs: 0.25, sm: 0 },
                }}
              >
                Documento: {documentTitle}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            minWidth: { xs: 40, sm: 'auto' },
            minHeight: { xs: 40, sm: 'auto' },
            p: { xs: 1, sm: 1 },
          }}
        >
          <Icon icon="mdi:close" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          '&.MuiDialogContent-dividers': {
            borderTop: { xs: 'none', sm: '1px solid' },
            borderBottom: { xs: 'none', sm: '1px solid' },
          },
        }}
      >
        <Grid
          container
          spacing={{ xs: 2, sm: 3 }}
          sx={{ pb: { xs: 6, sm: 0 } }}
        >
          {/* Document Information */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1 },
                fontSize: { xs: '1rem', sm: '1.25rem' },
                mb: { xs: 1, sm: 2 },
              }}
            >
              <Icon icon="mdi:file-document" />
              Información del Documento
            </Typography>
            <Divider sx={{ mb: { xs: 1.5, sm: 2 } }} />
          </Grid>

          <InfoRow label="ID Documento" value={ecfDocumento.documentoId} />
          <InfoRow label="Tipo Documento" value={ecfDocumento.tipoDocumento} />
          <InfoRow label="Tipo ECF" value={ecfDocumento.tipoDocumentoEcf} />
          <InfoRow label="Código Cliente" value={ecfDocumento.codigoCliente} />
          <InfoRow
            label="Código Vendedor"
            value={ecfDocumento.codigoVendedor}
          />
          <InfoRow label="Localidad ID" value={ecfDocumento.localidadId} />
          <InfoRow
            label="Fecha Documento"
            value={
              ecfDocumento.fechaDocumento
                ? formatDate(ecfDocumento.fechaDocumento)
                : undefined
            }
          />
          <InfoRow
            label="Última Actualización ECF"
            value={
              ecfDocumento.statusEcfUltimaActualizacion
                ? formatDate(ecfDocumento.statusEcfUltimaActualizacion)
                : undefined
            }
          />
          <InfoRow label="NCF" value={ecfDocumento.ncf} />
          <InfoRow
            label="Descripción NCF"
            value={ecfDocumento.ncfDescripcion}
          />

          {/* ECF Status */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1 },
                mt: { xs: 2, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.25rem' },
                mb: { xs: 1, sm: 2 },
              }}
            >
              <Icon icon="mdi:check-circle" />
              Estado ECF
            </Typography>
            <Divider sx={{ mb: { xs: 1.5, sm: 2 } }} />
          </Grid>

          {ecfDocumento.statusEcf && (
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  mb: { xs: 1.5, sm: 2 },
                  p: { xs: 1.5, sm: 0 },
                  backgroundColor: { xs: 'action.hover', sm: 'transparent' },
                  borderRadius: { xs: 1, sm: 0 },
                  border: { xs: '1px solid', sm: 'none' },
                  borderColor: { xs: 'divider', sm: 'transparent' },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: { xs: 500, sm: 400 },
                    mb: { xs: 0.5, sm: 1 },
                  }}
                >
                  Estado
                </Typography>
                <Chip
                  label={
                    ecfDocumento.statusEcf
                      ? ecfStatusLabels[ecfDocumento.statusEcf] ||
                        ecfDocumento.statusEcf
                      : ''
                  }
                  color={getStatusColor(ecfDocumento.statusEcf)}
                  size="small"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                    height: { xs: 28, sm: 24 },
                    '& .MuiChip-label': {
                      px: { xs: 1.5, sm: 1 },
                    },
                  }}
                />
              </Box>
            </Grid>
          )}

          <InfoRow
            label="Auto Actualizado NCF"
            value={ecfDocumento.ncfAutoActualizado}
          />
          <InfoRow
            label="Fecha Auto Actualización"
            value={
              ecfDocumento.ncfFechaAutoActualizado
                ? formatDate(ecfDocumento.ncfFechaAutoActualizado)
                : undefined
            }
          />

          {/* DGII Information */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1 },
                mt: { xs: 2, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.25rem' },
                mb: { xs: 1, sm: 2 },
              }}
            >
              <Icon icon="mdi:web" />
              Información DGII
            </Typography>
            <Divider sx={{ mb: { xs: 1.5, sm: 2 } }} />
          </Grid>

          {ecfDocumento.qrUrl && (
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  URL del QR
                </Typography>
                <Link
                  href={ecfDocumento.qrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    wordBreak: 'break-all',
                  }}
                >
                  <Icon icon="mdi:qrcode" />
                  Ver Comprobante Fiscal
                </Link>
              </Box>
            </Grid>
          )}

          <InfoRow
            label="Track ID Interno"
            value={ecfDocumento.internalTrackId}
          />
          <InfoRow
            label="Código de Seguridad"
            value={ecfDocumento.securityCode}
          />
          <InfoRow
            label="Fecha Firmado"
            value={
              ecfDocumento.signedDate
                ? formatDate(ecfDocumento.signedDate)
                : undefined
            }
          />

          {/* Job Information */}
          {(ecfDocumento.jobId || ecfDocumento.jobStatus) && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 0.5, sm: 1 },
                    mt: { xs: 2, sm: 2 },
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    mb: { xs: 1, sm: 2 },
                  }}
                >
                  <Icon icon="mdi:cog" />
                  Información del Trabajo
                </Typography>
                <Divider sx={{ mb: { xs: 1.5, sm: 2 } }} />
              </Grid>

              <InfoRow label="Job ID" value={ecfDocumento.jobId} />

              {ecfDocumento.jobStatus && (
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      mb: { xs: 1.5, sm: 2 },
                      p: { xs: 1.5, sm: 0 },
                      backgroundColor: {
                        xs: 'action.hover',
                        sm: 'transparent',
                      },
                      borderRadius: { xs: 1, sm: 0 },
                      border: { xs: '1px solid', sm: 'none' },
                      borderColor: { xs: 'divider', sm: 'transparent' },
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        fontWeight: { xs: 500, sm: 400 },
                        mb: { xs: 0.5, sm: 1 },
                      }}
                    >
                      Estado del Trabajo
                    </Typography>
                    <Chip
                      label={
                        ecfDocumento.jobStatus !== undefined
                          ? jobStatusLabels[ecfDocumento.jobStatus] ||
                            'Desconocido'
                          : ''
                      }
                      color={getStatusColor(ecfDocumento.jobStatus)}
                      size="small"
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                        height: { xs: 28, sm: 24 },
                        '& .MuiChip-label': {
                          px: { xs: 1.5, sm: 1 },
                        },
                      }}
                    />
                  </Box>
                </Grid>
              )}

              <InfoRow
                label="En Cola"
                value={
                  ecfDocumento.jobQueuedAt
                    ? formatDate(ecfDocumento.jobQueuedAt)
                    : undefined
                }
              />
              <InfoRow
                label="Iniciado"
                value={
                  ecfDocumento.jobStartedAt
                    ? formatDate(ecfDocumento.jobStartedAt)
                    : undefined
                }
              />
              <InfoRow
                label="Completado"
                value={
                  ecfDocumento.jobCompletedAt
                    ? formatDate(ecfDocumento.jobCompletedAt)
                    : undefined
                }
              />
              <InfoRow
                label="Intentos de Reintento"
                value={ecfDocumento.jobRetryCount}
              />
              <InfoRow
                label="Máximo Intentos"
                value={ecfDocumento.jobRetryMaxAttempts}
              />

              {ecfDocumento.jobErrorMessage && (
                <InfoRow
                  label="Mensaje de Error"
                  value={ecfDocumento.jobErrorMessage}
                  fullWidth
                />
              )}
            </>
          )}

          {/* Audit Information */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 1 },
                mt: { xs: 2, sm: 2 },
                fontSize: { xs: '1rem', sm: '1.25rem' },
                mb: { xs: 1, sm: 2 },
              }}
            >
              <Icon icon="mdi:account-clock" />
              Información de Auditoría
            </Typography>
            <Divider sx={{ mb: { xs: 1.5, sm: 2 } }} />
          </Grid>

          <InfoRow
            label="Usuario Creación"
            value={ecfDocumento.usuarioCreacion}
          />
          <InfoRow
            label="Fecha Creación"
            value={
              ecfDocumento.fechaCreacion
                ? formatDate(ecfDocumento.fechaCreacion)
                : undefined
            }
          />
          <InfoRow
            label="Usuario Modificación"
            value={ecfDocumento.usuarioModificacion}
          />
          <InfoRow
            label="Fecha Modificación"
            value={
              ecfDocumento.fechaModificacion
                ? formatDate(ecfDocumento.fechaModificacion)
                : undefined
            }
          />
          <InfoRow
            label="Asignación Automática"
            value={ecfDocumento.asignacionAutomatica}
          />

          {/* Additional Information */}
          {(ecfDocumento.documentoReferenciadoId ||
            ecfDocumento.motivoReferencia ||
            ecfDocumento.metadataJson) && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 0.5, sm: 1 },
                    mt: { xs: 2, sm: 2 },
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    mb: { xs: 1, sm: 2 },
                  }}
                >
                  <Icon icon="mdi:information" />
                  Información Adicional
                </Typography>
                <Divider sx={{ mb: { xs: 1.5, sm: 2 } }} />
              </Grid>

              <InfoRow
                label="Documento Referenciado"
                value={ecfDocumento.documentoReferenciadoId}
              />
              <InfoRow
                label="Motivo Referencia"
                value={ecfDocumento.motivoReferencia}
                fullWidth
              />

              {ecfDocumento.metadataJson && (
                <InfoRow
                  label="Metadata"
                  value={ecfDocumento.metadataJson}
                  fullWidth
                />
              )}
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
          position: { xs: 'sticky', sm: 'static' },
          bottom: { xs: 0, sm: 'auto' },
          backgroundColor: { xs: 'background.paper', sm: 'transparent' },
          borderTop: { xs: '1px solid', sm: 'none' },
          borderColor: { xs: 'divider', sm: 'transparent' },
          zIndex: { xs: 1, sm: 'auto' },
        }}
      >
        {ecfDocumento.qrUrl && (
          <Button
            variant="contained"
            startIcon={<Icon icon="mdi:qrcode" />}
            href={ecfDocumento.qrUrl}
            target="_blank"
            size="small"
            rel="noopener noreferrer"
            sx={{
              mr: { xs: 0, sm: 1 },
              minHeight: { xs: 48, sm: 'auto' },
              fontSize: { xs: '1rem', sm: '0.875rem' },
              order: { xs: 2, sm: 1 },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Ver Comprobante
          </Button>
        )}
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{
            minHeight: { xs: 48, sm: 'auto' },
            fontSize: { xs: '1rem', sm: '0.875rem' },
            order: { xs: 1, sm: 2 },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EcfDocumentModal
