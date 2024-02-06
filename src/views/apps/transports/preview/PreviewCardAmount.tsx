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
import Image from 'next/image'

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
import { TableFooter } from '@mui/material'

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
}))

const CustomHeaderTableCell = styled(TableCell)<BoxProps>(({ theme }) => ({
  fontSize: '12px',
  padding: '2px',
  fontWeight: 'bold',
}))

const PreviewCard = ({ data }: Props) => {
  // ** Hook
  const theme = useTheme()
  const userData = useAuth()

  if (data) {
    return (
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
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {data.distribuidor.codigo}-{data.distribuidor.nombre}
                    </Typography>
                  </MUITableCell>
                </TableRow>

                <TableRow>
                  <MUITableCell>
                    <Typography variant="body2">Vendedores:</Typography>
                  </MUITableCell>
                  <MUITableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {data.vendedores.map((c) => (
                        <Typography variant="caption" sx={{ mr: 0.9 }}>
                          {c.codigo.trim()}-{c.nombre.trimEnd()} |
                        </Typography>
                      ))}
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
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
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

        <div>
          <Typography variant="body1" sx={{ mr: 2, fontWeight: 600 }}>
            Clientes
          </Typography>
          <Box sx={{ mb: 2 }}>
            {data.clientes.map((c) => (
              <Typography variant="caption" sx={{ mr: 0.9 }}>
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
                <CustomTableCell>{formatCurrency(data.cheque)}</CustomTableCell>
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
    )
  } else {
    return null
  }
}

export default PreviewCard
