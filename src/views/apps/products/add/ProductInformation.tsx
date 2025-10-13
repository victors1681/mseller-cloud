'use client'

// MUI Imports
import { useCodeGenerator } from '@/hooks/useCodeGenerator'
import { RootState } from '@/store'
import CustomAutocomplete from '@/views/ui/customAutocomplete'
import LoadingWrapper from '@/views/ui/LoadingWrapper'
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { EditorState } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

const unitOptions = [{ label: 'UN', value: 'UN' }]

const ProductInformation = () => {
  const [descriptionValue, setDescriptionValue] = useState<EditorState>(
    EditorState.createEmpty(),
  )

  const { watch, setValue, control } = useFormContext()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const store = useSelector((state: RootState) => state.products)
  const { generateProduct } = useCodeGenerator()

  // Check if we're in edit mode
  const isEditMode = Boolean(router.query.id !== 'new')

  // Watch esServicio field
  const esServicio = watch('esServicio')
  const productName = watch('nombre')

  const packagingOptions = useMemo(() => {
    return store.packings.map((unit) => ({
      label: unit,
      value: unit,
    }))
  }, [store])

  useEffect(() => {
    if (store.productDetail?.descripcion) {
      try {
        // Convert HTML string to ContentState
        const contentState = stateFromHTML(store?.productDetail?.descripcion)

        // Create EditorState with the converted ContentState
        const editorState = EditorState.createWithContent(contentState)

        setDescriptionValue(editorState)
      } catch (error) {
        console.error('Error converting HTML to EditorState:', error)
        // Fallback to empty editor state
        setDescriptionValue(EditorState.createEmpty())
      }
    } else {
      // If no description, set empty editor state
      setDescriptionValue(EditorState.createEmpty())
    }
  }, [])

  const handleDescriptionOnChange = (data: any) => {
    setDescriptionValue(data)
    const contentState = data.getCurrentContent()
    const htmlContent = contentState && stateToHTML(contentState)
    setValue('descripcion', htmlContent, {
      shouldDirty: true,
    })
  }

  const handleGenerateCode = () => {
    const generatedCode = generateProduct(productName)
    setValue('codigo', generatedCode, { shouldDirty: true })
  }
  return (
    <Card>
      <CardHeader title="Información del Producto" />
      <CardContent>
        <LoadingWrapper isLoading={store.isLoading}>
          <Grid container spacing={isMobile ? 3 : 5} className="mbe-5">
            <Grid item xs={12}>
              <Controller
                name="nombre"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre del producto"
                    error={!!error}
                    helperText={error?.message}
                    size={isMobile ? 'medium' : 'medium'}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="esServicio"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography
                        variant={isMobile ? 'body2' : 'body1'}
                        sx={{ fontWeight: 500 }}
                      >
                        Es Servicio
                      </Typography>
                    }
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={isEditMode ? 12 : 8}
              md={isEditMode ? 12 : 8}
            >
              <Controller
                name="codigo"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Código del Producto"
                    error={!!error}
                    helperText={error?.message}
                    disabled={isEditMode}
                    size={isMobile ? 'medium' : 'medium'}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: isMobile ? '0.875rem' : '1rem',
                      },
                    }}
                  />
                )}
              />
            </Grid>
            {!isEditMode && (
              <Grid item xs={12} sm={4} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGenerateCode}
                  startIcon={<Icon icon="mdi:auto-fix" />}
                  disabled={!productName}
                  size={isMobile ? 'medium' : 'large'}
                  sx={{
                    height: isMobile ? '46px' : '56px',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                  }}
                >
                  {'Generar Código'}
                </Button>
              </Grid>
            )}
            {!esServicio && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="codigoBarra"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Código Barra"
                      error={!!error}
                      helperText={error?.message}
                      size={isMobile ? 'medium' : 'medium'}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: isMobile ? '0.875rem' : '1rem',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sm={esServicio ? 12 : 6}
              md={esServicio ? 12 : 4}
            >
              <CustomAutocomplete
                name="unidad"
                control={control}
                options={unitOptions}
                label={'Unidad'}
                freeSolo
              />
            </Grid>
            {!esServicio && (
              <Grid item xs={12} sm={6} md={4}>
                <CustomAutocomplete
                  name="empaque"
                  control={control}
                  options={packagingOptions}
                  label={'Empaque'}
                  freeSolo
                />
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sm={esServicio ? 12 : 6}
              md={esServicio ? 12 : 4}
            >
              <Controller
                name="factor"
                control={control}
                defaultValue="1"
                render={({ field, fieldState: { error } }) => (
                  <Tooltip
                    title="Si el producto es caja, y desea vender artículos detallados, digite cuantas unidades posee la caja: por ejemplo: 1 caja tiene 12 unidades digite 12, y podrá vender al detalle de esa caja de lo contrario digite 1 si no desea vender al detalle"
                    placement="top"
                    arrow
                  >
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="1"
                      label="Factor Conversión"
                      error={!!error}
                      helperText={error?.message}
                      size={isMobile ? 'medium' : 'medium'}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: isMobile ? '0.875rem' : '1rem',
                        },
                      }}
                    />
                  </Tooltip>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant={isMobile ? 'body2' : 'body1'}
                sx={{
                  mb: 1,
                  fontWeight: 500,
                  fontSize: isMobile ? '0.875rem' : '1rem',
                }}
              >
                Descripción
              </Typography>
              <Box
                sx={{
                  '& .rdw-editor-wrapper': {
                    minHeight: isMobile ? '200px' : '250px',
                  },
                  '& .rdw-editor-main': {
                    minHeight: isMobile ? '150px' : '200px',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                  },
                }}
              >
                <EditorWrapper>
                  <ReactDraftWysiwyg
                    editorState={descriptionValue}
                    onEditorStateChange={(data) =>
                      handleDescriptionOnChange(data)
                    }
                  />
                </EditorWrapper>
              </Box>
            </Grid>
          </Grid>
        </LoadingWrapper>
      </CardContent>
    </Card>
  )
}
export default ProductInformation
