// ** React Imports
import { useState, ChangeEvent, useEffect, useCallback } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import DialogTitle from '@mui/material/DialogTitle'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

// ** Third Party Imports
import Payment from 'payment'
import Cards, { Focused } from 'react-credit-cards'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Util Import
import {
  formatCVC,
  formatExpirationDate,
  formatCreditCardNumber,
} from 'src/@core/utils/format'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import AddSubscriptionForm from './AddSubscriptionForm'
import { useFirebase } from 'src/firebase/useFirebase'
import { PaymentMethodsResponseType } from 'src/types/apps/stripeTypes'
import { isValidResponse } from 'src/firebase'
import LoadingWrapper from 'src/views/ui/LoadingWrapper'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'

interface SelectedCardType {
  cvc?: number
  name?: string
  expiry?: string
  cardId?: string
  cardNumber?: string
  focus?: Focused
  brand?: string | null
}

const brandLogo = {
  visa: '/images/logos/visa.png',
  mastercard: '/images/logos/mastercard.png',
  amex: '/images/logos/american-express.png',
  '': '',
} as any

const PaymentMethodCard = () => {
  // ** States
  const [openEditCard, setOpenEditCard] = useState<boolean>(false)
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethodsResponseType>()
  const [selectedCard, setSelectedCard] = useState<SelectedCardType | null>()
  const [isPaymentMethodLoading, setPaymentMethodsLoading] = useState(false)

  const { getCustomerPaymentMethods, removeCustomerCard } = useFirebase()

  const handlePaymentMethods = async () => {
    try {
      setPaymentMethodsLoading(true)
      const response = await getCustomerPaymentMethods()
      if (isValidResponse<PaymentMethodsResponseType>(response)) {
        setPaymentMethods(response)
        setPaymentMethodsLoading(false)
      } else {
        setPaymentMethodsLoading(false)
        toast.error('Error al cargar sus métodos de pagos')
      }
    } catch (err) {
      toast.error('Error al cargar sus métodos de pagos')
      console.error(err)
      setPaymentMethodsLoading(false)
    }
  }

  const handleRemoveCard = async (cardId: string) => {
    if (confirm('Está seguro que deseas eliminar esta tarjeta de tu cuenta?')) {
      const response = await removeCustomerCard(cardId)
      if (isValidResponse(response)) {
        toast.success('Tarjeta de crédito eliminada')
        //reload the cards
        handlePaymentMethods()
      } else {
        toast.error('Error al eliminar la tarjeta de crédito')
      }
    }
  }

  useEffect(() => {
    handlePaymentMethods()
  }, [])

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cardNumberDialog: selectedCard?.cardNumber || '',
      nameDialog: selectedCard?.name || '',
      expiryDialog: selectedCard?.expiry || '',
      cvcDialog: selectedCard?.cvc || '',
      cardStatus: 'Primary',
      saveCard: true,
    },
  })

  const onSubmit = (data: any) => {
    console.log('Form Data:', data)
    // Perform submission logic here
  }

  const handleEditCardClickOpen = useCallback(
    (id: number) => {
      const data = paymentMethods?.payment_methods?.[id]
      // setSelectedCard(data)
      const values = {
        cardId: data?.id || '',
        focus: 'name',
        name: data?.billing_details?.name || '',
        cvc: 0,
        expiry: `${data?.exp_month}/${data?.exp_year
          ?.toString()
          ?.substring(2)}`,
        cardNumber: `************${data?.last4}`,
        brand: data?.brand,
      }
      setSelectedCard(values as any)
      reset({
        cardNumberDialog: `************${data?.last4}`,
        nameDialog: data?.billing_details?.name || '',
        expiryDialog: `${data?.exp_month}/${data?.exp_year
          ?.toString()
          ?.substring(2)}`,
        cvcDialog: selectedCard?.cvc || '',
        cardStatus: 'Primary',
        saveCard: true,
      })
      setOpenEditCard(true)
    },
    [paymentMethods],
  )

  const handleEditCardClose = () => {
    setOpenEditCard(false)
    setTimeout(() => {
      setSelectedCard(null)
    }, 200)
  }

  const handleInputChangeDialog = ({
    target,
  }: ChangeEvent<HTMLInputElement>) => {
    if (target.name === 'cardNumberDialog') {
      target.value = formatCreditCardNumber(target.value, Payment)
      setSelectedCard({
        ...selectedCard,
        cardNumber: target.value,
      } as SelectedCardType)
    } else if (target.name === 'expiryDialog') {
      target.value = formatExpirationDate(target.value)
      setSelectedCard({
        ...selectedCard,
        expiry: target.value,
      } as SelectedCardType)
    } else if (target.name === 'cvcDialog') {
      target.value = formatCVC(
        target.value,
        (selectedCard as SelectedCardType).cardNumber || '',
        Payment,
      )
      setSelectedCard({
        ...selectedCard,
        cvc: target.value || 0,
      } as SelectedCardType)
    }
  }

  return (
    <>
      <Card>
        <CardHeader title="Subscripción y pago" />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <AddSubscriptionForm />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 4, fontWeight: 500 }}>
                Mis tarjetas
              </Typography>
              <LoadingWrapper isLoading={isPaymentMethodLoading}>
                {paymentMethods?.payment_methods?.map((item, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      p: 5,
                      display: 'flex',
                      borderRadius: 1,
                      flexDirection: ['column', 'row'],
                      justifyContent: ['space-between'],
                      backgroundColor: 'action.hover',
                      alignItems: ['flex-start', 'center'],
                      mb:
                        index !== paymentMethods?.payment_methods?.length - 1
                          ? 4
                          : undefined,
                    }}
                  >
                    <div>
                      {brandLogo[item.brand || ''] && (
                        <img
                          height="25"
                          alt={item?.brand || ''}
                          src={brandLogo[item.brand || '']}
                        />
                      )}
                      <Box
                        sx={{
                          mt: 1,
                          mb: 2.5,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography sx={{ fontWeight: 600 }}>
                          {item.billing_details.name}
                        </Typography>
                        {item.is_default ? (
                          <CustomChip
                            skin="light"
                            size="small"
                            sx={{ ml: 4 }}
                            label={'Por Defecto'}
                            color={'primary'}
                          />
                        ) : null}
                      </Box>
                      <Typography variant="body2">
                        **** **** **** {item.last4}
                      </Typography>
                    </div>

                    <Box sx={{ mt: [3, 0], textAlign: ['start', 'end'] }}>
                      <Button
                        variant="outlined"
                        sx={{ mr: 4 }}
                        disabled
                        onClick={() => handleEditCardClickOpen(index)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleRemoveCard(item.id)}
                      >
                        Eliminar
                      </Button>
                      <Typography variant="body2" sx={{ mt: 4 }}>
                        Tarjeta expira {item.exp_month}-{item.exp_year}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </LoadingWrapper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        open={openEditCard}
        onClose={handleEditCardClose}
        aria-labelledby="user-view-billing-edit-card"
        aria-describedby="user-view-billing-edit-card-description"
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
      >
        <DialogTitle
          id="user-view-billing-edit-card"
          sx={{
            textAlign: 'center',
            fontSize: '1.5rem !important',
            px: (theme) => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`,
            ],
            pt: (theme) => [
              `${theme.spacing(8)} !important`,
              `${theme.spacing(12.5)} !important`,
            ],
          }}
        >
          Editar Tarjeta de Crédito
        </DialogTitle>
        <DialogContent
          sx={{
            pb: (theme) => `${theme.spacing(6)} !important`,
            px: (theme) => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`,
            ],
          }}
        >
          <DialogContentText
            variant="body2"
            id="user-view-billing-edit-card-description"
            sx={{ textAlign: 'center', mb: 7 }}
          >
            Editar tus tarjetas guardadas
          </DialogContentText>
          {selectedCard !== null && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Cards
                    cvc={selectedCard?.cvc || 0}
                    focused={'name'}
                    expiry={selectedCard?.expiry || ''}
                    name={selectedCard?.name || ''}
                    number={selectedCard?.cardNumber || ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={6}>
                    {/* Card Number */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        placeholder="0000 0000 0000 0000"
                        error={!!errors.cardNumberDialog}
                        helperText={errors.cardNumberDialog?.message}
                        {...register('cardNumberDialog', {
                          required: 'Card number is required',
                          pattern: {
                            value: /^[0-9]{16}$/,
                            message: 'Card number must be 16 digits',
                          },
                        })}
                      />
                    </Grid>

                    {/* Name on Card */}
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        label="Name on Card"
                        placeholder="John Doe"
                        error={!!errors.nameDialog}
                        helperText={errors.nameDialog?.message}
                        {...register('nameDialog', {
                          required: 'Name is required',
                        })}
                      />
                    </Grid>

                    {/* Expiry */}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Expiry"
                        placeholder="MM/YY"
                        error={!!errors.expiryDialog}
                        helperText={errors.expiryDialog?.message}
                        {...register('expiryDialog', {
                          required: 'Expiry date is required',
                          pattern: {
                            value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                            message: 'Enter a valid expiry (MM/YY)',
                          },
                        })}
                      />
                    </Grid>

                    {/* Card Status */}
                    <Grid item xs={12} sm={8}>
                      <FormControl fullWidth>
                        <InputLabel id="card-status-label">
                          Estado de la tarjeta
                        </InputLabel>
                        <Controller
                          name="cardStatus"
                          control={control}
                          render={({ field }) => (
                            <Select labelId="card-status-label" {...field}>
                              <MenuItem value="Primary">Primary</MenuItem>
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    {/* CVC */}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="CVC"
                        placeholder="123"
                        error={!!errors.cvcDialog}
                        helperText={errors.cvcDialog?.message}
                        {...register('cvcDialog', {
                          required: 'CVC is required',
                          pattern: {
                            value: /^[0-9]{3,4}$/,
                            message: 'CVC must be 3 or 4 digits',
                          },
                        })}
                      />
                    </Grid>

                    {/* Save Card Switch */}
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Controller
                            name="saveCard"
                            control={control}
                            render={({ field }) => (
                              <Switch checked={field.value} {...field} />
                            )}
                          />
                        }
                        label="Save Card for future billing?"
                        sx={{
                          '& .MuiTypography-root': { color: 'text.secondary' },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Dialog Footer Buttons */}
              <DialogActions
                sx={{
                  justifyContent: 'center',
                  px: (theme) => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`,
                  ],
                  pb: (theme) => [
                    `${theme.spacing(8)} !important`,
                    `${theme.spacing(12.5)} !important`,
                  ],
                }}
              >
                <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleEditCardClose}
                >
                  Cancel
                </Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PaymentMethodCard
