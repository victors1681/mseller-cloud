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
  ReporteEntrega,
} from 'src/types/apps/transportType'
import { TableFooter } from '@mui/material'

interface Props {
  data: ReporteEntrega | null
}

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
                }}
              >
                {userData.user?.business.name}
              </Typography>
              <TableBody>
                <TableRow></TableRow>
                <TableRow>
                  <MUITableCell>
                    <Typography variant="body2">Distribuidores:</Typography>
                  </MUITableCell>
                  <MUITableCell>
                    {data.distribuidores.map((distribuidor) => (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
                        <Typography variant="h6">Transporte</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant="h6">
                          {Array.isArray(data.noTransporte)
                            ? `#${data.noTransporte.join(', #')}`
                            : `#${data.noTransporte}`}
                        </Typography>
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

        <CardContent sx={{ pt: 0, pb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0 }}>
            Documentos Entregas:
          </Typography>
          <Typography variant="body2">
            {data.documentosEntregas.map((doc, index) => (
              <span key={index}>
                {doc}
                {index < data.documentosEntregas.length - 1 && ', '}
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
                    {detalle.promocion ? 'Si' : 'No'}
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
    )
  } else {
    return null
  }
}

export default PreviewCard
