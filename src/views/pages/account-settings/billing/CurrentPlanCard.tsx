// ** React Imports
import { useState, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import AlertTitle from '@mui/material/AlertTitle'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { PricingPlanType } from 'src/@core/components/plan-details/types'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Component Import
import PricingPlans from 'src/views/pages/pricing/PricingPlans'
import { useAuth } from 'src/hooks/useAuth'
import { useFirebase } from 'src/firebase/useFirebase'
import { isValidResponse } from 'src/firebase'
import { useRouter } from 'next/router'

const CurrentPlanCard = ({ data }: { data: PricingPlanType[] }) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [userInput, setUserInput] = useState<string>('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  const { user } = useAuth()
  const router = useRouter()
  const { cancelSubscription } = useFirebase()

  const isPlanActive = user?.business.subscriptionStatus === 'active'

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const handleConfirmation = async (value: string) => {
    if (value === 'yes') {
      const response = await cancelSubscription()
      if (isValidResponse(response)) {
        setUserInput(value)
        setSecondDialogOpen(true)
        router.reload()
      } else {
        setUserInput('cancel')
        setSecondDialogOpen(true)
      }
    }
    handleClose()
  }

  return (
    <>
      <Card>
        <CardHeader title="Su plan actual" />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 6 }}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>
                  Su plan actual es: {user?.business?.tier ?? 'Basic'}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Licencias {user?.business?.sellerLicenses ?? 0}
                </Typography>
              </Box>

              <div>
                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 600 }}>
                    Estado de su plan
                  </Typography>
                  <CustomChip
                    label={isPlanActive ? 'Activo' : 'No Activo'}
                    size="small"
                    color={isPlanActive ? 'success' : 'warning'}
                  />
                </Box>
                <Typography sx={{ color: 'text.secondary' }}>
                  {isPlanActive
                    ? 'Listo para utilizar el sistema'
                    : 'Inactivo con opciones limitadas'}
                </Typography>
              </div>
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <Alert
                severity="warning"
                sx={{ mb: 6 }}
                action={
                  <IconButton size="small" color="inherit" aria-label="close">
                    <Icon icon="mdi:close" fontSize="inherit" />
                  </IconButton>
                }
              >
                <AlertTitle>We need your attention!</AlertTitle>
                Your plan requires update
              </Alert>

              <div>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    Days
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    24 of 30 Days
                  </Typography>
                </Box>
                <LinearProgress
                  value={75}
                  variant="determinate"
                  sx={{
                    my: 1.5,
                    height: 8,
                    borderRadius: 6,
                    '& .MuiLinearProgress-bar': { borderRadius: 6 },
                  }}
                />
                <Typography variant="caption">
                  6 days remaining until your plan requires update
                </Typography>
              </div>
            </Grid> */}
            <Grid item xs={12}>
              <Box sx={{ mt: 3, gap: 4, display: 'flex', flexWrap: 'wrap' }}>
                {/* <Button
                  variant="contained"
                  onClick={() => setOpenPricingDialog(true)}
                >
                  Upgrade Plan
                </Button> */}
                <Button
                  variant="outlined"
                  color="error"
                  disabled={!isPlanActive}
                  onClick={() => setOpen(true)}
                >
                  Cancelar subscripción
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
        <DialogContent
          sx={{
            pb: (theme) => `${theme.spacing(6)} !important`,
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
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 6, color: 'warning.main' },
            }}
          >
            <Icon icon="mdi:alert-circle-outline" fontSize="5.5rem" />
            <Typography>Seguro que desea cancelar su subcripción?</Typography>
          </Box>
        </DialogContent>
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
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => handleConfirmation('yes')}
          >
            Si
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleConfirmation('cancel')}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="md"
        open={secondDialogOpen}
        onClose={handleSecondDialogClose}
      >
        <DialogContent
          sx={{
            pb: (theme) => `${theme.spacing(6)} !important`,
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 8,
                color: userInput === 'yes' ? 'success.main' : 'error.main',
              },
            }}
          >
            <Icon
              fontSize="5.5rem"
              icon={
                userInput === 'yes'
                  ? 'mdi:check-circle-outline'
                  : 'mdi:close-circle-outline'
              }
            />
            <Typography variant="h4" sx={{ mb: 5 }}>
              {userInput === 'yes'
                ? 'Suscripción Cancelada!'
                : 'Error al cancelar la subscripción'}
            </Typography>
            <Typography>
              {userInput === 'yes'
                ? 'Su subscripción ha sido cancelada!'
                : 'No se pudo cancelar la subscripción por favor inténtelo de nuevo o contactese con nuestro equipo de soporte: support@mseller.app'}
            </Typography>
          </Box>
        </DialogContent>
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
          <Button
            variant="contained"
            color="success"
            onClick={handleSecondDialogClose}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Dialog
        fullWidth
        scroll="body"
        maxWidth="lg"
        open={openPricingDialog}
        onClose={() => setOpenPricingDialog(false)}
        onBackdropClick={() => setOpenPricingDialog(false)}
      >
        <DialogContent
          sx={{
            position: 'relative',
            px: (theme) => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`,
            ],
            py: (theme) => [
              `${theme.spacing(8)} !important`,
              `${theme.spacing(12.5)} !important`,
            ],
          }}
        >
          <IconButton
            size="small"
            onClick={() => setOpenPricingDialog(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon="mdi:close" />
          </IconButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Find the right plan for your site
            </Typography>
            <Typography variant="body2">
              Get started with us - it's perfect for individuals and teams.
              Choose a subscription plan that meets your needs.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <InputLabel
              htmlFor="modal-pricing-switch"
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: 'text.secondary',
              }}
            >
              Monthly
            </InputLabel>
            <Switch
              onChange={handleChange}
              id="modal-pricing-switch"
              checked={plan === 'annually'}
            />
            <InputLabel
              htmlFor="modal-pricing-switch"
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: 'text.secondary',
              }}
            >
              Annually
            </InputLabel>
          </Box>
          <PricingPlans data={data} plan={plan} />
        </DialogContent>
      </Dialog> */}
    </>
  )
}

export default CurrentPlanCard
