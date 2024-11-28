import React, { useEffect, useMemo, useState } from 'react'
import {
  Grid,
  FormControl,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  Button,
  Typography,
  ButtonGroup,
  ToggleButtonGroup,
  ToggleButton,
  styled,
  Box,
  FormHelperText,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { fontSize } from '@mui/system'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import LoadingButton from '@mui/lab/LoadingButton'

// Load Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
  {
    locale: 'es',
  },
)

const StyledInputBox = styled(Box)(({ theme }) => ({
  fontSize: '1rem',
  padding: theme.spacing(4, 1.75),
  fontWeight: 400,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  letterSpacing: '0.15px',
  borderColor:
    theme.palette.mode === 'light'
      ? 'rgba(58, 53, 65, 0.22)'
      : theme.palette.divider,
  fontFamily: theme.typography.fontFamily,
  transition: theme.transitions.create(['border-color', 'box-shadow']),

  '&:hover': {
    borderColor: theme.palette.text.primary,
  },

  '&.Mui-focused': {
    borderColor: theme.palette.primary.main,
    boxShadow: `${theme.palette.primary.main}26 0 0 0 2px`, // Add a subtle focus shadow
  },

  '&.Mui-error': {
    borderColor: theme.palette.error.main,
  },
}))

const PaymentForm = () => {
  const [stripeProducts, setStripeProducts] = useState<StripeProductType[]>([])

  const stripe = useStripe()
  const elements = useElements()
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isLoading },
  } = useForm({
    defaultValues: {
      licenses: 1,
      tier: 'standard',
      name: '',
      cardDetails: '',
    },
  })

  const tierPrices = {
    basic: 0,
    standard: 14,
    enterprise: 25,
  }

  const options = useMemo(
    () => ({
      hidePostalCode: true,
      style: {
        base: {
          fontSize: '18px',
          color: '#424770',
          letterSpacing: '0.025em',
          fontFamily: 'Source Code Pro, monospace',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    }),
    [],
  )

  const selectedTier = watch('tier')
  const licenses = watch('licenses')

  const totalPrice =
    ((stripeProducts.find((f) => f.id === selectedTier)?.prices?.[0]
      .unit_amount || 0) /
      100) *
    licenses

  const { createSubscription, cancelSubscription, fetchStripeProducts } =
    useAuth()

  const fetchStripeProductsHandler = async () => {
    const stipeProducts = await fetchStripeProducts()
    if (stipeProducts && !stipeProducts?.error) {
      setStripeProducts(stipeProducts)
      //select the first item by default
      const defaultProduct = stipeProducts?.[0].id
      setValue('tier', defaultProduct)
    }
  }

  useEffect(() => {
    fetchStripeProductsHandler()
  }, [])

  const onSubmit = async (data: any) => {
    if (!stripe || !elements) return

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    const { token, error } = await stripe.createToken(cardElement, {
      name: data.name,
    })

    if (error) {
      console.error('Stripe Tokenization Error:', error)
      return
    }

    const currentTier = stripeProducts.find(
      (f: StripeProductType) => f.id === selectedTier,
    )
    const tierName = currentTier?.name || ''
    const tierPrice = currentTier?.prices?.[0].id
    if (!tierPrice) {
      toast.error('Error al optener el precio de la subscripción')
      return
    }
    const subscriptionResult = (await createSubscription({
      quantity: data.licenses,
      price: tierPrice,
      tier: tierName,
      token: token.id,
    })) as any

    if (subscriptionResult && subscriptionResult?.success) {
      toast.success('Subscripción creada correctamente')
    } else {
      console.error('Failed to create subscription:', subscriptionResult.error)
      toast.error(`Error al crear su subscripción ${subscriptionResult?.error}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        {/* Tier Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ mb: 5 }}>
            <Controller
              name="tier"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ToggleButtonGroup
                  {...field}
                  value={field.value}
                  exclusive
                  disabled={isLoading}
                  onChange={(
                    event: React.MouseEvent<HTMLElement>,
                    newAlignment: string,
                  ) => {
                    field.onChange(newAlignment)
                  }}
                >
                  {stripeProducts?.map((p) => {
                    return (
                      <ToggleButton key={p.id} value={p.id}>
                        {/* Standard - $14/mes */}
                        {p.name +
                          '-' +
                          p.prices?.[0].currency +
                          ' ' +
                          p.prices?.[0].unit_amount / 100}
                      </ToggleButton>
                    )
                  })}
                </ToggleButtonGroup>
              )}
            />
          </FormControl>
        </Grid>
        {/* License Count */}
        <Grid item xs={12}>
          <Controller
            name="licenses"
            control={control}
            rules={{ required: true, min: 1 }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Number of Licenses"
                type="number"
                disabled={isLoading}
                fullWidth
                error={!!fieldState.error}
                helperText={
                  fieldState.error
                    ? 'Please enter a valid number of licenses'
                    : ''
                }
              />
            )}
          />
        </Grid>

        {/* Total Price Display */}
        <Grid item xs={12}>
          <Typography variant="h6">
            Total: ${totalPrice.toFixed(2)} ({licenses} licencias/usuarios - al
            mes)
          </Typography>
        </Grid>

        {/* Name on Card */}
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name on card is required' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                disabled={isLoading}
                label="Nombre en la tarjeta"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>

        {/* Card Element */}
        <Grid item xs={12}>
          <StyledInputBox>
            <CardElement
              options={options}
              onReady={() => {
                console.log('CardElement [ready]')
              }}
              onChange={(event) => {
                console.log('CardElement [change]', event)
              }}
              onBlur={() => {
                console.log('CardElement [blur]')
              }}
              onFocus={() => {
                console.log('CardElement [focus]')
              }}
            />
          </StyledInputBox>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <LoadingButton
            variant="contained"
            color="primary"
            type="submit"
            disabled={!stripe}
            loading={isSubmitting || isLoading}
          >
            Suscribirse por ${totalPrice.toFixed(2)}
          </LoadingButton>
          <Box sx={{ p: 2 }}>
            <Typography variant="caption">
              Sin contrato, puede cancelar en cualquier momento su suscripción
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}

const PaymentContainer = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  )
}

export default PaymentContainer
