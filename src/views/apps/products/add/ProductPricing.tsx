// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// Component Imports

import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'

const ProductPricing = () => {
  return (
    <Card>
      <CardHeader title="Precios" />
      <CardContent>
        <form>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField label="Precio General" placeholder="$0" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Precio 2" placeholder="$0" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Precio 3" placeholder="$0" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Precio 4" placeholder="$0" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Mínimo" placeholder="$0" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Costo" placeholder="$0" />
            </Grid>
          </Grid>
          <Divider sx={{ mt: 5, mb: 5 }} textAlign="left">
            <Typography variant="h6">Impuestos</Typography>
          </Divider>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField label="Porciento Impuesto" placeholder="%" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo Impuesto</InputLabel>
                <Select label="Tipo Impuesto" defaultValue="ITBIS(18%)">
                  <MenuItem value="ITBIS(18%)">ITBIS 18%</MenuItem>
                  <MenuItem value="ITBIS(16%)">ITBIS 16%</MenuItem>
                  <MenuItem value="IVA">IVA</MenuItem>
                  <MenuItem value="Exento">Exento</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ProductPricing
