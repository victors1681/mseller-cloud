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
import { Controller, Control, useFormContext } from 'react-hook-form'
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

  // Get setValue from react-hook-form to programmatically set values
  const { setValue } = useFormContext() || { setValue: null }

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

  const debouncedInputValue = useDebounce(inputValue, 900)

  // Special functionality: detect #{code} pattern for direct product code search
  const handleSpecialInput = async (input: string, field?: any) => {
    const hashPattern = /^([A-Za-z0-9-]+)#$/
    const match = input.match(hashPattern)

    if (match) {
      const productCode = match[1]
      setLoading(true)
      try {
        // Dispatch the API call and wait for the response
        const result = await dispatch(
          fetchProducts({
            codigoProducto: productCode,
            query: '',
            status: '',
            pageNumber: 0,
          }),
        ).unwrap()

        // Check the result for the found product
        let foundProduct = result.totalResults > 0 ? result.data[0] : null

        if (foundProduct) {
          // Auto-select the product using react-hook-form field
          if (field) {
            field.onChange(productCode)
          }

          // Keep the input value as the product display format
          setInputValue(`${productCode}-${foundProduct.nombre}`)

          // Trigger the callback
          props?.callBack && props?.callBack(productCode)

          return true // Indicates special input was handled
        } else {
          // Product not found, show error message
          console.warn(`Product with code ${productCode} not found`)
        }
      } catch (error) {
        console.error('Error fetching product by code:', error)
      } finally {
        setLoading(false)
      }
    }
    return false // Normal input processing
  }

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
            inputValue={inputValue}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            id="products-dropdown"
            getOptionLabel={(option) =>
              (option.id && `${option.id}-${option.label}`) || ''
            }
            sx={{ mt: 0, ml: 0, ...props.sx }}
            onChange={handleSelection}
            onInputChange={async (_, newInputValue) => {
              // Check for special #{num} pattern first
              const isSpecialInput = await handleSpecialInput(
                newInputValue,
                field,
              )

              // Only set input value if it's not a special pattern
              if (!isSpecialInput) {
                setInputValue(newInputValue)
              }
            }}
            filterOptions={(x) => x} // Disable client-side filtering since we're doing server-side
            renderInput={(params) => (
              <TextField
                {...params}
                label={props.label || 'Productos'}
                placeholder={
                  props.placeholder || 'Buscar productos o escriba código#'
                }
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
