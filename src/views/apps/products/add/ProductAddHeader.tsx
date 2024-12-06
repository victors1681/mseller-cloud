// MUI Imports
import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const ProductAddHeader = () => {
  return (
    <Grid container spacing={4}>
      <Grid item sm={6} md={10}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Agregar nuevo producto
        </Typography>
        <Typography>Mantenimiento de productos</Typography>
      </Grid>
      <Grid item sm={6} md={2}>
        <Button variant="outlined" color="secondary" sx={{ marginRight: 1 }}>
          Restaurar
        </Button>
        <Button variant="contained">Grabar</Button>
      </Grid>
    </Grid>
  )
}

export default ProductAddHeader
