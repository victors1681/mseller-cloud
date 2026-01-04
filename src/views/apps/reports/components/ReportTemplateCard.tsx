// ** React Imports
import { FC } from 'react'

// ** MUI Imports
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Imports
import {
  getTipoDocumentoName,
  PlantillaReporte,
  ReportCategory,
  TemplateStatus,
} from 'src/types/apps/reportsTypes'

// ** Utils
import { formatDate } from 'src/utils/formatDate'

interface Props {
  template: PlantillaReporte
  onView: () => void
  onPreview?: () => void
  onSetAsDefault?: () => void
  onDelete: () => void
  isDeleting: boolean
}

const ReportTemplateCard: FC<Props> = ({
  template,
  onView,
  onPreview,
  onSetAsDefault,
  onDelete,
  isDeleting,
}) => {
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
    <Card
      sx={{
        cursor: 'pointer',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
      onClick={onView}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {template.nombre}
            </Typography>
            <Typography
              variant="caption"
              color="primary"
              sx={{ display: 'block', mb: 1, fontWeight: 500 }}
            >
              {getTipoDocumentoName(
                template.tipoDocumento || template.tipoModulo || 0,
              )}
            </Typography>
            {template.descripcion && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {template.descripcion.substring(0, 100)}
                {template.descripcion.length > 100 ? '...' : ''}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {onPreview && (
              <IconButton size="small" onClick={onPreview} title="Vista previa">
                <Icon icon="mdi:eye-outline" fontSize={20} />
              </IconButton>
            )}
            {onSetAsDefault && (
              <IconButton
                size="small"
                onClick={onSetAsDefault}
                title="Establecer como predeterminada"
              >
                <Icon icon="mdi:star-outline" fontSize={20} />
              </IconButton>
            )}
            <IconButton
              size="small"
              onClick={onView}
              disabled={template.isGlobal}
              title="Editar"
            >
              <Icon icon="mdi:pencil-outline" fontSize={20} />
            </IconButton>
            <IconButton
              size="small"
              onClick={onDelete}
              disabled={isDeleting || template.isGlobal}
              title="Eliminar"
            >
              <Icon icon="mdi:delete-outline" fontSize={20} />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mb: 2,
            flexWrap: 'wrap',
          }}
        >
          <Chip
            label={template.tipoPlantilla === 1 ? 'Print' : 'Email'}
            size="small"
            color={template.tipoPlantilla === 1 ? 'primary' : 'secondary'}
          />
          <Chip
            label={template.habilitado ? 'Activo' : 'Inactivo'}
            size="small"
            color={template.habilitado ? 'success' : 'error'}
          />
          {template.isGlobal && (
            <Chip
              label="Global (Read-Only)"
              size="small"
              color="warning"
              icon={<Icon icon="mdi:earth" />}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Creado: {formatDate(template.fechaCreacion)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ReportTemplateCard
