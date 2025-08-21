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
import { Checkbox, FormControlLabel, TextField } from '@mui/material'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Types
import formatDate from 'src/utils/formatDate'
import { useAuth } from 'src/hooks/useAuth'
import { ReporteEntrega } from 'src/types/apps/transportType'
import { Button, TableFooter } from '@mui/material'
import { useRouter } from 'next/router'
import React, { use, useEffect, useState } from 'react'
import { DriverAutocomplete } from '@/views/ui/driverAutoComplete'
import LocationAutocomplete from '@/views/ui/locationAutoComplete'
import { CustomInput } from '@/views/ui/customInput'
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker'

interface Props {
  data: ReporteEntrega | null
}

const StyledGrid = styled(Grid)(({ theme }) => ({
  '@media print': {
    display: 'none', // Hide the grid when printing
  },
}))

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`,
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

const PreviewCard = ({ data }: Props) => {
  // ** Hook
  const theme = useTheme()
  const userData = useAuth()
  const router = useRouter()
  const [endDateRange, setEndDateRange] = useState<any>(null)
  const [dates, setDates] = useState<Date[]>([])
  const [startDateRange, setStartDateRange] = useState<any>(null)
  const [drivers, setDrivers] = useState<string>('')
  const [locations, setLocations] = useState<string>('')
  const [promocionesOnly, setPromocionesOnly] = useState<boolean>(false)
  const [noTransporte, setNoTransporte] = useState<string>('')

  const enableClearBtn = true

  useEffect(() => {
    // Initialize DatePicker with fechaRango from URL
    const fechaRango = router.query.fechaRango as string | undefined
    if (fechaRango) {
      const [start, end] = fechaRango.split(',').map((date) => new Date(date))
      setStartDateRange(start)
      setEndDateRange(end)
      setDates([start, end])
    }

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

    // Initialize promocionesOnly from URL
    const queryPromocionesOnly = router.query.promocionesOnly === 'true'
    setPromocionesOnly(queryPromocionesOnly)

    // Initialize noTransporte from URL
    const queryNoTransporte = router.query.noTransporte as string | undefined
    if (queryNoTransporte) {
      setNoTransporte(queryNoTransporte)
    }
  }, [])

  const handlePromocionesOnlyChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPromocionesOnly(event.target.checked)
  }

  const handleNoTransporteChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNoTransporte(event.target.value)
  }

  const handleClearFilters = () => {
    // Reset date states to today
    setStartDateRange(null)
    setEndDateRange(null)
    setDates([])

    // Reset other filter states
    setDrivers('')
    setLocations('')
    setPromocionesOnly(true)
    setNoTransporte('')
  }

  if (data) {
    const handleDriverChange = (values: string) => {
      console.log('Driver selected:', values) // Log the selected driver(s)
      setDrivers(values)
    }

    const handleLocationChange = (values: string) => {
      console.log('Location selected:', values) // Log the selected location(s)
      setLocations(values)
    }

    const handleFilter = () => {
      const formattedDates = dates
        .map((date) => date.toISOString().split('T')[0])
        .join(',')
      if (
        dates.length > 0 ||
        drivers ||
        locations ||
        promocionesOnly ||
        noTransporte
      ) {
        router
          .push({
            pathname: `/apps/transports/print`,
            query: {
              ...router.query,
              fechaRango: formattedDates,
              distribuidores: drivers || '',
              locations: locations || '',
              promocionesOnly: promocionesOnly ? 'true' : 'false',
              noTransporte: noTransporte || '',
            },
          })
          .then(() => {
            router.reload()
          })
      } else {
        alert('Por favor, seleccione al menos un filtro antes de filtrar.')
      }
    }

    const handleOnChangeRange = (dates: any) => {
      const [start, end] = dates
      if (start !== null && end !== null) {
        setDates(dates)
      }
      setStartDateRange(start)
      setEndDateRange(end)
    }

    return (
      <div>
        <DatePickerWrapper>
          <StyledGrid container sx={{ p: 3, pb: 6, width: '50em', gap: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h5">Filtros</Typography>
            </Grid>
            <Grid container xs={12}>
              <Grid item xs={2}>
                <Button
                  size="small"
                  variant="outlined"
                  color="info"
                  disabled={!enableClearBtn}
                  onClick={handleClearFilters}
                >
                  Limpiar Filtro
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  disabled={!enableClearBtn}
                  onClick={handleFilter}
                >
                  Filtrar
                </Button>
              </Grid>
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
            <Grid container>
              <Grid xs={12} sm={6}>
                <DriverAutocomplete
                  selectedDrivers={drivers} // Pass the selected drivers to the component
                  multiple={true}
                  callBack={handleDriverChange}
                  sx={{ mt: 0, ml: 0, mr: 2 }} // Allow overriding default styles
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <LocationAutocomplete
                  selectedLocation={locations} // Pass the selected locations to the component
                  multiple={true}
                  callBack={handleLocationChange}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12}>
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
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={promocionesOnly}
                    onChange={handlePromocionesOnlyChange}
                    color="primary"
                  />
                }
                label="Solo Promociones"
              />
            </Grid>
          </StyledGrid>
        </DatePickerWrapper>
        <Card sx={{ width: '50em' }}>
          <CardContent sx={{ pt: 0, pb: 2 }}>
            <Grid container>
              <Grid item sm={6} xs={6} sx={{ mb: { sm: 0, xs: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2.5,
                    fontWeight: 600,
                    lineHeight: 'normal',
                    textTransform: 'uppercase',
                    color: 'black',
                  }}
                >
                  {userData.user?.business.name}
                </Typography>
                <TableBody>
                  <TableRow></TableRow>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant="body2" sx={{ color: 'black' }}>
                        Distribuidores:
                      </Typography>
                    </MUITableCell>
                    <MUITableCell>
                      {data.distribuidores.map((distribuidor) => (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: 'black' }}
                        >
                          {distribuidor.codigo}-{distribuidor.nombre}
                        </Typography>
                      ))}
                    </MUITableCell>
                  </TableRow>
                </TableBody>
              </Grid>
              <Grid item sm={6} xs={6}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                  }}
                >
                  <Table sx={{ maxWidth: '290px' }}>
                    <TableBody>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant="h6" sx={{ color: 'black' }}>
                            Transporte
                          </Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant="h6" sx={{ color: 'black' }}>
                            {Array.isArray(data.noTransporte)
                              ? `#${data.noTransporte.join(', #')}`
                              : `#${data.noTransporte}`}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant="body2" sx={{ color: 'black' }}>
                            Fecha:
                          </Typography>
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
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <CardContent sx={{ pt: 0, pb: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mb: 0, color: 'black' }}
            >
              Total de entregas: ({data.documentosEntregas.length})
            </Typography>
          </CardContent>
          <CardContent sx={{ pt: 0, pb: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mb: 0, color: 'black' }}
            >
              Documentos Entregados ({data.documentosEntregados.length})
              {promocionesOnly ? ' (Con Promociones)' : ''}:
            </Typography>
            <Typography variant="body2" sx={{ color: 'black' }}>
              {data.documentosEntregados.map((doc, index) => (
                <span key={index}>
                  {doc}
                  {index < data.documentosEntregados.length - 1 && ', '}
                </span>
              ))}
            </Typography>
          </CardContent>
          <CardContent sx={{ pt: 0, pb: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mb: 0, color: 'black' }}
            >
              Documentos No Entregados ({data.documentosNoEntregados.length})
              {promocionesOnly ? ' (Con Promociones)' : ''}:
            </Typography>
            <Typography variant="body2" sx={{ color: 'black' }}>
              {data.documentosNoEntregados.map((doc, index) => (
                <span key={index}>
                  {doc}
                  {index < data.documentosNoEntregados.length - 1 && ', '}
                </span>
              ))}
            </Typography>
          </CardContent>

          <Divider />

          <Divider />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <CustomHeaderTableCell>Código</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Descripción</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Un</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Recibida</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Vendidas</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Devolver</CustomHeaderTableCell>
                  <CustomHeaderTableCell>Promoción</CustomHeaderTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.detalle.map((detalle) => (
                  <TableRow key={detalle.codigoProducto}>
                    <CustomTableCell>{detalle.codigoProducto}</CustomTableCell>
                    <CustomTableCell>
                      {detalle.productoDetalle.descripcion}
                    </CustomTableCell>
                    <CustomTableCell>
                      {detalle.productoDetalle.unidad}
                    </CustomTableCell>
                    <CustomTableCell>{detalle.recibidas}</CustomTableCell>
                    <CustomTableCell>{detalle.vendidas}</CustomTableCell>
                    <CustomTableCell>{detalle.devolver}</CustomTableCell>
                    <CustomTableCell>
                      {detalle.promocion ? 'Si' : '-'}
                    </CustomTableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <CustomHeaderTableCell></CustomHeaderTableCell>
                <CustomHeaderTableCell></CustomHeaderTableCell>
                <CustomHeaderTableCell>Total:</CustomHeaderTableCell>
                <CustomHeaderTableCell>
                  {data.detalle.reduce((acc, c) => acc + c.recibidas, 0)}
                </CustomHeaderTableCell>
                <CustomHeaderTableCell>
                  {data.detalle.reduce((acc, c) => acc + c.vendidas, 0)}
                </CustomHeaderTableCell>
                <CustomHeaderTableCell>
                  {data.detalle.reduce((acc, c) => acc + c.devolver, 0)}
                </CustomHeaderTableCell>
              </TableFooter>
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
