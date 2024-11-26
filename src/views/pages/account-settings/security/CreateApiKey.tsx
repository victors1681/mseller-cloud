// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { addApiKey } from 'src/store/apps/apikeys'
import { ApiKeyPostType } from 'src/types/apps/apyKeyTypes'
import toast from 'react-hot-toast'

const CreateApiKeyCard = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { description: '', active: true } })

  const onSubmit: SubmitHandler<ApiKeyPostType> = async (data) => {
    const response = await dispatch(addApiKey(data))
    if (response) {
      toast.success('Api Key Creada')
      reset()
    } else {
      toast.error('Error al crear la API Key')
    }

    return true
  }

  return (
    <Card>
      <CardHeader title="Create an API key" />
      <CardContent sx={{ pb: '5 !important' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 5 }}>
                <InputLabel>Elija el tipo de API Key</InputLabel>
                <Select
                  label="Elija el tipo de API  Key"
                  defaultValue="full-control"
                  disabled
                >
                  <MenuItem value="full-control">Control Total</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 5 }}>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Descripción"
                      placeholder="Api Key 1"
                      error={Boolean(errors.description)}
                    />
                  )}
                />
                {errors.description && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    Dijite la descripción del API Key
                  </FormHelperText>
                )}
              </FormControl>
              <Button type="submit" variant="contained" fullWidth>
                Crear API Key
              </Button>
            </form>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CreateApiKeyCard
