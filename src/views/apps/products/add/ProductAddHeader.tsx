// MUI Imports
import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useFormContext } from 'react-hook-form'

const ProductAddHeader = () => {
  const {
    reset,
    formState: { isDirty },
  } = useFormContext()

  const handleRestore = () => {
    reset() // This will reset form to default values
  }

  return (
    <Grid container spacing={4}>
      <Grid item sm={6} md={10}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Agregar nuevo producto
        </Typography>
        <Typography>Mantenimiento de productos</Typography>
      </Grid>
      <Grid item sm={6} md={2}>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ marginRight: 1 }}
          onClick={handleRestore}
          disabled={!isDirty}
        >
          Restaurar
        </Button>
        <Button variant="contained" type="submit" disabled={!isDirty}>
          Grabar
        </Button>
      </Grid>
    </Grid>
  )
}

export default ProductAddHeader
