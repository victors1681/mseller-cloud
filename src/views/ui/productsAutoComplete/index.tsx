import {
  Autocomplete,
  AutocompleteValue,
  TextField,
  SxProps,
  Theme,
  CircularProgress,
} from '@mui/material'
import {
  SyntheticEvent,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, Control } from 'react-hook-form'
import { AppDispatch, RootState } from 'src/store'
import { fetchData as fetchProducts } from 'src/store/apps/products'

interface ProductAutoCompleteProps {
  name: string
  control: Control<any>
  selectedLocation?: string
  callBack?: (values: string) => void
  sx?: SxProps<Theme>
  label?: string
  placeholder?: string
  error?: boolean
  helperText?: string
}

interface ProductOptions {
  label: string
  id: string
}

export const ProductAutoComplete = (props: ProductAutoCompleteProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const productStore = useSelector((state: RootState) => state.products)
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  // Simple debounce hook
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      return () => {
        clearTimeout(handler)
      }
    }, [value, delay])

    return debouncedValue
  }

  const debouncedInputValue = useDebounce(inputValue, 300)

  const findProductLabel = (codigo: string) => {
    return (
      productStore?.data.find((v) => v.codigo.toString() === codigo)?.nombre ||
      ''
    )
  }

  // Load initial data or search based on input
  useEffect(() => {
    if (open && (productStore?.data?.length !== 0 || debouncedInputValue)) {
      setLoading(true)
      dispatch(
        fetchProducts({
          query: debouncedInputValue,
          status: '',
          pageNumber: 0,
        }),
      ).finally(() => {
        setLoading(false)
      })
    }
  }, [open, debouncedInputValue, dispatch, productStore?.data?.length])

  const options = useMemo(() => {
    return productStore.data.map((v) => ({
      label: v.nombre,
      id: v.codigo.toString(),
    }))
  }, [productStore.data])

  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field, fieldState: { error } }) => {
        // Fetch data if field has value but we don't have product data
        useEffect(() => {
          if (field.value) {
            setLoading(true)
            dispatch(
              fetchProducts({
                codigoProducto: field.value,
                query: '',
                status: '',
                pageNumber: 0,
              }),
            ).finally(() => {
              setLoading(false)
            })
          }
        }, [field.value])
        const handleSelection = (
          _: SyntheticEvent<Element, Event>,
          values: AutocompleteValue<any, any, any, any>,
        ) => {
          const locations = Array.isArray(values)
            ? values.map((v) => v.id).join(',')
            : values?.id || ''

          field.onChange(locations)
          props?.callBack && props?.callBack(locations)
        }

        const getSelectedValue = () => {
          const label = findProductLabel(field.value)
          return label ? { id: field.value, label } : null
        }

        return (
          <Autocomplete
            options={options}
            open={open}
            onOpen={() => {
              setOpen(true)
            }}
            onClose={() => {
              setOpen(false)
            }}
            loading={loading}
            filterSelectedOptions
            value={getSelectedValue()}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            id="products-dropdown"
            getOptionLabel={(option) => `${option.id}-${option.label}` || ''}
            sx={{ mt: 0, ml: 0, ...props.sx }}
            onChange={handleSelection}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue)
            }}
            filterOptions={(x) => x} // Disable client-side filtering since we're doing server-side
            renderInput={(params) => (
              <TextField
                {...params}
                label={props.label || 'Productos'}
                placeholder={props.placeholder || 'Productos'}
                error={!!error || props.error}
                helperText={error?.message || props.helperText}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        )
      }}
    />
  )
}

export default ProductAutoComplete
