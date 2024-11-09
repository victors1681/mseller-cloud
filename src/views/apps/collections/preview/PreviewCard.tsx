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

// ** Types/documentTypes'
import formatDate from 'src/utils/formatDate'
import { useAuth } from 'src/hooks/useAuth'
import formatCurrency from 'src/utils/formatCurrency'
import { TableFooter } from '@mui/material'
import { CollectionType } from 'src/types/apps/collectionType'
import { getStats } from '../list/cards/widgets/CardWidgetsReceiptOverview'

interface Props {
  collection: CollectionType
}
const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`,
}))

const CustomTableCell = styled(TableCell)<BoxProps>(({ theme }) => ({
  fontSize: '12.5px',
  padding: '0px',
  paddingTop: '1.2px',
  paddingBottom: '1.2px',
  color: '#4a4a4a !important',
}))

const CustomHeaderTableCell = styled(TableCell)<BoxProps>(({ theme }) => ({
  fontSize: '12.5px',
  padding: '2px',
  fontWeight: 'bold',
}))

const CustomTableRow = styled(TableRow)<any>(({ disabled }) => ({
  textDecoration: disabled ? 'line-through' : 'none',
}))

const SignatureSection = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
      }}
    >
      <div style={{ flex: 1, textAlign: 'center', marginRight: '20px' }}>
        <Table>
          <TableRow>
            <TableCell
              style={{
                borderBottom: 'none',
                paddingBottom: '0px',
              }}
            >
              __________________________
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ borderBottom: 'none', paddingTop: '0px' }}>
              Cajero
            </TableCell>
          </TableRow>
        </Table>
      </div>

      <div style={{ flex: 1, textAlign: 'center', marginLeft: '20px' }}>
        <Table>
          <TableRow>
            <TableCell style={{ borderBottom: 'none', paddingBottom: '0px' }}>
              __________________________
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              style={{
                borderBottom: 'none',
                paddingTop: '0px',
              }}
            >
              Firma Vendedor
            </TableCell>
          </TableRow>
        </Table>
      </div>
    </div>
  )
}

const PreviewCard = ({ collection }: Props) => {
  // ** Hook
  console.log('collection', collection)
  const theme = useTheme()
  const userData = useAuth()

  const paymentType = (type: string, ckFuturista: boolean) => {
    if (ckFuturista) return 'CK Futurista'

    return {
      E: 'Efectivo',
      T: 'Transferencia',
      CK: 'Cheque',
    }[type]
  }

  const stats = getStats(collection)

  if (Object.keys(collection).length > 0) {
    return (
      <Card sx={{ width: '50em' }}>
        <CardContent sx={{ pb: 1 }}>
          <Grid container>
            <Grid item sm={6} xs={6} sx={{ mb: { sm: 0, xs: 2 } }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 0.5,
                  fontWeight: 600,
                  lineHeight: 'normal',
                  textTransform: 'uppercase',
                }}
              >
                {userData.user?.business.name}
              </Typography>
              <TableBody>
                <CustomTableRow></CustomTableRow>
                <CustomTableRow>
                  <MUITableCell>
                    <Typography variant="body2">Ruta: </Typography>
                  </MUITableCell>
                  <MUITableCell>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600 }}
                      color={'black'}
                    >
                      {collection?.vendedor?.codigo}-
                      {collection?.vendedor?.nombre}
                    </Typography>
                  </MUITableCell>
                </CustomTableRow>
                <CustomTableRow>
                  <MUITableCell>
                    <Typography variant="body2">Localidad: </Typography>
                  </MUITableCell>
                  <MUITableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600 }}
                      color={'black'}
                    >
                      {collection?.vendedor.localidad}
                    </Typography>
                  </MUITableCell>
                </CustomTableRow>
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
                    <CustomTableRow>
                      <MUITableCell>
                        <Typography variant="h6">Depósito:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant="h6">{`#${collection.noDepositoStr}`}</Typography>
                      </MUITableCell>
                    </CustomTableRow>
                    <CustomTableRow>
                      <MUITableCell>
                        <Typography variant="body2">Fecha:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600 }}
                          color={'black'}
                        >
                          {formatDate(collection.fecha)}
                        </Typography>
                      </MUITableCell>
                    </CustomTableRow>
                    <CustomTableRow>
                      <MUITableCell>
                        <Typography variant="body2">Cant. Recibos: </Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {collection.recibos.length}
                        </Typography>
                      </MUITableCell>
                    </CustomTableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <Divider />

        <TableContainer>
          <Table size="small">
            <TableHead>
              <CustomTableRow>
                <CustomHeaderTableCell style={{ width: '10px' }}>
                  No.
                </CustomHeaderTableCell>
                <CustomHeaderTableCell>Código</CustomHeaderTableCell>
                <CustomHeaderTableCell>Cliente</CustomHeaderTableCell>
                <CustomHeaderTableCell>No.Ref.</CustomHeaderTableCell>
                <CustomHeaderTableCell>Fecha Cobro</CustomHeaderTableCell>
                <CustomHeaderTableCell>Total Cobro</CustomHeaderTableCell>
                <CustomHeaderTableCell>Tipo Pago</CustomHeaderTableCell>
                <CustomHeaderTableCell flex={1}>Banco</CustomHeaderTableCell>
              </CustomTableRow>
            </TableHead>
            <TableBody>
              {collection.recibos.map((recibo, index) => (
                <>
                  <CustomTableRow
                    key={recibo.noReciboStr}
                    style={{ textTransform: '' }}
                    disabled={recibo.anulado === 1}
                  >
                    <CustomTableCell style={{ width: '10px' }}>
                      {index + 1}
                    </CustomTableCell>
                    <CustomTableCell>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, color: 'black' }}
                      >
                        {recibo.codigoCliente}
                      </Typography>
                    </CustomTableCell>
                    <CustomTableCell>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, color: 'black' }}
                      >
                        {recibo.nombreCliente}
                      </Typography>
                    </CustomTableCell>
                    <CustomTableCell>{recibo.noReferencia}</CustomTableCell>
                    <CustomTableCell>
                      {formatDate(recibo.fecha)}
                    </CustomTableCell>
                    <CustomTableCell>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, color: 'black' }}
                      >
                        {formatCurrency(recibo.totalCobro)}
                      </Typography>
                    </CustomTableCell>
                    <CustomTableCell>
                      {paymentType(recibo.tipoPago, recibo.ckFuturista)}
                    </CustomTableCell>
                    <CustomTableCell>{recibo.nombreBanco}</CustomTableCell>
                  </CustomTableRow>
                  <CustomTableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={8}
                    >
                      <Table size="small">
                        <TableHead>
                          <CustomTableRow>
                            <CustomHeaderTableCell>
                              No.Recibo
                            </CustomHeaderTableCell>
                            <CustomHeaderTableCell>
                              No.Doc.
                            </CustomHeaderTableCell>
                            <CustomHeaderTableCell>
                              Sub-Total
                            </CustomHeaderTableCell>
                            <CustomHeaderTableCell>
                              Descuento
                            </CustomHeaderTableCell>
                            <CustomHeaderTableCell>Itbis</CustomHeaderTableCell>
                            <CustomHeaderTableCell>
                              Total Cobrado
                            </CustomHeaderTableCell>
                          </CustomTableRow>
                        </TableHead>
                        {recibo.recibosDetalles.map((detalle) => (
                          <CustomTableRow
                            key={detalle.noReciboStr}
                            disabled={recibo.anulado === 1}
                          >
                            <CustomTableCell>
                              {detalle.noReciboStr}
                            </CustomTableCell>
                            <CustomTableCell>
                              {detalle.noDocumento}
                            </CustomTableCell>
                            <CustomTableCell>
                              {formatCurrency(detalle.subTotalDocumento)}
                            </CustomTableCell>
                            <CustomTableCell>
                              {formatCurrency(detalle.descuentoMonto)}
                            </CustomTableCell>
                            <CustomTableCell>
                              {formatCurrency(detalle.itbisDocumento)}
                            </CustomTableCell>
                            <CustomTableCell>
                              {formatCurrency(detalle.totalCobroDocumento)}
                            </CustomTableCell>
                          </CustomTableRow>
                        ))}
                      </Table>
                    </TableCell>
                  </CustomTableRow>
                </>
              ))}
            </TableBody>
            <TableFooter>
              <TableCell
                style={{ paddingBottom: 0, paddingTop: 10 }}
                colSpan={8}
              >
                <Table>
                  <CustomTableRow>
                    <CustomTableCell style={{ fontWeight: 'bold' }}>
                      Efectivo:
                    </CustomTableCell>
                    <CustomTableCell>
                      {formatCurrency(stats.cash)}
                    </CustomTableCell>
                    <CustomTableCell style={{ fontWeight: 'bold' }}>
                      Cheque:
                    </CustomTableCell>
                    <CustomTableCell>
                      {formatCurrency(stats.check)}
                    </CustomTableCell>
                    <CustomTableCell style={{ fontWeight: 'bold' }}>
                      Transferencia:
                    </CustomTableCell>
                    <CustomTableCell>
                      {formatCurrency(stats.transfer)}
                    </CustomTableCell>
                    <CustomTableCell style={{ fontWeight: 'bold' }}>
                      Futuristas:
                    </CustomTableCell>
                    <CustomTableCell>
                      {formatCurrency(stats.ckFuturist)}
                    </CustomTableCell>
                  </CustomTableRow>
                </Table>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Table style={{ width: '40%' }}>
                    <CustomTableRow>
                      <CustomTableCell>Total General:</CustomTableCell>
                      <CustomTableCell>
                        {formatCurrency(collection.totalGeneral)}
                      </CustomTableCell>
                    </CustomTableRow>
                    <CustomTableRow>
                      <CustomTableCell style={{ fontWeight: 'bold' }}>
                        Total Cobrado:
                      </CustomTableCell>
                      <CustomTableCell>
                        {formatCurrency(collection.totalCobrado)}
                      </CustomTableCell>
                    </CustomTableRow>
                  </Table>
                </div>
              </TableCell>
            </TableFooter>
          </Table>
          <SignatureSection></SignatureSection>
        </TableContainer>
      </Card>
    )
  } else {
    return null
  }
}

export default PreviewCard
