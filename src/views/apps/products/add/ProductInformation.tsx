'use client'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { EditorState } from 'draft-js'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { useEffect, useMemo, useState } from 'react'
import { stateToHTML } from 'draft-js-export-html'
import { useFormContext, Controller } from 'react-hook-form'
import { Autocomplete, Tooltip } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import LoadingWrapper from '@/views/ui/LoadingWrapper'
import { stateFromHTML } from 'draft-js-import-html'

const unitOptions = [{ label: 'UN', value: 'UN' }]

const ProductInformation = () => {
  const [descriptionValue, setDescriptionValue] = useState<EditorState>(
    EditorState.createEmpty(),
  )

  const { watch, setValue, control } = useFormContext()

  const store = useSelector((state: RootState) => state.products)

  const packagingOptions = useMemo(() => {
    return store.packings.map((unit) => ({
      label: unit,
      value: unit,
    }))
  }, [store])

  const descriptionWatch = watch('descripcion')
  useEffect(() => {
    if (store.productDetail.descripcion) {
      try {
        // Convert HTML string to ContentState
        const contentState = stateFromHTML(store.productDetail.descripcion)

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
  }, [descriptionWatch, store])

  const handleDescriptionOnChange = (data: any) => {
    setDescriptionValue(data)
    const contentState = data.getCurrentContent()
    const htmlContent = contentState && stateToHTML(contentState)
    setValue('descripcion', htmlContent, {
      shouldDirty: true,
    })
  }
  return (
    <Card>
      <CardHeader title="Información del Producto" />
      <CardContent>
        <LoadingWrapper isLoading={store.isLoading}>
          <Grid container spacing={5} className="mbe-5">
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
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="codigo"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Código"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
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
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <Controller
                name="unidad"
                control={control}
                defaultValue="UN"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    freeSolo
                    options={unitOptions}
                    value={
                      unitOptions.find((option) => option.value === value) ||
                      null
                    }
                    onChange={(_, newValue) => {
                      onChange(
                        typeof newValue === 'string'
                          ? newValue
                          : newValue?.value,
                      )
                    }}
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') return option
                      return option?.label || ''
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Unidad"
                        variant="outlined"
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="empaque"
                control={control}
                defaultValue="UN"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    freeSolo
                    options={packagingOptions}
                    value={
                      packagingOptions.find(
                        (option) => option.value === value,
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      onChange(
                        typeof newValue === 'string'
                          ? newValue
                          : newValue?.value,
                      )
                    }}
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') return option
                      return option?.label || ''
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Empaque"
                        variant="outlined"
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
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
                    />
                  </Tooltip>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Descripción</Typography>
              <EditorWrapper>
                <ReactDraftWysiwyg
                  editorState={descriptionValue}
                  onEditorStateChange={(data) =>
                    handleDescriptionOnChange(data)
                  }
                />
              </EditorWrapper>
            </Grid>
          </Grid>
        </LoadingWrapper>
      </CardContent>
    </Card>
  )
}
export default ProductInformation
