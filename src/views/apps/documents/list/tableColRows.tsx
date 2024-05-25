import formatDate from 'src/utils/formatDate'
import formatCurrency from 'src/utils/formatCurrency'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import Typography from '@mui/material/Typography'
import { DocumentType } from 'src/types/apps/documentTypes'
import { GridColDef } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { DocumentStatus } from 'src/types/apps/documentTypes'
import OptionsMenu from 'src/@core/components/option-menu'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import { AppDispatch } from 'src/store'
import { changeDocumentStatus } from 'src/store/apps/documents'

const orderStatusObj: any = {
  '1': 'success',
  '10': 'success',
  '0': 'warning',
  '3': 'info',
  '9': 'secondary',
  '5': 'primary',
  '8': 'error',
}

export const orderStatusLabels: any = {
  '': 'Ninguno',
  '0': 'Pendiente',
  '1': 'Procesado',
  '3': 'Retenido',
  '5': 'Pendinete Imprimir',
  '6': 'Condicion Crédito',
  '7': 'Backorder',
  '8': 'Error Integración',
  '9': 'Listo Para Integrar',
  '10': 'Enviado al ERP',
}

export interface CellType {
  row: DocumentType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

// ** renders client column
const renderClient = (row: DocumentType) => {
  if (row.avatarUrl) {
    return (
      <CustomAvatar
        src={row.avatarUrl}
        sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }}
      />
    )
  } else {
    return (
      <CustomAvatar
        skin="light"
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row.nombreCliente || '')}
      </CustomAvatar>
    )
  }
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.2,
    field: 'id',
    minWidth: 120,
    headerName: '#',
    renderCell: ({ row }: CellType) => (
      <LinkStyled
        href={`/apps/documents/preview/${row.noPedidoStr}`}
      >{`${row.noPedidoStr}`}</LinkStyled>
    ),
  },
  {
    flex: 0.2,
    field: 'seller',
    minWidth: 210,
    headerName: 'Vendedor',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', fontWeight: 600 }}
            >
              {row.vendedor.nombre}
            </Typography>
            <Typography noWrap variant="caption">
              {row.vendedor.codigo}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.25,
    field: 'client',
    minWidth: 300,
    headerName: 'Cliente',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {row.nombreCliente}
            </Typography>
            <Typography noWrap variant="caption">
              {row.codigoCliente} - {row.condicion.descripcion}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'total',
    headerName: 'Total',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{`${
        formatCurrency(row.total) || 0
      }`}</Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 130,
    field: 'issuedDate',
    headerName: 'Fecha',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{formatDate(row.fecha)}</Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <Tooltip title={row.mensajesError}>
          <div style={{ width: '100px' }}>
            <CustomChip
              skin="light"
              size="small"
              label={orderStatusLabels[row?.procesado] || ''}
              color={orderStatusObj[row.procesado]}
              sx={{ textTransform: 'capitalize' }}
            />
          </div>
        </Tooltip>
      )
    },
  },
]

const handleApproval = (
  noPedidoStr: string,
  status: DocumentStatus,
  dispatch: ThunkDispatch<AppDispatch, undefined, AnyAction>,
) => {
  const label =
    status === DocumentStatus.ReadyForIntegration
      ? 'Seguro que deseas aprobar este pedido?'
      : 'Seguro que deseas retener este pedido?'

  const result = window.confirm(label)

  // Check the user's choice
  if (result) {
    const payload = {
      noPedidoStr,
      status,
    }
    dispatch(changeDocumentStatus([payload]))
  }
}

export const columns = (
  dispatch: ThunkDispatch<AppDispatch, undefined, AnyAction>,
): GridColDef[] => [
  ...defaultColumns,
  {
    flex: 0.2,
    minWidth: 140,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="Aprobar">
          <IconButton
            size="small"
            color="success"
            disabled={
              ![DocumentStatus.Pending, DocumentStatus.Retained].includes(
                row.procesado,
              )
            }
            onClick={() =>
              handleApproval(
                row.noPedidoStr,
                DocumentStatus.ReadyForIntegration,
                dispatch,
              )
            }
          >
            <Icon icon="material-symbols:order-approve" fontSize={20} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Retener">
          <IconButton
            size="small"
            color="warning"
            disabled={![DocumentStatus.Pending].includes(row.procesado)}
            onClick={() =>
              handleApproval(row.noPedidoStr, DocumentStatus.Retained, dispatch)
            }
          >
            <Icon
              icon="fluent:document-header-dismiss-24-filled"
              fontSize={20}
            />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title="View">
          <IconButton
            size="small"
            component={Link}
            href={`/apps/documents/preview/${row.noPedidoStr}`}
          >
            <Icon icon="mdi:eye-outline" fontSize={20} />
          </IconButton>
        </Tooltip> */}
        <OptionsMenu
          iconProps={{ fontSize: 20 }}
          iconButtonProps={{ size: 'small' }}
          menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
          options={[
            {
              text: 'Download',
              icon: <Icon icon="mdi:download" fontSize={20} />,
            },
            {
              text: 'Edit',
              href: `/apps/documents/edit/${row.noPedidoStr}`,
              icon: <Icon icon="mdi:pencil-outline" fontSize={20} />,
            },
            {
              text: 'Duplicate',
              icon: <Icon icon="mdi:content-copy" fontSize={20} />,
            },
          ]}
        />
      </Box>
    ),
  },
]
