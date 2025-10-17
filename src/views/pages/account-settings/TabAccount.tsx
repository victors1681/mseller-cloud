// ** React Imports
import { ChangeEvent, ElementType, useEffect, useRef, useState } from 'react'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form'

// ** Icon Imports
import Avatar from '@mui/material/Avatar'
import Icon from 'src/@core/components/icon'
import { IUpdateUserProfileProps } from 'src/firebase'
import { useFirebase } from 'src/firebase/useFirebase'
import { useAuth } from 'src/hooks/useAuth'
import { countryList } from 'src/utils/countryList'
import RemoveDataForm from './removeData/RemoveData'

interface Data {
  email: string
  city: string
  address: string
  country: string
  lastName: string
  phone: string
  // language: string
  // timezone: string
  firstName: string
  organization: string
  rnc: string
  website: string
  // zipCode: number | string
}

const initialData: Data = {
  city: '',
  phone: '',
  address: '',
  lastName: '',
  firstName: '',
  country: '',
  email: '',
  organization: '',
  rnc: '',
  website: '',
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: 4,
  marginRight: theme.spacing(5),
}))

const ButtonStyled = styled(Button)<
  ButtonProps & { component?: ElementType; htmlFor?: string }
>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center',
  },
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4),
  },
}))

const TabAccount = () => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [userInput, setUserInput] = useState<string>('yes')
  const [formData, setFormData] = useState<Data>(initialData)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false)
  const [selectedImageFile, setSelectedImageFile] = useState<string | null>(
    null,
  )
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false)

  // ** Hooks
  const { user } = useAuth()
  const { updateUserProfile, uploadImages } = useFirebase()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const initialData: Data = {
      phone: user?.business.phone || '',
      address: user?.business.address.street || '',
      city: user?.business.address.city || '',
      country: user?.business.address.country || '',
      lastName: user?.lastName || '',
      firstName: user?.firstName || '',
      email: user?.email || '',
      organization: user?.business.name || '',
      rnc: user?.business.rnc || '',
      website: user?.business.website || '',
    }
    setFormData(initialData)
  }, [user])
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { checkbox: false } })

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const onSubmit = () => setOpen(true)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.userId) {
      setUpdateError('User ID not found. Please try logging in again.')
      return
    }

    setIsUpdating(true)
    setUpdateError(null)
    setUpdateSuccess(false)

    try {
      let photoURL = user.photoURL // Keep existing photo URL by default

      // Step 1: Upload image if a new one is selected
      if (selectedImageFile) {
        setIsImageUploading(true)

        const imageUploadData = {
          images: [selectedImageFile],
          type: 'profile' as const,
        }

        const uploadResult = await uploadImages(imageUploadData)

        if (uploadResult && 'error' in uploadResult) {
          setUpdateError(`Error uploading image: ${uploadResult.error}`)
          return
        } else if (
          uploadResult &&
          'uploads' in uploadResult &&
          uploadResult.uploads.length > 0
        ) {
          // Use the original URL from the uploaded image
          photoURL = uploadResult.uploads[0].originalUrl
        } else {
          setUpdateError('Error uploading image. Please try again.')
          return
        }

        setIsImageUploading(false)
      }

      // Step 2: Update user profile with form data and photo URL
      const updateData: IUpdateUserProfileProps = {
        userId: user.userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        photoURL: photoURL, // Include the photo URL (either existing or newly uploaded)
        business: {
          name: formData.organization,
          rnc: formData.rnc,
          website: formData.website,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            country: formData.country,
          },
        },
      }

      const result = await updateUserProfile(updateData)

      if (result && 'error' in result) {
        setUpdateError(result.error)
      } else {
        setUpdateSuccess(true)
        setSelectedImageFile(null) // Clear selected image after successful update
        setTimeout(() => setUpdateSuccess(false), 3000) // Hide success message after 3 seconds
      }
    } catch (error) {
      setUpdateError('Error updating profile. Please try again.')
    } finally {
      setIsUpdating(false)
      setIsImageUploading(false)
    }
  }

  const handleConfirmation = (value: string) => {
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }

  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => {
        const result = reader.result as string
        setImgSrc(result) // Update preview
        setSelectedImageFile(result) // Store for upload
      }
      reader.readAsDataURL(files[0])
    }
  }
  const handleInputImageReset = () => {
    setImgSrc(user?.photoURL || '/images/avatars/1.png')
    setSelectedImageFile(null) // Clear selected image
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }
  console.log(user?.photoURL)
  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <form onSubmit={handleUpdateProfile}>
            <CardContent sx={{ pb: (theme) => `${theme.spacing(10)}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* <ImgStyled src={user?.photoURL || imgSrc} alt="Profile Pic" /> */}
                <Avatar
                  alt={`${user?.firstName} ${user?.lastName}`}
                  sx={{
                    width: 120,
                    height: 120,
                    marginRight: 10,
                  }}
                  src={selectedImageFile ? imgSrc : user?.photoURL}
                />
                <div>
                  <ButtonStyled
                    component="label"
                    variant="contained"
                    htmlFor="account-settings-upload-image"
                    disabled={isUpdating || isImageUploading}
                  >
                    {selectedImageFile
                      ? 'Cambiar imagen'
                      : 'Cargar nueva imagen'}
                    <input
                      hidden
                      type="file"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg"
                      onChange={handleInputImageChange}
                      id="account-settings-upload-image"
                    />
                  </ButtonStyled>
                  <ResetButtonStyled
                    color="secondary"
                    variant="outlined"
                    onClick={handleInputImageReset}
                    disabled={isUpdating || isImageUploading}
                  >
                    Restaurar
                  </ResetButtonStyled>
                  <Typography
                    variant="caption"
                    sx={{ mt: 4, display: 'block', color: 'text.disabled' }}
                  >
                    Permitido PNG or JPEG. Max size of 800K.
                    {selectedImageFile && (
                      <Box
                        component="span"
                        sx={{ color: 'success.main', display: 'block', mt: 1 }}
                      >
                        ✓ Nueva imagen seleccionada
                      </Box>
                    )}
                  </Typography>
                </div>
              </Box>
            </CardContent>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    placeholder=""
                    value={formData.firstName}
                    onChange={(e) =>
                      handleFormChange('firstName', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellido"
                    placeholder=""
                    value={formData.lastName}
                    onChange={(e) =>
                      handleFormChange('lastName', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    disabled
                    value={formData.email}
                    placeholder=""
                    onChange={(e) => handleFormChange('email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Organización"
                    placeholder=""
                    value={formData.organization}
                    onChange={(e) =>
                      handleFormChange('organization', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="RNC"
                    placeholder=""
                    value={formData.rnc}
                    onChange={(e) => handleFormChange('rnc', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Página Web"
                    placeholder=""
                    value={formData.website}
                    onChange={(e) =>
                      handleFormChange('website', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="phone"
                    label="Teléfono"
                    value={formData.phone}
                    placeholder="202 555 0111"
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) =>
                      handleFormChange('address', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ciudad"
                    placeholder=""
                    value={formData.city}
                    onChange={(e) => handleFormChange('city', e.target.value)}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Zip Code"
                    placeholder="231465"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleFormChange('zipCode', e.target.value)
                    }
                  />
                </Grid> */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>País</InputLabel>
                    <Select
                      label="Country"
                      value={formData.country}
                      onChange={(e) =>
                        handleFormChange('country', e.target.value)
                      }
                    >
                      {countryList.map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      label="Language"
                      value={formData.language}
                      onChange={(e) =>
                        handleFormChange('language', e.target.value)
                      }
                    >
                      <MenuItem value="arabic">Arabic</MenuItem>
                      <MenuItem value="english">English</MenuItem>
                      <MenuItem value="french">French</MenuItem>
                      <MenuItem value="german">German</MenuItem>
                      <MenuItem value="portuguese">Portuguese</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}
                {/* <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      label="Timezone"
                      value={formData.timezone}
                      onChange={(e) =>
                        handleFormChange('timezone', e.target.value)
                      }
                    >
                      <MenuItem value="gmt-12">
                        (GMT-12:00) International Date Line West
                      </MenuItem>
                      <MenuItem value="gmt-11">
                        (GMT-11:00) Midway Island, Samoa
                      </MenuItem>
                      <MenuItem value="gmt-10">(GMT-10:00) Hawaii</MenuItem>
                      <MenuItem value="gmt-09">(GMT-09:00) Alaska</MenuItem>
                      <MenuItem value="gmt-08">
                        (GMT-08:00) Pacific Time (US & Canada)
                      </MenuItem>
                      <MenuItem value="gmt-08-baja">
                        (GMT-08:00) Tijuana, Baja California
                      </MenuItem>
                      <MenuItem value="gmt-07">
                        (GMT-07:00) Chihuahua, La Paz, Mazatlan
                      </MenuItem>
                      <MenuItem value="gmt-07-mt">
                        (GMT-07:00) Mountain Time (US & Canada)
                      </MenuItem>
                      <MenuItem value="gmt-06">
                        (GMT-06:00) Central America
                      </MenuItem>
                      <MenuItem value="gmt-06-ct">
                        (GMT-06:00) Central Time (US & Canada)
                      </MenuItem>
                      <MenuItem value="gmt-06-mc">
                        (GMT-06:00) Guadalajara, Mexico City, Monterrey
                      </MenuItem>
                      <MenuItem value="gmt-06-sk">
                        (GMT-06:00) Saskatchewan
                      </MenuItem>
                      <MenuItem value="gmt-05">
                        (GMT-05:00) Bogota, Lima, Quito, Rio Branco
                      </MenuItem>
                      <MenuItem value="gmt-05-et">
                        (GMT-05:00) Eastern Time (US & Canada)
                      </MenuItem>
                      <MenuItem value="gmt-05-ind">
                        (GMT-05:00) Indiana (East)
                      </MenuItem>
                      <MenuItem value="gmt-04">
                        (GMT-04:00) Atlantic Time (Canada)
                      </MenuItem>
                      <MenuItem value="gmt-04-clp">
                        (GMT-04:00) Caracas, La Paz
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}
                {/* <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      label="Currency"
                      value={formData.currency}
                      onChange={(e) =>
                        handleFormChange('currency', e.target.value)
                      }
                    >
                      <MenuItem value="usd">USD</MenuItem>
                      <MenuItem value="eur">EUR</MenuItem>
                      <MenuItem value="pound">Pound</MenuItem>
                      <MenuItem value="bitcoin">Bitcoin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}

                {/* Error Message */}
                {updateError && (
                  <Grid item xs={12}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {updateError}
                    </Alert>
                  </Grid>
                )}

                {/* Success Message */}
                {updateSuccess && (
                  <Grid item xs={12}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      ¡Perfil actualizado exitosamente!
                    </Alert>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mr: 4 }}
                    disabled={isUpdating || isImageUploading}
                    startIcon={
                      isUpdating || isImageUploading ? (
                        <CircularProgress size={20} />
                      ) : null
                    }
                  >
                    {isImageUploading
                      ? 'Subiendo imagen...'
                      : isUpdating
                      ? 'Guardando perfil...'
                      : 'Guardar Cambios'}
                  </Button>
                  <Button
                    type="reset"
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setFormData(initialData)
                      handleInputImageReset()
                    }}
                    disabled={isUpdating || isImageUploading}
                  >
                    Restaurar
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>

      {/* Delete Account Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Eliminar Informaciones" />
          <CardContent>
            <RemoveDataForm />
          </CardContent>
        </Card>
      </Grid>

      {/* Delete Account Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Eliminar Cuenta" />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 4 }}>
                <FormControl>
                  <Controller
                    name="checkbox"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormControlLabel
                        label="Confirmar para eliminar todos los datos de mi cuenta"
                        sx={
                          errors.checkbox
                            ? {
                                '& .MuiTypography-root': {
                                  color: 'error.main',
                                },
                              }
                            : null
                        }
                        control={
                          <Checkbox
                            {...field}
                            size="small"
                            name="validation-basic-checkbox"
                            sx={
                              errors.checkbox ? { color: 'error.main' } : null
                            }
                          />
                        }
                      />
                    )}
                  />
                  {errors.checkbox && (
                    <FormHelperText
                      sx={{ color: 'error.main' }}
                      id="validation-basic-checkbox"
                    >
                      Por favor confirmar que deseas eliminar tu cuenta
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Button
                variant="contained"
                color="error"
                type="submit"
                disabled={errors.checkbox !== undefined}
              >
                Borrar mi cuenta de usuario y datos de empresa
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>

      {/* Deactivate Account Dialogs */}
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
            <Typography>
              Are you sure you would like to cancel your subscription?
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
            sx={{ mr: 2 }}
            onClick={() => handleConfirmation('yes')}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleConfirmation('cancel')}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="xs"
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
              {userInput === 'yes' ? 'Deleted!' : 'Cancelled'}
            </Typography>
            <Typography>
              {userInput === 'yes'
                ? 'Your subscription cancelled successfully.'
                : 'Unsubscription Cancelled!!'}
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
    </Grid>
  )
}

export default TabAccount
