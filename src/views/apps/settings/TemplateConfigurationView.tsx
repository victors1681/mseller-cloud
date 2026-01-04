// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Hidden,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  fetchConfigurationSummary,
  selectConfigurationStats,
  selectConfigurationSummary,
  selectError,
  selectIsLoading,
} from 'src/store/apps/settings/templateConfigSlice'

// ** Types
import {
  ConfigurationSummaryItem,
  DocumentTypeIcons,
  mapDocumentTypeToNumerico,
  TipoDocumentoNumerico,
  tipoDocumentoSpanishNames,
} from 'src/types/apps/templateConfigTypes'

// ** Components
import TemplateConfigurationCard from './components/TemplateConfigurationCard'
import TemplateConfigurationModal from './components/TemplateConfigurationModal'

const TemplateConfigurationView = () => {
  // ** Hooks
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // ** State
  const summary = useAppSelector(selectConfigurationSummary)
  const stats = useAppSelector(selectConfigurationStats)
  const loading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)

  const [selectedDocumentType, setSelectedDocumentType] =
    useState<TipoDocumentoNumerico | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // ** Effects
  useEffect(() => {
    dispatch(fetchConfigurationSummary())
  }, [dispatch])

  // ** Handlers
  const handleConfigure = (documentType: string) => {
    // Convert string documentType to numeric tipoDocumento
    const tipoDocumento = mapDocumentTypeToNumerico(documentType)
    setSelectedDocumentType(tipoDocumento)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedDocumentType(null)
  }

  const handleConfigurationSaved = () => {
    dispatch(fetchConfigurationSummary())
    handleCloseModal()
  }

  const handleRefresh = () => {
    dispatch(fetchConfigurationSummary())
  }

  // ** Render Status Icon
  const renderStatusIcon = (item: ConfigurationSummaryItem) => {
    if (item.isConfigured && item.templateId) {
      return (
        <Icon
          icon="mdi:check-circle"
          fontSize={24}
          style={{ color: theme.palette.success.main }}
        />
      )
    }
    return (
      <Icon
        icon="mdi:alert-circle"
        fontSize={24}
        style={{ color: theme.palette.warning.main }}
      />
    )
  }

  // ** Render Template Source Badge
  const renderSourceBadge = (item: ConfigurationSummaryItem) => {
    if (!item.isConfigured) {
      return (
        <Chip
          label="No configurado"
          size="small"
          color="warning"
          variant="outlined"
        />
      )
    }

    if (item.isGlobalTemplate) {
      return (
        <Chip
          icon={<Icon icon="mdi:web" />}
          label="Global"
          size="small"
          color="info"
          variant="outlined"
        />
      )
    }

    return (
      <Chip
        icon={<Icon icon="mdi:office-building" />}
        label="Personalizada"
        size="small"
        color="primary"
        variant="outlined"
      />
    )
  }

  // ** Render Stats Summary
  const renderStats = () => {
    if (!stats) return null

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
              <Typography variant="h4" color="success.main">
                {stats.configured}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configurados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
              <Typography variant="h4" color="warning.main">
                {stats.notConfigured}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sin configurar
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
              <Typography variant="h4" color="info.main">
                {stats.usingGlobalTemplates}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Globales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
              <Typography variant="h4" color="primary.main">
                {stats.usingCustomTemplates}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Personalizadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Configuración de Plantillas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure qué plantilla se utiliza para cada tipo de documento
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Icon icon="mdi:refresh" />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Actualizar
        </Button>
      </Box>

      {/* Stats Summary */}
      {renderStats()}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Desktop Table View */}
      <Hidden mdDown>
        <Card>
          <CardHeader
            title="Tipos de Documento"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="50">Estado</TableCell>
                  <TableCell>Tipo de Documento</TableCell>
                  <TableCell>Plantilla Actual</TableCell>
                  <TableCell>Fuente</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.map((item) => (
                  <TableRow key={item.documentType} hover>
                    <TableCell>{renderStatusIcon(item)}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Icon
                          icon={DocumentTypeIcons[item.documentType]}
                          fontSize={24}
                        />
                        <Typography variant="body2">
                          {
                            tipoDocumentoSpanishNames[
                              item.documentType as keyof typeof tipoDocumentoSpanishNames
                            ]
                          }
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {item.templateName ? (
                        <Box>
                          <Typography variant="body2">
                            {item.templateName}
                          </Typography>
                          {item.templateLanguage && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.templateLanguage.toUpperCase()}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin configurar
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{renderSourceBadge(item)}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleConfigure(item.documentType)}
                      >
                        Configurar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Hidden>

      {/* Mobile Card View */}
      <Hidden mdUp>
        <Grid container spacing={2}>
          {summary.map((item) => (
            <Grid item xs={12} key={item.documentType}>
              <TemplateConfigurationCard
                item={item}
                onConfigure={handleConfigure}
              />
            </Grid>
          ))}
        </Grid>
      </Hidden>

      {/* Configuration Modal */}
      {selectedDocumentType !== null && (
        <TemplateConfigurationModal
          open={modalOpen}
          tipoDocumento={selectedDocumentType}
          onClose={handleCloseModal}
          onSaved={handleConfigurationSaved}
        />
      )}
    </Box>
  )
}

export default TemplateConfigurationView
