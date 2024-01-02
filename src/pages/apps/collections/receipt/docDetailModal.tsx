// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { styled } from '@mui/material/styles'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Link from 'next/link'

import {
  Box,
  BoxProps,
  Card,
  CardContent,
  Divider,
  Grid,
  TableCellBaseProps,
  TableCell,
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import formatCurrency from 'src/utils/formatCurrency'
import CustomChip from 'src/@core/components/mui/chip'
import {
  collectionStatusLabels,
  collectionStatusObj,
} from '../utils/collectionMappings'
import formatDate from 'src/utils/formatDate'
import { ReceiptDetailType, ReceiptType } from 'src/types/apps/collectionType'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

interface Props {
  title: string
  data: ReceiptType
}

interface CellType {
  row: ReceiptDetailType
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
              {row.confirmada}
            </Typography>
            <Typography noWrap variant="caption">
              O:{row.confirmada}
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
      <Typography variant="body2">{row.confirmada}</Typography>
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
              {row.noDocumento}
            </Typography>
            <Typography noWrap variant="caption">
              {row.noDocumento}
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
              {row.itbisDocumento}%
            </Typography>
            <Typography noWrap variant="caption">
              O:{row.descuentoMonto}%
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
              {formatCurrency(row.descuento)}
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
              {formatCurrency(row.totalCobroDocumento)}
            </Typography>
            <Typography noWrap variant="caption">
              {formatCurrency(row.totalDocumento)}
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
  data: ReceiptType
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
          <Typography variant="body2">
            {data.ckFuturista ? data.ckFuturista : '-'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
            NCF Auto Asignado:
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            {data.ckFuturista ? 'SI' : 'NO'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
            Permite Editar:
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            {data.ckFuturista ? 'SI' : 'NO'}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}
interface FooterProps {
  data: ReceiptType
}
const Footer = ({ data }: FooterProps) => {
  const total = data.recibosDetalles.reduce(
    (acc, c) => (acc += c.totalCobroDocumento),
    0,
  )
  const discount = data.recibosDetalles.reduce(
    (acc, c) => (acc += c.totalCobroDocumento),
    0,
  )
  const tax = data.recibosDetalles.reduce(
    (acc, c) => (acc += c.totalCobroDocumento),
    0,
  )

  const subtotal = total - (discount + tax)

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
              label={collectionStatusLabels[data.procesado] || ''}
              color={collectionStatusObj[data.procesado]}
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
              Fecha entrega:
            </Typography>
            <Typography variant="body2">{formatDate(data.fecha)}</Typography>
          </Box>

          {/* {!!data.motivoRechazo?.motivo && (
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
                Rechazo:
              </Typography>
              <Typography variant="body2">
                {data.motivoRechazo?.motivo}
              </Typography>
            </Box>
          )} */}
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
              {formatCurrency(subtotal)}
            </Typography>
          </CalcWrapper>
          <CalcWrapper>
            <Typography variant="body2">Descuento:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatCurrency(discount)}
            </Typography>
          </CalcWrapper>
          <CalcWrapper>
            <Typography variant="body2">Impuesto:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatCurrency(tax)}
            </Typography>
          </CalcWrapper>
          <Divider />
          <CalcWrapper>
            <Typography variant="body2">Total:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatCurrency(total)}
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
            Entrega: {props.data.noDepositoStr}
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
                  rows={props.data.recibosDetalles}
                  columns={columns}
                  pageSizeOptions={[10]}
                  disableRowSelectionOnClick
                  getRowId={(row: ReceiptDetailType) => row.noReciboStr}
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
