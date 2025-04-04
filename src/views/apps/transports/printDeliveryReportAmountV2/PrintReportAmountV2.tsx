// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'
import { TextField } from '@mui/material'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

import MenuItem from '@mui/material/MenuItem'

import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { DocumentType, TipoDocumentoEnum } from 'src/types/apps/documentTypes'
import formatDate from 'src/utils/formatDate'
import { useAuth } from 'src/hooks/useAuth'
import formatCurrency from 'src/utils/formatCurrency'
import { ReporteEntregaMontoV2 } from 'src/types/apps/transportType'
import {
  Button,
  FormControl,
  InputLabel,
  Link,
  TableFooter,
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { DriverAutocomplete } from '@/views/ui/driverAutoComplete'
import LocationAutocomplete from '@/views/ui/locationAutoComplete'
import { CustomInput } from '@/views/ui/customInput'
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker'

interface Props {
  data: ReporteEntregaMontoV2 | null
}

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`,
}))

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2),
  },
}))

const CustomTableCell = styled(TableCell)<BoxProps>(({ theme }) => ({
  fontSize: '12px',
  padding: '0px',
  paddingTop: '1.2px',
  paddingBottom: '1.2px',
  color: 'black !important',
}))

const CustomHeaderTableCell = styled(TableCell)<BoxProps>(({ theme }) => ({
  fontSize: '12px',
  padding: '2px',
  fontWeight: 'bold',
  color: 'black !important',
}))

const StyledGrid = styled(Grid)(({ theme }) => ({
  '@media print': {
    display: 'none', // Hide the grid when printing
  },
}))

const PreviewCard = ({ data }: Props) => {
  // ** Hook
  const userData = useAuth()
  const router = useRouter()

  const [sellerCode, setSellerCode] = useState<string | null>(
    router?.query?.sellerCode as string | null,
  )
  const [customerType, setCustomerType] = useState<string | null>(
    router?.query?.customerType as string | null,
  )

  // Add state for drivers and locations
  const [drivers, setDrivers] = useState<string>('')
  const [locations, setLocations] = useState<string>('')

  // Add state for date range and noTransporte
  const [endDateRange, setEndDateRange] = useState<any>(null)
  const [dates, setDates] = useState<Date[]>([])
  const [startDateRange, setStartDateRange] = useState<any>(null)
  const [noTransporte, setNoTransporte] = useState<string>('')

  const getVariant = (param: string, value: string) =>
    router?.query?.[param] === value ? 'contained' : 'outlined'

  const enableClearBtn = Object.keys(router?.query).length > 1

  // Initialize values from URL parameters
  useEffect(() => {
    // Initialize drivers from URL
    const queryDrivers = router.query.distribuidores as string | undefined
    if (queryDrivers) {
      setDrivers(queryDrivers)
    }

    // Initialize locations from URL
    const queryLocations = router.query.locations as string | undefined
    if (queryLocations) {
      setLocations(queryLocations)
    }

    // Initialize DatePicker with fechaRango from URL
    const fechaRango = router.query.fechaRango as string | undefined
    if (fechaRango) {
      const [start, end] = fechaRango.split(',').map((date) => new Date(date))
      setStartDateRange(start)
      setEndDateRange(end)
      setDates([start, end])
    }

    // Initialize noTransporte from URL
    const queryNoTransporte = router.query.noTransporte as string | undefined
    if (queryNoTransporte) {
      setNoTransporte(queryNoTransporte)
    }
  }, [router.query])

  const pushPaymentFilter = React.useCallback(
    (paymentType: string) => {
      const rote = {
        pathname: `/apps/transports/printDeliveryReportAmountV2`,
        query: {
          ...router.query,
          paymentType,
        },
      }
      router.push(rote).then(() => {
        router.reload()
      })
    },
    [router],
  )

  // Modify the handler functions to only update state without routing
  const handleNoTransporteChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNoTransporte(event.target.value)
  }

  const handleDriverChange = (values: string) => {
    console.log('Driver selected:', values)
    setDrivers(values)
  }

  const handleLocationChange = (values: string) => {
    console.log('Location selected:', values)
    setLocations(values)
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const handleChange = (event: SelectChangeEvent) => {
    setSellerCode(event.target.value as string)
  }

  const handleChangeCustomerType = (event: SelectChangeEvent) => {
    setCustomerType(event.target.value as string)
  }

  // Add a new function to handle all filters at once
  const handleFilter = () => {
    let formattedDates = ''
    if (dates.length === 2) {
      formattedDates = dates
        .map((date) => date.toISOString().split('T')[0])
        .join(',')
    }

    router
      .push({
        pathname: `/apps/transports/printDeliveryReportAmountV2`,
        query: {
          ...router.query,
          noTransporte: noTransporte || undefined,
          distribuidores: drivers || undefined,
          locations: locations || undefined,
          fechaRango: formattedDates || undefined,
          sellerCode: sellerCode || undefined,
          customerType: customerType || undefined,
        },
      })
      .then(() => {
        router.reload()
      })
  }

  // Add a function to handle clearing all filters
  const handleClearFilters = () => {
    // Reset all filter states to their initial values
    setStartDateRange(null)
    setEndDateRange(null)
    setDates([])
    setDrivers('')
    setLocations('')
    setNoTransporte('')
    setSellerCode(null)
    setCustomerType(null)
  }

  if (data) {
    return (
      <div>
        <StyledGrid container sx={{ p: 3, pb: 6, width: '50em', gap: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h5">Filtros</Typography>
          </Grid>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6} sm={3}>
              <Button
                size="small"
                variant="contained"
                color="info"
                disabled={!enableClearBtn}
                onClick={handleClearFilters}
              >
                Limpiar Filtro
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={handleFilter}
              >
                Aplicar Filtros
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={1.6}>
            <Button
              size="small"
              variant={getVariant('paymentType', '0')}
              onClick={() => pushPaymentFilter('0')}
            >
              Efectivo
            </Button>
          </Grid>
          <Grid item xs={1.7}>
            <Button
              size="small"
              variant={getVariant('paymentType', '1')}
              onClick={() => pushPaymentFilter('1')}
            >
              Cheques
            </Button>
          </Grid>
          <Grid item xs={2.2}>
            <Button
              size="small"
              variant={getVariant('paymentType', '2')}
              onClick={() => pushPaymentFilter('2')}
            >
              Transferencia
            </Button>
          </Grid>
          <Grid item xs={1.6}>
            <Button
              size="small"
              variant={getVariant('paymentType', '3')}
              onClick={() => pushPaymentFilter('3')}
            >
              Crédito
            </Button>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              label="No Transporte"
              value={noTransporte}
              onChange={handleNoTransporteChange}
              fullWidth
              size="small"
            />
          </Grid>
          {/* Add Driver and Location Autocomplete components */}
          <Grid container>
            <Grid xs={12} sm={6} sx={{ mb: 2 }}>
              <DriverAutocomplete
                selectedDrivers={drivers}
                multiple={true}
                callBack={handleDriverChange}
                sx={{ mt: 0, ml: 0, mr: 2 }}
              />
            </Grid>
            <Grid xs={12} sm={6} sx={{ mb: 2 }}>
              <LocationAutocomplete
                selectedLocation={locations}
                multiple={true}
                callBack={handleLocationChange}
              />
            </Grid>
          </Grid>
          <Grid xs={12} sm={12}>
            <DatePickerWrapper>
              <DatePicker
                isClearable
                selectsRange
                monthsShown={2}
                endDate={endDateRange}
                selected={startDateRange}
                startDate={startDateRange}
                shouldCloseOnSelect={false}
                id="date-range-picker-months"
                onChange={handleOnChangeRange}
                customInput={
                  <CustomInput
                    dates={dates}
                    setDates={setDates}
                    label="Fecha"
                    end={endDateRange as number | Date}
                    start={startDateRange as number | Date}
                  />
                }
              />
            </DatePickerWrapper>
          </Grid>
          <Grid>
            <FormControl size="small">
              <InputLabel id="demo-simple-select-label">Vendedor</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sellerCode || ''}
                label="Vendedor"
                onChange={handleChange}
              >
                {data.vendedores.map((v) => (
                  <MenuItem value={v.codigo} key={v.codigo}>
                    {v.codigo}-{v.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <FormControl size="small">
              <InputLabel id="client-type-label">Tipo Cliente</InputLabel>
              <Select
                labelId="client-type-labell"
                id="client-type-select"
                value={customerType || ''}
                label="customerType"
                onChange={handleChangeCustomerType}
              >
                {data.tiposNcf.map((v) => (
                  <MenuItem value={v.tipoCliente} key={v.id}>
                    {v.descripcion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </StyledGrid>
        <Card sx={{ width: '50em' }}>
          <CardContent>
            <Grid container>
              <Grid item sm={6} xs={6} sx={{ mb: { sm: 0, xs: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2.5,
                    fontWeight: 600,
                    lineHeight: 'normal',
                    textTransform: 'uppercase',
                  }}
                >
                  {userData.user?.business.name}
                </Typography>
                <TableBody>
                  <TableRow></TableRow>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant="body2">Distribuidor:</Typography>
                    </MUITableCell>
                    <MUITableCell>
                      {data.distribuidores.map((distribuidor) => (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: 'black' }}
                          key={distribuidor.codigo}
                        >
                          {distribuidor.codigo}-{distribuidor.nombre}
                        </Typography>
                      ))}
                    </MUITableCell>
                  </TableRow>

                  <TableRow>
                    <MUITableCell>
                      <Typography variant="body2">Vendedores:</Typography>
                    </MUITableCell>
                    <MUITableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: 'black' }}
                      >
                        {data.vendedores
                          .filter((f) =>
                            sellerCode ? f.codigo === sellerCode : (f = f),
                          )
                          .map((c) => (
                            <Typography
                              variant="caption"
                              sx={{ mr: 0.9, color: 'black' }}
                            >
                              {c.codigo.trim()}-{c.nombre.trimEnd()} |
                            </Typography>
                          ))}
                      </Typography>
                    </MUITableCell>
                  </TableRow>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant="body2">
                        Total Documentos:{' '}
                      </Typography>
                    </MUITableCell>
                    <MUITableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: 'black' }}
                      >
                        {data.totalDocumentos}
                      </Typography>
                    </MUITableCell>
                  </TableRow>
                </TableBody>
              </Grid>
              <Grid item sm={6} xs={6}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                    color: 'black',
                  }}
                >
                  <Table sx={{ maxWidth: '290px' }}>
                    <TableBody>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant="h6">Transporte</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          {data.noTransportes.map((noTransporte, index) => (
                            <Typography variant="h6" key={index}>
                              {`#${noTransporte}`}
                            </Typography>
                          ))}
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant="body2">Fecha:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: 'black' }}
                          >
                            {formatDate(data.fecha)}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant="body2">Tipo:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600, color: 'black' }}
                          >
                            {data.tiposNcf.find(
                              (d) => d.tipoCliente === customerType,
                            )?.descripcion || '-'}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          </CardContent>

          <div>
            <Typography variant="body1" sx={{ mr: 2, fontWeight: 600 }}>
              Clientes
            </Typography>
            <Box sx={{ mb: 2 }}>
              {data.clientes.map((c) => (
                <Typography variant="caption" sx={{ mr: 0.9, color: 'black' }}>
                  {c.codigo.trim()}-{c.nombre.trimEnd()} |
                </Typography>
              ))}
            </Box>
          </div>
          <div>
            <Typography variant="body1" sx={{ mr: 2, fontWeight: 600 }}>
              Documentos Entregas
            </Typography>
            <Box sx={{ mb: 2 }}>
              {data.documentosEntregas?.map((d) => (
                <Typography variant="caption" sx={{ mr: 0.9, color: 'black' }}>
                  {d.trim()} |
                </Typography>
              ))}
            </Box>
          </div>
          <Divider />

          <Divider />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <CustomHeaderTableCell>Código</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Descripción</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Cant.</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Un</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Precio</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Bruto</CustomHeaderTableCell>
                  <CustomHeaderTableCell>% Desc.</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Desc.</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Imp.</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Neto</CustomHeaderTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.detalle.map((detalle) => (
                  <TableRow key={detalle.codigoProducto}>
                    <CustomTableCell>{detalle.codigoProducto}</CustomTableCell>
                    <CustomTableCell>
                      {detalle.productoDetalle.descripcion}
                    </CustomTableCell>
                    <CustomTableCell>{detalle.cantidad}</CustomTableCell>
                    <CustomTableCell>
                      {detalle.productoDetalle.unidad}
                    </CustomTableCell>
                    <CustomTableCell>
                      {formatCurrency(detalle.precio)}
                    </CustomTableCell>
                    <CustomTableCell>
                      {formatCurrency(detalle.bruto)}
                    </CustomTableCell>
                    <CustomTableCell>
                      {detalle.porcientoDescuento}%
                    </CustomTableCell>
                    <CustomTableCell>
                      {formatCurrency(detalle.descuento)}
                    </CustomTableCell>
                    <CustomTableCell>
                      {formatCurrency(detalle.impuesto)}
                    </CustomTableCell>
                    <CustomTableCell>
                      {formatCurrency(detalle.subTotal)}
                    </CustomTableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <CustomHeaderTableCell></CustomHeaderTableCell>
                <CustomHeaderTableCell></CustomHeaderTableCell>
                <CustomHeaderTableCell></CustomHeaderTableCell>
                <CustomHeaderTableCell></CustomHeaderTableCell>
                <CustomHeaderTableCell></CustomHeaderTableCell>
                <CustomHeaderTableCell></CustomHeaderTableCell>
                <CustomHeaderTableCell></CustomHeaderTableCell>
                <CustomHeaderTableCell></CustomHeaderTableCell>
                <CustomHeaderTableCell>Total:</CustomHeaderTableCell>
                <CustomHeaderTableCell>
                  <a
                    href={`/apps/transports/printDeliveryReportAmountV2?${data.noTransportes.join(
                      ',',
                    )}`}
                  >
                    {formatCurrency(data.neto)}
                  </a>
                </CustomHeaderTableCell>
              </TableFooter>
            </Table>
          </TableContainer>
          <br />
          <br />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <CustomHeaderTableCell>
                    <a
                      href={`/apps/transports/printDeliveryReportAmountV2?noTransporte=${data.noTransportes.join(
                        ',',
                      )}?paymentType=0`}
                    >
                      Efectivo
                    </a>
                  </CustomHeaderTableCell>
                  <CustomHeaderTableCell>
                    <a
                      href={`/apps/transports/printDeliveryReportAmountV2?noTransporte=${data.noTransportes.join(
                        ',',
                      )}&paymentType=1`}
                    >
                      Cheques
                    </a>
                  </CustomHeaderTableCell>
                  <CustomHeaderTableCell>
                    <a
                      href={`/apps/transports/printDeliveryReportAmountV2?noTransporte=${data.noTransportes.join(
                        ',',
                      )}&paymentType=2`}
                    >
                      Transferencia
                    </a>
                  </CustomHeaderTableCell>
                  <CustomHeaderTableCell>
                    <a
                      href={`/apps/transports/printDeliveryReportAmountV2?noTransporte=${data.noTransportes.join(
                        ',',
                      )}&paymentType=3`}
                    >
                      Crédito
                    </a>
                  </CustomHeaderTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <CustomTableCell>
                    {formatCurrency(data.efectivo)}
                  </CustomTableCell>
                  <CustomTableCell>
                    {formatCurrency(data.cheque)}
                  </CustomTableCell>
                  <CustomTableCell>
                    {formatCurrency(data.transferencia)}
                  </CustomTableCell>
                  <CustomTableCell>
                    {formatCurrency(data.credito)}
                  </CustomTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </div>
    )
  } else {
    return null
  }
}

export default PreviewCard
