'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

// Component Imports
//import Link from '@components/Link'
import CustomTabList from '@core/components/mui/TabList'

// Styled Component Imports
//import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import Icon from 'src/@core/components/icon'
import { Box, Stack } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const ProductInventory = () => {
  // States
  const [activeTab, setActiveTab] = useState('restock')

  const store = useSelector((state: RootState) => state.products)

  // Hooks
  const theme = useTheme()
  const isBelowMdScreen = useMediaQuery(theme.breakpoints.down('md'))

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <Card>
      <CardHeader title="Inventario" />
      <CardContent>
        <TabContext value={activeTab}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <CustomTabList
                color="primary"
                orientation="vertical"
                onChange={handleChange}
                pill="true"
              >
                <Tab
                  value="restock"
                  label="Almacenes"
                  icon={
                    <Icon icon="mdi:box-variant-closed" fontSize="inherit" />
                  }
                  iconPosition="start"
                  className="flex-row justify-start min-is-full text-start"
                />
                {/* <Tab
                  value="shipping"
                  label="Shipping"
                  icon={<i className="ri-car-line" />}
                  iconPosition="start"
                  className="flex-row justify-start min-is-full text-start"
                />
                <Tab
                  value="global-delivery"
                  label="Global Delivery"
                  icon={<i className="ri-global-line" />}
                  iconPosition="start"
                  className="flex-row justify-start min-is-full text-start"
                />
                <Tab
                  value="attributes"
                  label="Attributes"
                  icon={<i className="ri-link-m" />}
                  iconPosition="start"
                  className="flex-row justify-start min-is-full text-start"
                />
                <Tab
                  value="advanced"
                  label="Advanced"
                  icon={<i className="ri-lock-unlock-line" />}
                  iconPosition="start"
                  className="flex-row justify-start min-is-full text-start"
                /> */}
              </CustomTabList>
            </Grid>
            <Divider
              orientation={isBelowMdScreen ? 'horizontal' : 'vertical'}
              flexItem
            />
            <Grid item xs={12} md={7}>
              {/* TODO: Future feature handle stocks */}
              <TabPanel value="restock">
                <Typography className="font-medium">Cantidades</Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    disabled
                    fullWidth
                    label="Agregar Cantidad"
                    placeholder="100"
                    size="small"
                  />
                  <Button
                    disabled
                    variant="contained"
                    startIcon={<Icon icon="ri-check-line" />}
                  >
                    Confirmar
                  </Button>
                </Stack>
                <Box sx={{ m: 2 }}>
                  <Typography color="text.primary">
                    Inventario actual:{' '}
                    {store?.productDetail?.existenciaAlmacen1 || 0}
                  </Typography>
                </Box>
              </TabPanel>
              {/* <TabPanel value="shipping">
                <div className="flex flex-col gap-4">
                  <Typography className="font-medium">Shipping Type</Typography>
                  <RadioGroup
                    name="radio-buttons-group"
                    defaultValue="seller"
                    className="items-start gap-4"
                    aria-labelledby="shipping-type-radio-buttons-group-label"
                  >
                    <FormControlLabel
                      value="seller"
                      control={<Radio className="self-start" />}
                      label={
                        <>
                          <Typography
                            className="font-medium"
                            color="text.primary"
                          >
                            Fulfilled by Seller
                          </Typography>
                          <Typography variant="body2">
                            You&apos;ll be responsible for product delivery. Any
                            damage or delay during shipping may cost you a
                            Damage fee
                          </Typography>
                        </>
                      }
                    />
                    <FormControlLabel
                      value="company"
                      control={<Radio className="self-start" />}
                      label={
                        <>
                          <Typography
                            className="font-medium"
                            color="text.primary"
                          >
                            Fulfilled by Company name
                          </Typography>
                          <Typography variant="body2">
                            Your product, Our responsibility.For a measly fee,
                            we will handle the delivery process for you.
                          </Typography>
                        </>
                      }
                    />
                  </RadioGroup>
                </div>
              </TabPanel>
              <TabPanel value="global-delivery">
                <div className="flex flex-col gap-4">
                  <Typography className="font-medium">
                    Global Delivery
                  </Typography>
                  <RadioGroup
                    name="radio-buttons-group"
                    defaultValue="worldwide"
                    className="items-start gap-4"
                    aria-labelledby="global-delivery-radio-buttons-group-label"
                  >
                    <FormControlLabel
                      value="worldwide"
                      control={<Radio className="self-start" />}
                      label={
                        <>
                          <Typography
                            className="font-medium"
                            color="text.primary"
                          >
                            Worldwide delivery
                          </Typography>
                          <Typography variant="body2">
                            Only available with Shipping method:{' '}
                            <Link className="text-primary">
                              Fulfilled by Company name
                            </Link>
                          </Typography>
                        </>
                      }
                    />
                    <FormControlLabel
                      value="selected"
                      control={<Radio className="self-start" />}
                      label={
                        <>
                          <Typography
                            className="font-medium"
                            color="text.primary"
                          >
                            Selected Countries
                          </Typography>
                          <TextField placeholder="USA" size="small" />
                        </>
                      }
                    />
                    <FormControlLabel
                      value="local"
                      control={<Radio className="self-start" />}
                      label={
                        <>
                          <Typography
                            className="font-medium"
                            color="text.primary"
                          >
                            Local delivery
                          </Typography>
                          <Typography variant="body2">
                            Deliver to your country of residence{' '}
                            <Link className="text-primary">
                              Change profile address
                            </Link>
                          </Typography>
                        </>
                      }
                    />
                  </RadioGroup>
                </div>
              </TabPanel>
              <TabPanel value="attributes">
                <FormGroup className="items-start">
                  <Typography className="font-medium mbe-2">
                    Attributes
                  </Typography>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={
                      <Typography className="font-medium" color="text.primary">
                        Fragile Product
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    className="mbe-2"
                    label={
                      <Typography className="font-medium" color="text.primary">
                        Biodegradable
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    className="mbe-4"
                    label={
                      <>
                        <Typography
                          className="font-medium"
                          color="text.primary"
                        >
                          Frozen Product
                        </Typography>
                        <TextField placeholder="40 C" size="small" />
                      </>
                    }
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label={
                      <>
                        <Typography
                          className="font-medium"
                          color="text.primary"
                        >
                          Expiry Date of Product
                        </Typography>
                        <AppReactDatepicker
                          selected={date}
                          onChange={(date: Date | null) => setDate(date)}
                          placeholderText="MM/DD/YYYY"
                          customInput={<TextField fullWidth size="small" />}
                        />
                      </>
                    }
                  />
                </FormGroup>
              </TabPanel>
              <TabPanel value="advanced">
                <FormGroup className="flex flex-col gap-4">
                  <Typography className="font-medium">Advanced</Typography>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={7}>
                      <FormControl fullWidth>
                        <InputLabel size="small">Product ID Type</InputLabel>
                        <Select
                          size="small"
                          label="Product ID Type"
                          defaultValue="ISBN"
                        >
                          <MenuItem value="ISBN">ISBN</MenuItem>
                          <MenuItem value="UPC">UPC</MenuItem>
                          <MenuItem value="EAN">EAN</MenuItem>
                          <MenuItem value="JAN">JAN</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={5}>
                      <TextField
                        fullWidth
                        label="Product ID"
                        placeholder="100023"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </TabPanel> */}
            </Grid>
          </Grid>
        </TabContext>
      </CardContent>
    </Card>
  )
}

export default ProductInventory
