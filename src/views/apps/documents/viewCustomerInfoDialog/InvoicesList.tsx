import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  CircularProgress,
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
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
      width: 120,
      flex: 0.15,
    },
    {
      field: 'fecha',
      headerName: 'Fecha',
      width: 100,
      flex: 0.1,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: 'fecha_vencimiento',
      headerName: 'Vencimiento',
      width: 100,
      flex: 0.1,
      renderCell: (params) => {
        const isOverdue =
          new Date(params.value) < new Date() && params.row.saldo_restante > 0
        return (
          <Box
            sx={{
              color: isOverdue ? 'error.main' : 'inherit',
              fontWeight: isOverdue ? 'bold' : 'normal',
            }}
          >
            {formatDate(params.value)}
          </Box>
        )
      },
    },
    {
      field: 'tipo_documento',
      headerName: 'Tipo',
      width: 80,
      flex: 0.1,
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 100,
      flex: 0.15,
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: 'saldo_restante',
      headerName: 'Saldo',
      width: 100,
      flex: 0.15,
      renderCell: (params) => {
        const isOverdue =
          new Date(params.row.fecha_vencimiento) < new Date() &&
          params.value > 0
        return (
          <Box
            sx={{
              color: isOverdue ? 'error.main' : 'inherit',
              fontWeight: isOverdue ? 'bold' : 'normal',
            }}
          >
            {formatCurrency(params.value)}
          </Box>
        )
      },
    },
    {
      field: 'condicion_pago',
      headerName: 'Condición',
      width: 100,
      flex: 0.15,
    },
  ]

  return (
    <Card>
      <CardHeader title="Facturas" titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            autoHeight
            rows={invoices || []}
            columns={invoiceColumns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            disableRowSelectionOnClick
            getRowId={(row) => row.no_factura}
            sx={{
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
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
