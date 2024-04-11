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

import MenuItem from '@mui/material/MenuItem'

import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { DocumentType, TipoDocumentoEnum } from 'src/types/apps/documentTypes'
import formatDate from 'src/utils/formatDate'
import { useAuth } from 'src/hooks/useAuth'
import formatCurrency from 'src/utils/formatCurrency'
import {
  DocumentoEntregaResponse,
  ReporteEntregaMonto,
} from 'src/types/apps/transportType'
import {
  Button,
  FormControl,
  InputLabel,
  Link,
  TableFooter,
} from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

interface Props {
  data: ReporteEntregaMonto | null
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

  const sellerCode = router?.query?.sellerCode as string | null

  const customerType = router?.query?.customerType as string | null
  const getVariant = (param: string, value: string) =>
    router?.query?.[param] === value ? 'contained' : 'outlined'

  const enableClearBtn = Object.keys(router?.query).length > 1

  const pushPaymentFilter = React.useCallback(
    (paymentType: string) => {
      const rote = {
        pathname: `/apps/transports/printDeliveryReportAmount/[id]`,
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

  if (data) {
    const handleChange = (event: SelectChangeEvent) => {
      router
        .push({
          pathname: `/apps/transports/printDeliveryReportAmount/[id]`,
          query: {
            ...router.query,
            sellerCode: event.target.value,
          },
        })
        .then(() => {
          router.reload()
        })
    }

    const handleChangecustomerType = (event: SelectChangeEvent) => {
      router
        .push({
          pathname: `/apps/transports/printDeliveryReportAmount/[id]`,
          query: {
            ...router.query,
            customerType: event.target.value,
          },
        })
        .then(() => {
          router.reload()
        })
    }

    return (
      <div>
        <StyledGrid container sx={{ p: 3, pb: 6, width: '50em', gap: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h5">Filtros</Typography>
          </Grid>
          <Grid item xs={2.5}>
            <Button
              size="small"
              variant="contained"
              color="info"
              disabled={!enableClearBtn}
              href={`/apps/transports/printDeliveryReportAmount/${data.noTransporte}`}
            >
              Limpiar Filtro
            </Button>
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
                onChange={handleChangecustomerType}
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
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: 'black' }}
                      >
                        {data.distribuidor.codigo}-{data.distribuidor.nombre}
                      </Typography>
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
                          <Typography variant="h6">{`#${data.noTransporte}`}</Typography>
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
                    href={`/apps/transports/printDeliveryReportAmount/${data.noTransporte}`}
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
                      href={`/apps/transports/printDeliveryReportAmount/${data.noTransporte}/?paymentType=0`}
                    >
                      Efectivo
                    </a>
                  </CustomHeaderTableCell>
                  <CustomHeaderTableCell>
                    <a
                      href={`/apps/transports/printDeliveryReportAmount/${data.noTransporte}/?paymentType=1`}
                    >
                      Cheques
                    </a>
                  </CustomHeaderTableCell>
                  <CustomHeaderTableCell>
                    <a
                      href={`/apps/transports/printDeliveryReportAmount/${data.noTransporte}/?paymentType=2`}
                    >
                      Transferencia
                    </a>
                  </CustomHeaderTableCell>
                  <CustomHeaderTableCell>
                    <a
                      href={`/apps/transports/printDeliveryReportAmount/${data.noTransporte}/?paymentType=3`}
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
