import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React from 'react'
import Icon from 'src/@core/components/icon'
import { InvoiceType } from 'src/types/apps/invoicesTypes'
import formatCurrency from 'src/utils/formatCurrency'
import formatDate from 'src/utils/formatDate'

interface InvoicesListProps {
  invoices: InvoiceType[]
  isLoading: boolean
}

const InvoicesList: React.FC<InvoicesListProps> = ({ invoices, isLoading }) => {
  const invoiceColumns: GridColDef[] = [
    {
      field: 'no_factura',
      headerName: 'No. Factura',
      minWidth: 120,
      flex: 0.15,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon="mdi:file-document" color="primary.main" fontSize="1rem" />
          <Box
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 500,
            }}
          >
            {params.value}
          </Box>
        </Box>
      ),
    },
    {
      field: 'fecha',
      headerName: 'Fecha',
      minWidth: 90,
      flex: 0.1,
      hideable: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon
            icon="mdi:calendar"
            color="text.secondary"
            fontSize="0.875rem"
          />
          <Box sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            {formatDate(params.value)}
          </Box>
        </Box>
      ),
    },
    {
      field: 'fecha_vencimiento',
      headerName: 'Vencimiento',
      minWidth: 110,
      flex: 0.12,
      hideable: true,
      renderCell: (params) => {
        const isOverdue =
          new Date(params.value) < new Date() && params.row.saldo_restante > 0
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon
              icon={isOverdue ? 'mdi:alert-circle' : 'mdi:calendar-clock'}
              color={isOverdue ? 'error.main' : 'text.secondary'}
              fontSize="0.875rem"
            />
            <Box
              sx={{
                color: isOverdue ? 'error.main' : 'inherit',
                fontWeight: isOverdue ? 600 : 400,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              {formatDate(params.value)}
            </Box>
          </Box>
        )
      },
    },
    {
      field: 'tipo_documento',
      headerName: 'Tipo',
      minWidth: 80,
      flex: 0.1,
      hideable: true,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          sx={{
            fontSize: { xs: '0.65rem', sm: '0.75rem' },
            height: { xs: 20, sm: 24 },
          }}
        />
      ),
    },
    {
      field: 'total',
      headerName: 'Total',
      minWidth: 90,
      flex: 0.15,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon
            icon="mdi:currency-usd"
            color="success.main"
            fontSize="0.875rem"
          />
          <Box
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 500,
              color: 'success.main',
            }}
          >
            {formatCurrency(params.value)}
          </Box>
        </Box>
      ),
    },
    {
      field: 'saldo_restante',
      headerName: 'Saldo',
      minWidth: 90,
      flex: 0.15,
      renderCell: (params) => {
        const isOverdue =
          new Date(params.row.fecha_vencimiento) < new Date() &&
          params.value > 0
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon
              icon={isOverdue ? 'mdi:alert' : 'mdi:cash'}
              color={isOverdue ? 'error.main' : 'warning.main'}
              fontSize="0.875rem"
            />
            <Box
              sx={{
                color: isOverdue ? 'error.main' : 'warning.main',
                fontWeight: isOverdue ? 600 : 500,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              {formatCurrency(params.value)}
            </Box>
          </Box>
        )
      },
    },
    {
      field: 'condicion_pago',
      headerName: 'Condición',
      minWidth: 90,
      flex: 0.15,
      hideable: true,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="default"
          variant="outlined"
          sx={{
            fontSize: { xs: '0.65rem', sm: '0.75rem' },
            height: { xs: 20, sm: 24 },
          }}
        />
      ),
    },
  ]

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'info.main', width: 40, height: 40 }}>
            <Icon icon="mdi:file-table" />
          </Avatar>
        }
        title="Facturas"
        titleTypographyProps={{
          variant: 'h6',
          sx: {
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 600,
          },
        }}
        sx={{
          pb: { xs: 1, sm: 2 },
          bgcolor: 'background.paper',
        }}
      />
      <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            autoHeight
            rows={invoices || []}
            columns={invoiceColumns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 },
              },
              columns: {
                columnVisibilityModel: {
                  fecha: false, // Hidden by default on small screens
                  tipo_documento: false, // Hidden by default on small screens
                  condicion_pago: false, // Hidden by default on small screens
                },
              },
            }}
            disableRowSelectionOnClick
            getRowId={(row) => row.no_factura}
            sx={{
              '& .MuiDataGrid-main': {
                minWidth: 0,
              },
              '& .MuiDataGrid-columnHeaders': {
                minHeight: { xs: 48, sm: 56 },
              },
              '& .MuiDataGrid-row': {
                minHeight: { xs: 48, sm: 52 },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              },
              '& .MuiDataGrid-cell': {
                padding: { xs: '8px 4px', sm: '8px 16px' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              },
              '& .MuiDataGrid-columnHeader': {
                padding: { xs: '8px 4px', sm: '8px 16px' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              },
              // Hide columns on mobile
              '& .MuiDataGrid-columnHeader[data-field="fecha"]': {
                display: { xs: 'none', sm: 'flex' },
              },
              '& .MuiDataGrid-cell[data-field="fecha"]': {
                display: { xs: 'none', sm: 'flex' },
              },
              '& .MuiDataGrid-columnHeader[data-field="tipo_documento"]': {
                display: { xs: 'none', md: 'flex' },
              },
              '& .MuiDataGrid-cell[data-field="tipo_documento"]': {
                display: { xs: 'none', md: 'flex' },
              },
              '& .MuiDataGrid-columnHeader[data-field="condicion_pago"]': {
                display: { xs: 'none', lg: 'flex' },
              },
              '& .MuiDataGrid-cell[data-field="condicion_pago"]': {
                display: { xs: 'none', lg: 'flex' },
              },
              '& .overdue-row': {
                backgroundColor: '#ffebee !important',
                '&:hover': {
                  backgroundColor: '#ffcdd2 !important',
                },
              },
            }}
            getRowClassName={(params) => {
              const isOverdue =
                new Date(params.row.fecha_vencimiento) < new Date() &&
                params.row.saldo_restante > 0
              return isOverdue ? 'overdue-row' : ''
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default InvoicesList
