// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
// ** Icon Imports
import {
  Box,
  BoxProps,
  Card,
  CardContent,
  Divider,
  Grid,
  TableCell,
  TableCellBaseProps,
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import {
  DocumentoEntregaDetalleType,
  DocumentoEntregaType,
} from 'src/types/apps/transportType'
import formatCurrency from 'src/utils/formatCurrency'
import formatDate from 'src/utils/formatDate'
import {
  TransportStatusEnum,
  transportDocStatusLabels,
  transportStatusObj,
} from '../../../../utils/transportMappings'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

interface Props {
  title: string
  data: DocumentoEntregaType
}

interface CellType {
  row: DocumentoEntregaDetalleType
}

const columns: GridColDef[] = [
  {
    field: 'qty',
    headerName: 'Cant.',
    flex: 0.15,
    minWidth: 100,
    editable: true,
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', textTransform: 'capitalize' }}
            >
              {row.cantidad_E}
            </Typography>
            <Typography noWrap variant="caption">
              O:{row.cantidad}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.1,
    minWidth: 50,
    field: 'unit',
    headerName: 'Un',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{row.unidad}</Typography>
    ),
  },
  {
    field: 'code',
    headerName: 'Artículo',
    flex: 0.4,
    minWidth: 150,
    editable: true,
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', textTransform: 'capitalize' }}
            >
              {row.producto.nombre}
            </Typography>
            <Typography noWrap variant="caption">
              {row.producto.codigo}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    field: 'discount',
    headerName: 'Desc.',
    flex: 0.1,
    minWidth: 80,
    editable: true,
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', textTransform: 'capitalize' }}
            >
              {row.porcientoDescuento_E}%
            </Typography>
            <Typography noWrap variant="caption">
              O:{row.porcientoDescuento}%
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    field: 'price',
    headerName: 'Precio',
    flex: 0.15,
    minWidth: 150,
    editable: true,
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', textTransform: 'capitalize' }}
            >
              {formatCurrency(row.precioUnitario)}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    field: 'total',
    headerName: 'total',
    width: 120,
    editable: true,
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', textTransform: 'capitalize' }}
            >
              {formatCurrency(row.subtotal_E)}
            </Typography>
            <Typography noWrap variant="caption">
              O:{formatCurrency(row.subtotal)}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
]

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2),
  },
}))

interface HeaderProps {
  data: DocumentoEntregaType
}

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`,
}))

const Header = ({ data }: HeaderProps) => {
  return (
    <Grid container>
      <Grid item sm={6} xs={12} sx={{ pb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 0, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
              {data.cliente.nombre}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mb: 1 }}>
            {data.cliente.direccion}, {data.cliente.ciudad}
          </Typography>

          <Box sx={{ mb: 0, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
              Tel.:
            </Typography>
            <Typography variant="body2">{data.cliente.telefono1}</Typography>
          </Box>

          <Box sx={{ mb: 0, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
              RNC:
            </Typography>
            <Typography variant="body2">{data.cliente.rnc}</Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item sm={6} xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
            NCF:
          </Typography>
          <Typography variant="body2">{data.ncf ? data.ncf : '-'}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
            Permite Editar:
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            {data.permitirEditar ? 'SI' : 'NO'}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}
interface FooterProps {
  data: DocumentoEntregaType
}
const Footer = ({ data }: FooterProps) => {
  const total = data.detalle.reduce(
    (acc, c) => (acc += c.subtotal_E < 0 ? 0 : c.subtotal_E),
    0,
  )
  const discount = data.detalle.reduce(
    (acc, c) => (acc += c.totalDescuento_E < 0 ? 0 : c.totalDescuento_E),
    0,
  )
  const tax = data.detalle.reduce(
    (acc, c) => (acc += c.totalImpuesto_E < 0 ? 0 : c.totalImpuesto_E),
    0,
  )

  const selectedValue = (delivered: number, original: number) =>
    data.status === TransportStatusEnum.Entregado ? delivered : original

  return (
    <CardContent>
      <Grid container>
        <Grid item xs={12} sm={7} lg={9} sx={{ order: { sm: 1, xs: 2 } }}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
              Vendedor:
            </Typography>
            <Typography variant="body2">
              {data.vendedor.codigo} - {data.vendedor.nombre}
            </Typography>
          </Box>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
              Status:
            </Typography>
            <CustomChip
              skin="light"
              size="small"
              label={transportDocStatusLabels[data.status] || ''}
              color={transportStatusObj[data.status]}
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
              Fecha entrega:
            </Typography>
            <Typography variant="body2">
              {formatDate(data.fechaEntrega)}
            </Typography>
          </Box>

          {!!data.motivoRechazo?.motivo && (
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
                Rechazo:
              </Typography>
              <Typography variant="body2">
                {data.motivoRechazo?.motivo}
              </Typography>
            </Box>
          )}
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
              {formatCurrency(selectedValue(data.bruto_E, data.bruto))}
            </Typography>
          </CalcWrapper>
          <CalcWrapper>
            <Typography variant="body2">Descuento:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatCurrency(selectedValue(data.descuento_E, data.descuento))}
            </Typography>
          </CalcWrapper>
          <CalcWrapper>
            <Typography variant="body2">Impuesto:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatCurrency(selectedValue(data.impuestos_E, data.impuestos))}
            </Typography>
          </CalcWrapper>
          <Divider />
          <CalcWrapper>
            <Typography variant="body2">Total:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatCurrency(selectedValue(data.neto_E, data.neto))}
            </Typography>
          </CalcWrapper>
        </Grid>
      </Grid>
    </CardContent>
  )
}

const DocDetailModal = (props: Props) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  return (
    <div>
      <LinkStyled href={`#`} onClick={handleClickOpen}>
        {props.title}
      </LinkStyled>

      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" sx={{ p: 4 }}>
          <Typography variant="h6" component="span">
            Entrega: {props.data.noDocEntrega}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon="mdi:close" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <Grid container spacing={0}>
            <Header data={props.data} />

            <Grid item xs={12}>
              <Card>
                <DataGrid
                  autoHeight
                  rows={props.data.detalle}
                  columns={columns}
                  pageSizeOptions={[10]}
                  disableRowSelectionOnClick
                  getRowId={(row) => row.posicionPartida}
                />
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <Footer data={props.data} />
      </Dialog>
    </div>
  )
}

export default DocDetailModal
