'use client'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { convertToRaw, EditorState } from 'draft-js'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { useEffect, useState } from 'react'
import { stateToHTML } from 'draft-js-export-html'

const ProductInformation = () => {
  const [value, setValue] = useState(EditorState.createEmpty())

  useEffect(() => {
    const contentState = value.getCurrentContent()
    //const rawContent = convertToRaw(contentState)
    const htmlContent = contentState && stateToHTML(contentState)

    console.log('value', htmlContent)
  }, [value])

  return (
    <Card>
      <CardHeader title="Información del Producto" />
      <CardContent>
        <Grid container spacing={5} className="mbe-5">
          <Grid item xs={12}>
            <TextField fullWidth label="Nombre del producto" placeholder="" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Código" placeholder="" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Código Barra" placeholder="" />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Descripción</Typography>
            <EditorWrapper>
              <ReactDraftWysiwyg
                editorState={value}
                onEditorStateChange={(data) => setValue(data)}
              />
            </EditorWrapper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
export default ProductInformation
