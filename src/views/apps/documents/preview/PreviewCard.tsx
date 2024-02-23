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
import formattedNumber from 'src/utils/formattedNumber'

interface Props {
  data: DocumentType
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

const PreviewCard = ({ data }: Props) => {
  // ** Hook
  const theme = useTheme()
  const userData = useAuth()

  if (data) {
    return (
      <Card>
        <CardContent>
          <Grid container>
            <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                  <img
                    src={userData.user?.business.logoUrl || ''}
                    height={80}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      ml: 2.5,
                      fontWeight: 600,
                      lineHeight: 'normal',
                      textTransform: 'uppercase',
                    }}
                  >
                    {userData.user?.business.name}
                  </Typography>
                </Box>
                <div>
                  <Typography variant="body2" sx={{ mb: 0 }}>
                    {userData.user?.business.address.street}{' '}
                    {userData.user?.business.address.city}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0 }}>
                    {userData.user?.business.rnc}
                  </Typography>
                  <Typography variant="body2">
                    {userData.user?.business.phone}
                  </Typography>
                </div>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                }}
              >
                <Table sx={{ maxWidth: '270px' }}>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant="h6">
                          {data.tipoDocumento === TipoDocumentoEnum.ORDER
                            ? 'Pedido'
                            : 'Cotización'}
                        </Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant="h6">{`#${data.noPedidoStr}`}</Typography>
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

        <Divider />

        <CardContent>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
              <Typography variant="body2" sx={{ mb: 3.5, fontWeight: 600 }}>
                Cliente
              </Typography>
              <Typography variant="body2" sx={{ mb: 0 }}>
                {data.cliente.nombre}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0 }}>
                RNC: {data.cliente.rnc}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0 }}>
                {data.cliente.direccion} {data.cliente.ciudad}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
              <Typography variant="body2" sx={{ mb: 0 }}>
                <strong>Tel:</strong> {data.cliente.telefono1}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0 }}>
                <strong>Condición:</strong> {data.condicion.descripcion}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0 }}>
                <strong>Localidad:</strong> {data.localidad?.descripcion}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cantidad</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Desc.</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>SubTotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.detalle.map((detalle) => (
                <TableRow key={detalle.id}>
                  <TableCell>{detalle.cantidad}</TableCell>
                  <TableCell>{detalle.codigoProducto}</TableCell>
                  <TableCell>{detalle.unidad}</TableCell>
                  <TableCell>{detalle.descripcion}</TableCell>
                  <TableCell>
                    {formattedNumber(detalle.porcientoDescuento)}%
                  </TableCell>
                  <TableCell>{formatCurrency(detalle.precio)}</TableCell>
                  <TableCell>{formatCurrency(detalle.subTotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent>
          <Grid container>
            <Grid item xs={12} sm={7} lg={9} sx={{ order: { sm: 1, xs: 2 } }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
                  Vendedor:
                </Typography>
                <Typography variant="body2">
                  {data.vendedor.codigo}-{data.vendedor.nombre}
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={5}
              lg={3}
              sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}
            >
              <CalcWrapper>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.subTotal)}
                </Typography>
              </CalcWrapper>
              <CalcWrapper>
                <Typography variant="body2">Descuento:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.descuento)}
                </Typography>
              </CalcWrapper>
              <CalcWrapper>
                <Typography variant="body2">Impuesto:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.impuesto)}
                </Typography>
              </CalcWrapper>
              <Divider />
              <CalcWrapper>
                <Typography variant="body2">Total:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(data.total)}
                </Typography>
              </CalcWrapper>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent>
          <Typography variant="body2">
            <strong>Note:</strong> {userData.user?.business.footerMessage}
          </Typography>
        </CardContent>
      </Card>
    )
  } else {
    return null
  }
}

export default PreviewCard
