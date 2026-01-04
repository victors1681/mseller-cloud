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
import { ReporteGenerado } from 'src/types/apps/reportsTypes'

// ** Utils
import { formatDate } from 'src/utils/formatDate'

interface Props {
  report: ReporteGenerado
  onDownload: () => void
  onDelete: () => void
  isProcessing: boolean
}

const GeneratedReportCard: FC<Props> = ({
  report,
  onDownload,
  onDelete,
  isProcessing,
}) => {
  // ** Format File Size
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A'
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(2)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(2)} MB`
  }

  return (
    <Card>
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
            <Typography variant="h6" sx={{ mb: 1 }}>
              {report.plantillaReporte?.nombre ||
                `Plantilla ID: ${report.plantillaReporteId}`}
            </Typography>
            {report.nombreArchivo && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <Icon
                  icon="mdi:file-document"
                  style={{ verticalAlign: 'middle', marginRight: 4 }}
                />
                {report.nombreArchivo}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={onDownload}
              disabled={isProcessing || !report.rutaArchivo}
            >
              <Icon icon="mdi:download" fontSize={20} />
            </IconButton>
            <IconButton size="small" onClick={onDelete} disabled={isProcessing}>
              <Icon icon="mdi:delete-outline" fontSize={20} />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Fecha de Generación
            </Typography>
            <Typography variant="body2">
              {formatDate(report.fechaGeneracion)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Tamaño
            </Typography>
            <Chip
              label={formatFileSize(report.tamanioArchivo)}
              size="small"
              variant="outlined"
            />
          </Box>

          {report.usuarioGeneracion && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Generado por
              </Typography>
              <Typography variant="body2">
                {report.usuarioGeneracion}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default GeneratedReportCard
