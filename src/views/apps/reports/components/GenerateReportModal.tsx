// ** React Imports
import { FC, useEffect, useState } from 'react'

// ** MUI Imports
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Type Imports
import { PlantillaReporte, ReportParameter } from 'src/types/apps/reportsTypes'

// ** Store Imports
import { useAppSelector } from 'src/store'

interface Props {
  open: boolean
  template: PlantillaReporte
  onClose: () => void
  onGenerate: (parametros: Record<string, any>) => void
}

const GenerateReportModal: FC<Props> = ({
  open,
  template,
  onClose,
  onGenerate,
}) => {
  // ** Hooks
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // ** Redux State
  const { isProcessing } = useAppSelector((state) => state.reports)

  // ** State
  const [parametros, setParametros] = useState<Record<string, any>>({})
  const [parsedParams, setParsedParams] = useState<ReportParameter[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ** Parse parameters when template changes
  useEffect(() => {
    if (template.parametrosJson) {
      try {
        const parsed = JSON.parse(template.parametrosJson)
        if (Array.isArray(parsed)) {
          setParsedParams(parsed)
          // Initialize with default values
          const initialParams: Record<string, any> = {}
          parsed.forEach((param: ReportParameter) => {
            if (param.valorPorDefecto !== undefined) {
              initialParams[param.nombre] = param.valorPorDefecto
            }
          })
          setParametros(initialParams)
        }
      } catch (error) {
        console.error('Error parsing parameters:', error)
        setParsedParams([])
      }
    } else {
      setParsedParams([])
      setParametros({})
    }
  }, [template])

  // ** Handle Change
  const handleChange = (paramName: string, value: any) => {
    setParametros((prev) => ({
      ...prev,
      [paramName]: value,
    }))
    // Clear error
    if (errors[paramName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[paramName]
        return newErrors
      })
    }
  }

  // ** Validate Form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    parsedParams.forEach((param) => {
      if (param.requerido && !parametros[param.nombre]) {
        newErrors[param.nombre] = `${param.nombre} es requerido`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ** Handle Submit
  const handleSubmit = () => {
    if (!validateForm()) return

    onGenerate(parametros)
  }

  // ** Handle Close
  const handleClose = () => {
    setErrors({})
    onClose()
  }

  // ** Render Parameter Input
  const renderParameterInput = (param: ReportParameter) => {
    switch (param.tipo) {
      case 'select':
        return (
          <TextField
            select
            fullWidth
            label={param.nombre}
            required={param.requerido}
            value={parametros[param.nombre] || ''}
            onChange={(e) => handleChange(param.nombre, e.target.value)}
            error={!!errors[param.nombre]}
            helperText={errors[param.nombre] || param.descripcion}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Seleccione...</option>
            {param.opciones?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        )

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            label={param.nombre}
            required={param.requerido}
            InputLabelProps={{ shrink: true }}
            value={parametros[param.nombre] || ''}
            onChange={(e) => handleChange(param.nombre, e.target.value)}
            error={!!errors[param.nombre]}
            helperText={errors[param.nombre] || param.descripcion}
          />
        )

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={param.nombre}
            required={param.requerido}
            value={parametros[param.nombre] || ''}
            onChange={(e) =>
              handleChange(param.nombre, parseFloat(e.target.value))
            }
            error={!!errors[param.nombre]}
            helperText={errors[param.nombre] || param.descripcion}
          />
        )

      case 'boolean':
        return (
          <TextField
            select
            fullWidth
            label={param.nombre}
            required={param.requerido}
            value={
              parametros[param.nombre] !== undefined
                ? parametros[param.nombre].toString()
                : ''
            }
            onChange={(e) =>
              handleChange(param.nombre, e.target.value === 'true')
            }
            error={!!errors[param.nombre]}
            helperText={errors[param.nombre] || param.descripcion}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Seleccione...</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </TextField>
        )

      default: // string
        return (
          <TextField
            fullWidth
            label={param.nombre}
            required={param.requerido}
            value={parametros[param.nombre] || ''}
            onChange={(e) => handleChange(param.nombre, e.target.value)}
            error={!!errors[param.nombre]}
            helperText={errors[param.nombre] || param.descripcion}
          />
        )
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Generar Reporte: {template.nombre}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {parsedParams.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Este reporte no requiere parámetros adicionales
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {parsedParams.map((param) => (
                <Grid item xs={12} key={param.nombre}>
                  {renderParameterInput(param)}
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={isProcessing}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          Generar Reporte
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GenerateReportModal
