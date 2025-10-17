import { usePermissions } from '@/hooks/usePermissions'
import PermissionGuard from '@/views/ui/permissionGuard'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { GridColDef } from '@mui/x-data-grid'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import { getInitials } from 'src/@core/utils/get-initials'
import { AppDispatch } from 'src/store'
import {
  changeDocumentStatus,
  toggleEditDocument,
} from 'src/store/apps/documents'
import {
  DocumentStatus,
  DocumentType,
  getTipoDocumentoSpanishName,
} from 'src/types/apps/documentTypes'
import formatCurrency from 'src/utils/formatCurrency'
import formatDate from 'src/utils/formatDate'

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
    minWidth: 180,
    headerName: 'Vendedor',
    hideable: true,
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
              {row.vendedor?.nombre}
            </Typography>
            <Typography noWrap variant="caption">
              {row.vendedor?.codigo}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.25,
    field: 'client',
    minWidth: 250,
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
  // {
  //   flex: 0.15,
  //   minWidth: 90,
  //   field: 'tipoDocumento',
  //   headerName: 'Documento',
  //   hideable: true,
  //   renderCell: ({ row }: CellType) => (
  //     <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
  //       {getTipoDocumentoSpanishName(row.tipoDocumento)}
  //     </Typography>
  //   ),
  // },
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
    hideable: true,
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
  onViewCustomer?: (codigoCliente: string) => void,
): GridColDef[] => {
  const handleEditDocument = (row: DocumentType) => {
    dispatch(toggleEditDocument(row))
  }

  const { hasPermission } = usePermissions()
  let columnsWithHandlers: GridColDef[] = []

  // If user has edit permission, make the first column clickable to edit
  if (hasPermission('orders.allowEdit')) {
    columnsWithHandlers = [
      {
        flex: 0.2,
        field: 'id',
        minWidth: 120,
        headerName: '#',
        renderCell: ({ row }: CellType) => (
          <LinkStyled
            href="#"
            onClick={(e) => {
              e.preventDefault()
              row.procesado === DocumentStatus.Pending &&
                handleEditDocument(row)
            }}
            sx={{
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {`${row.noPedidoStr}`}
          </LinkStyled>
        ),
      },
      ...defaultColumns.slice(1), // Skip the first column since we're replacing it
    ]
  }

  // Create a modified client column that's clickable
  const clientColumn: GridColDef = {
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
                color: 'primary.main',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => onViewCustomer?.(row.codigoCliente)}
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
  }

  // Create the base columns
  const baseColumns =
    columnsWithHandlers.length > 0 ? columnsWithHandlers : defaultColumns

  // Replace the client column with our clickable version
  const finalColumns = baseColumns.map((column) => {
    if (column.field === 'client') {
      return clientColumn
    }
    return column
  })

  return [
    ...finalColumns,
    {
      flex: 0.2,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.25, sm: 0.5 },
            flexWrap: 'nowrap',
            minWidth: 'fit-content',
          }}
        >
          <Tooltip title="Aprobar">
            <PermissionGuard permission="orders.allowApprove" disabled>
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
                sx={{
                  minWidth: 44,
                  minHeight: 44,
                  p: { xs: 0.75, sm: 1 },
                }}
              >
                <Icon icon="material-symbols:order-approve" fontSize={20} />
              </IconButton>
            </PermissionGuard>
          </Tooltip>
          <Tooltip title="Retener">
            <PermissionGuard permission="orders.allowApprove" disabled>
              <IconButton
                size="small"
                color="warning"
                disabled={![DocumentStatus.Pending].includes(row.procesado)}
                onClick={() =>
                  handleApproval(
                    row.noPedidoStr,
                    DocumentStatus.Retained,
                    dispatch,
                  )
                }
                sx={{
                  minWidth: 44,
                  minHeight: 44,
                  p: { xs: 0.75, sm: 1 },
                }}
              >
                <Icon
                  icon="fluent:document-header-dismiss-24-filled"
                  fontSize={20}
                />
              </IconButton>
            </PermissionGuard>
          </Tooltip>
          <Tooltip title="Ver Documento">
            <IconButton
              size="small"
              component={Link}
              href={`/apps/documents/preview/${row.noPedidoStr}`}
              sx={{
                minWidth: 44,
                minHeight: 44,
                p: { xs: 0.75, sm: 1 },
              }}
            >
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip>
          <OptionsMenu
            iconProps={{ fontSize: 20 }}
            iconButtonProps={{
              size: 'small',
              sx: {
                minWidth: 44,
                minHeight: 44,
                p: { xs: 0.75, sm: 1 },
              },
            }}
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            options={[
              {
                text: 'Editar',
                icon: <Icon icon="mdi:pencil-outline" fontSize={20} />,
                menuItemProps: {
                  disabled:
                    !hasPermission('orders.allowEdit') &&
                    row.procesado !== DocumentStatus.Pending,
                  onClick: () => handleEditDocument(row),
                  sx: { minHeight: 44 }, // Better touch target for menu items
                },
              },
              // {
              //   text: 'Duplicate',
              //   icon: <Icon icon="mdi:content-copy" fontSize={20} />,
              // },
            ]}
          />
        </Box>
      ),
    },
  ]
}

// Mobile Card Component
interface DocumentCardProps {
  document: DocumentType
  onViewCustomer?: (codigoCliente: string) => void
  dispatch: ThunkDispatch<AppDispatch, undefined, AnyAction>
}

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}))

export const DocumentCard = ({
  document,
  onViewCustomer,
  dispatch,
}: DocumentCardProps) => {
  const { hasPermission } = usePermissions()

  const handleEditDocument = () => {
    dispatch(toggleEditDocument(document))
  }

  const renderClient = () => {
    if (document.avatarUrl) {
      return (
        <CustomAvatar src={document.avatarUrl} sx={{ width: 40, height: 40 }} />
      )
    } else {
      return (
        <CustomAvatar
          skin="light"
          sx={{ width: 40, height: 40, fontSize: '1rem' }}
        >
          {getInitials(document.nombreCliente || '')}
        </CustomAvatar>
      )
    }
  }

  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        {/* Header Row */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box flex={1}>
            <Typography
              variant="h6"
              component={Link}
              href={`/apps/documents/preview/${document.noPedidoStr}`}
              sx={{
                fontWeight: 700,
                fontSize: '1.125rem',
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
                display: 'block',
                mb: 0.5,
              }}
            >
              #{document.noPedidoStr}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              {getTipoDocumentoSpanishName(document.tipoDocumento)} •{' '}
              {formatDate(document.fecha)}
            </Typography>
          </Box>

          <CustomChip
            skin="light"
            size="small"
            label={orderStatusLabels[document?.procesado] || ''}
            color={orderStatusObj[document.procesado]}
            sx={{ textTransform: 'capitalize', ml: 1 }}
          />
        </Box>

        {/* Client Info Row */}
        <Box display="flex" alignItems="center" mb={2}>
          {renderClient()}
          <Box ml={2} flex={1}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
                fontSize: '1rem',
              }}
              onClick={() => onViewCustomer?.(document.codigoCliente)}
            >
              {document.nombreCliente}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              {document.codigoCliente} • {document.condicion.descripcion}
            </Typography>
          </Box>
        </Box>

        {/* Details Grid */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={6}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Total
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {formatCurrency(document.total) || '0'}
            </Typography>
          </Grid>

          {document.vendedor && (
            <Grid item xs={6}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Vendedor
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {document.vendedor.nombre}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {document.vendedor.codigo}
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Action Buttons */}
        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          flexWrap="wrap"
          gap={1}
        >
          <Tooltip title="Aprobar">
            <PermissionGuard permission="orders.allowApprove" disabled>
              <IconButton
                size="small"
                color="success"
                disabled={
                  ![DocumentStatus.Pending, DocumentStatus.Retained].includes(
                    document.procesado,
                  )
                }
                onClick={() =>
                  handleApproval(
                    document.noPedidoStr,
                    DocumentStatus.ReadyForIntegration,
                    dispatch,
                  )
                }
                sx={{ minWidth: 44, minHeight: 44 }}
              >
                <Icon icon="material-symbols:order-approve" fontSize={20} />
              </IconButton>
            </PermissionGuard>
          </Tooltip>

          <Tooltip title="Retener">
            <PermissionGuard permission="orders.allowApprove" disabled>
              <IconButton
                size="small"
                color="warning"
                disabled={
                  ![DocumentStatus.Pending].includes(document.procesado)
                }
                onClick={() =>
                  handleApproval(
                    document.noPedidoStr,
                    DocumentStatus.Retained,
                    dispatch,
                  )
                }
                sx={{ minWidth: 44, minHeight: 44 }}
              >
                <Icon
                  icon="fluent:document-header-dismiss-24-filled"
                  fontSize={20}
                />
              </IconButton>
            </PermissionGuard>
          </Tooltip>

          <Tooltip title="Ver Documento">
            <IconButton
              size="small"
              component={Link}
              href={`/apps/documents/preview/${document.noPedidoStr}`}
              sx={{ minWidth: 44, minHeight: 44 }}
            >
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip>

          <OptionsMenu
            iconProps={{ fontSize: 20 }}
            iconButtonProps={{
              size: 'small',
              sx: { minWidth: 44, minHeight: 44 },
            }}
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            options={[
              {
                text: 'Editar',
                icon: <Icon icon="mdi:pencil-outline" fontSize={20} />,
                menuItemProps: {
                  disabled:
                    !hasPermission('orders.allowEdit') ||
                    document.procesado !== DocumentStatus.Pending,
                  onClick: () => handleEditDocument(),
                  sx: { minHeight: 44 },
                },
              },
            ]}
          />
        </Stack>
      </CardContent>
    </StyledCard>
  )
}
