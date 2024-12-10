// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'

import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useFirebase } from 'src/firebase/useFirebase'
import {
  CustomerPaymentsHistoryResponseType,
  FormattedCharge,
} from 'src/types/apps/stripeTypes'
import { isValidResponse } from 'src/firebase'

interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: any //InvoiceType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  requires_action: { color: 'secondary', icon: 'mdi:send' },
  succeeded: { color: 'success', icon: 'mdi:check' },
  requires_capture: { color: 'primary', icon: 'mdi:content-save-outline' },
  pending: { color: 'warning', icon: 'mdi:chart-pie' },
  failed: { color: 'error', icon: 'mdi:information-outline' },
  canceled: { color: 'info', icon: 'mdi:arrow-down' },
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 280,
    headerName: '#',
    renderCell: ({ row }: CellType) => (
      <LinkStyled
        href={row.receipt_url}
        target="_blank"
      >{`#${row.id}`}</LinkStyled>
    ),
  },

  {
    flex: 0.25,
    field: 'name',
    minWidth: 250,
    headerName: 'descriptción',
    renderCell: ({ row }: CellType) => {
      const { description } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant="body2" sx={{ color: 'text.primary' }}>
              {description}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'invoice.total',
    headerName: 'Total',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">{`$${row.invoice.total || 0}`}</Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 125,
    field: 'created',
    headerName: 'Fecha',
    renderCell: ({ row }: CellType) => (
      <Typography variant="body2">
        {format(new Date(row.created * 1000), 'dd-MM-yyyy HH:mm')}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'invoice.amount_due',
    headerName: 'Balance',
    renderCell: ({ row }: CellType) => {
      return row.balance !== 0 ? (
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          ${row.invoice.amount_remaining}
        </Typography>
      ) : (
        <CustomChip size="small" skin="light" color="success" label="Paid" />
      )
    },
  },
  {
    flex: 0.1,
    minWidth: 80,
    field: 'status',
    renderHeader: () => <Icon icon="mdi:trending-up" fontSize={20} />,
    renderCell: ({ row }: CellType) => {
      const { invoice, status } = row

      const color = invoiceStatusObj[status]
        ? invoiceStatusObj[status].color
        : 'primary'

      return (
        <Tooltip
          title={
            <div>
              <Typography
                variant="caption"
                sx={{ color: 'common.white', fontWeight: 600 }}
              >
                {status}
              </Typography>
              <br />
              <Typography
                variant="caption"
                sx={{ color: 'common.white', fontWeight: 600 }}
              >
                Balance:
              </Typography>{' '}
              {invoice.amount_remaining}
              <br />
              <Typography
                variant="caption"
                sx={{ color: 'common.white', fontWeight: 600 }}
              >
                Fecha vencimiento:
              </Typography>{' '}
              {invoice.due_date
                ? new Date(invoice.due_date).toDateString()
                : '-'}
            </div>
          }
        >
          <CustomAvatar
            skin="light"
            color={color}
            sx={{ width: '1.875rem', height: '1.875rem' }}
          >
            <Icon icon={invoiceStatusObj[status].icon} fontSize="1rem" />
          </CustomAvatar>
        </Tooltip>
      )
    },
  },
]

/* eslint-enable */

const BillingHistoryTable = () => {
  // ** State
  const [history, setHistory] = useState<FormattedCharge[]>([])
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const { getCustomerPaymentsHistory } = useFirebase()

  const handleFirebase = async () => {
    const response = await getCustomerPaymentsHistory()
    if (isValidResponse<CustomerPaymentsHistoryResponseType>(response)) {
      setHistory(response.charges)
    }
  }
  useEffect(() => {
    handleFirebase()
  }, [])

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Acciones',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Ver recibo">
            <IconButton
              size="small"
              component={Link}
              href={row.receipt_url}
              target="_blank"
            >
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader title="Historial de cargos" />
      <Divider sx={{ m: '0 !important' }} />

      <DataGrid
        autoHeight
        pagination
        rows={history}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  )
}

export default BillingHistoryTable
