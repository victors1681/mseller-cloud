// ** React Imports
import { FC } from 'react'

// ** MUI Imports
import { Box, Button, Card, CardContent, Chip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import {
  ConfigurationSummaryItem,
  DocumentTypeIcons,
  tipoDocumentoSpanishNames,
} from 'src/types/apps/templateConfigTypes'

interface Props {
  item: ConfigurationSummaryItem
  onConfigure: (documentType: string) => void
}

const TemplateConfigurationCard: FC<Props> = ({ item, onConfigure }) => {
  // ** Hooks
  const theme = useTheme()

  // ** Render Status Icon
  const renderStatusIcon = () => {
    if (item.isConfigured && item.templateId) {
      return (
        <Icon
          icon="mdi:check-circle"
          fontSize={28}
          style={{ color: theme.palette.success.main }}
        />
      )
    }
    return (
      <Icon
        icon="mdi:alert-circle"
        fontSize={28}
        style={{ color: theme.palette.warning.main }}
      />
    )
  }

  // ** Render Source Badge
  const renderSourceBadge = () => {
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

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon
              icon={DocumentTypeIcons[item.documentType]}
              fontSize={32}
              style={{ color: theme.palette.primary.main }}
            />
            {renderStatusIcon()}
          </Box>
          {renderSourceBadge()}
        </Box>

        <Typography variant="h6" sx={{ mb: 1 }}>
          {tipoDocumentoSpanishNames[item.documentType as keyof typeof tipoDocumentoSpanishNames]}
        </Typography>

        {item.templateName ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Plantilla Actual:
            </Typography>
            <Typography variant="body1">{item.templateName}</Typography>
            {item.templateLanguage && (
              <Typography variant="caption" color="text.secondary">
                Idioma: {item.templateLanguage.toUpperCase()}
              </Typography>
            )}
          </Box>
        ) : (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="warning.main">
              Sin plantilla configurada
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Configure una plantilla para este tipo de documento
            </Typography>
          </Box>
        )}

        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={() => onConfigure(item.documentType)}
          sx={{
            minHeight: 48,
            fontSize: '1rem',
          }}
        >
          Configurar
        </Button>
      </CardContent>
    </Card>
  )
}

export default TemplateConfigurationCard
