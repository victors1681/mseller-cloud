// ** React Imports
import { useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Radio from '@mui/material/Radio'
import { alpha, styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { SetupOption } from 'src/types/apps/onboardingTypes'

interface Props {
  value: SetupOption | null
  onChange: (value: SetupOption) => void
}

interface OptionCardProps {
  selected: boolean
}

const OptionCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<OptionCardProps>(({ theme, selected }) => ({
  cursor: 'pointer',
  border: `2px solid ${
    selected ? theme.palette.primary.main : theme.palette.divider
  }`,
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.08)
    : 'transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}))

const DataSetupStep = ({ value, onChange }: Props) => {
  const [showStartFromScratch, setShowStartFromScratch] = useState(false)
  const theme = useTheme()

  const options = [
    {
      value: 'sample' as const,
      icon: 'mdi:database-outline',
      title: 'Datos de Ejemplo (Recomendado)',
      description: 'Iniciar con datos de muestra para explorar el sistema',
      color: theme.palette.success.main,
    },
    {
      value: 'new' as const,
      icon: 'mdi:rocket-launch-outline',
      title: 'Configuración Nueva',
      description: 'Comenzar con una configuración limpia y datos básicos',
      color: theme.palette.primary.main,
    },
    {
      value: 'advanced' as const,
      icon: 'mdi:api',
      title: 'Configuración Nueva',
      description: 'Comenzar en modo avanzado listo para integraciones',
      color: theme.palette.primary.main,
    },

    // {
    //   value: 'upload' as const,
    //   icon: 'mdi:cloud-upload-outline',
    //   title: 'Subir Mi Información',
    //   description: 'Importar tus datos existentes desde archivos',
    //   color: theme.palette.info.main,
    // },
  ]

  const handleOptionClick = (optionValue: SetupOption) => {
    onChange(optionValue)
    setShowStartFromScratch(false)
  }

  const handleStartFromScratch = () => {
    onChange('new')
    setShowStartFromScratch(false)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          ¿Cómo quieres comenzar?
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Elige la opción que mejor se adapte a tus necesidades
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {options.map((option) => (
          <OptionCard
            key={option.value}
            selected={value === option.value}
            onClick={() => handleOptionClick(option.value)}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Radio
                  checked={value === option.value}
                  value={option.value}
                  sx={{ p: 0 }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: alpha(option.color, 0.12),
                  }}
                >
                  <Icon icon={option.icon} fontSize={28} color={option.color} />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {option.description}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </OptionCard>
        ))}
      </Box>

      {showStartFromScratch && (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            border: (theme) => `1px dashed ${theme.palette.warning.main}`,
            backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.08),
          }}
        >
          <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
            ¿Estás seguro que quieres empezar desde cero?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="warning"
              onClick={handleStartFromScratch}
            >
              Sí, empezar desde cero
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowStartFromScratch(false)}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default DataSetupStep
