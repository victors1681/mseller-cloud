import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { clearTable, fetchRemoveData } from 'src/store/apps/removeData'
import { RemoveDataType } from 'src/types/apps/removeDataType'
import { GridLoadingOverlay } from '@mui/x-data-grid'
import LoadingWrapper from 'src/views/ui/LoadingWrapper'
import LoadingButton from '@mui/lab/LoadingButton'
import toast from 'react-hot-toast'

// Define the RemoveData options

type FormData = {
  actions: RemoveDataType[]
}

const RemoveDataForm: React.FC = () => {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { isValid, isLoading },
  } = useForm<FormData>({
    defaultValues: {
      actions: [], // Start with no options selected
    },
    mode: 'onChange', // Trigger validation on form state change
  })

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.removeData)

  useEffect(() => {
    if (store.isLoading && store.data.length === 0) {
      dispatch(fetchRemoveData())
    }
  }, [store.data.length])

  const selectedActions = watch('actions')

  const onSubmit = async (data: FormData) => {
    try {
      const response = await dispatch<any>(clearTable(data.actions))

      const message = response.payload?.message || 'Error desconocido'
      if (response.payload?.error) {
        toast.error(message)
      } else {
        toast.success(message)
      }

      reset()
    } catch (err) {
      // Handle unexpected errors
      console.error('Unexpected error: ', err)
      toast.error(
        'Error al procesar la solicitud. Por favor intente nuevamente.',
      )
    }
  }

  const handleSelectAll = () => {
    const allValues = store.data.map((option) => option.value)
    setValue('actions', allValues)
  }

  const handleDeselectAll = () => {
    setValue('actions', [])
  }

  return (
    <Box sx={{ pb: 5 }}>
      <Typography sx={{ mb: 2 }}>
        Tenga en cuenta que algunas de estas tablas tienen dependencias entre
        sí. No podrá eliminar las localidades si están asociadas a vendedores o
        productos, ni podrá eliminar clientes si existen pedidos o cobros
        relacionados.
      </Typography>
      <LoadingWrapper isLoading={store.isLoading}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            {/* Select All Button */}
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleSelectAll}
                sx={{ mr: 2 }}
              >
                Select All
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleDeselectAll}
              >
                Deselect All
              </Button>
            </Box>

            {/* RemoveData checkboxes */}
            {store.data.map((option) => (
              <Controller
                key={option.value}
                name="actions"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value.includes(option.value)}
                        onChange={(e) => {
                          const value = option.value
                          const isChecked = e.target.checked
                          if (isChecked) {
                            field.onChange([...field.value, value])
                          } else {
                            field.onChange(
                              field.value.filter((v: string) => v !== value),
                            )
                          }
                        }}
                      />
                    }
                    label={option.label}
                  />
                )}
              />
            ))}
          </FormGroup>

          {/* Submit Button */}
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              color="error"
              loading={isLoading}
              disabled={selectedActions.length === 0} // Disable if no checkboxes are selected
            >
              Proceder
            </LoadingButton>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={() => reset()}
            >
              Restaurar
            </Button>
          </Box>
        </form>
      </LoadingWrapper>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Selected actions: {selectedActions.join(', ')}
      </Typography>
    </Box>
  )
}

export default RemoveDataForm
