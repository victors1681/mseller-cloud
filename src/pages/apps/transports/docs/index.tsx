// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
// ** Third Party Imports
import format from 'date-fns/format'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransportDocsData } from 'src/store/apps/transports'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { AppDispatch, RootState } from 'src/store'
import { DocumentoEntregaType } from 'src/types/apps/transportType'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Styled Components
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import formatCurrency from 'src/utils/formatCurrency'
import formatDate from 'src/utils/formatDate'
import EcfDocumentModal from 'src/views/apps/transports/docs/EcfDocumentModal'
import MapModal from 'src/views/apps/transports/docs/MapModal'
import CardStatisticsTransport from 'src/views/apps/transports/list/cards/statistics/CardStatisticsTransport'
import CardWidgetsDocsDeliveryOverview from 'src/views/apps/transports/list/cards/widgets/CardWidgetsDocsDeliveryOverview'
import {
  TransportStatusEnum,
  transportDocStatusLabels,
  transportStatusObj,
} from '../../../../utils/transportMappings'
import DocDetailModal from './docDetailModal'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {
  ecfStatusLabels,
  ecfStatusObj,
} from '../../../../types/apps/ecfDocumentoTypes'

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
  row: DocumentoEntregaType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'mdi:send' },
  Paid: { color: 'success', icon: 'mdi:check' },
  Draft: { color: 'primary', icon: 'mdi:content-save-outline' },
  'Partial Payment': { color: 'warning', icon: 'mdi:chart-pie' },
  'Past Due': { color: 'error', icon: 'mdi:information-outline' },
  Downloaded: { color: 'info', icon: 'mdi:arrow-down' },
}

// ** renders client column

const defaultColumns: GridColDef[] = [
  {
    flex: 0.15,
    field: 'id',
    minWidth: 120,
    headerName: '#',
    renderCell: ({ row }: CellType) => (
      <DocDetailModal title={row.noDocEntrega} data={row} />
    ),
  },
  {
    flex: 0.25,
    minWidth: 250,
    field: 'client',
    headerName: 'Cliente',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', textTransform: 'capitalize' }}
            >
              {row.cliente.nombre}
            </Typography>
            <Typography noWrap variant="caption">
              {row.cliente.codigo}
            </Typography>
          </Box>
        </Box>
      )
    },
  },
  {
    flex: 0.25,
    field: 'driver',
    minWidth: 200,
    headerName: 'Vendedor',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
    flex: 0.15,
    field: 'location',
    minWidth: 100,
    headerName: 'Total',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: 'text.primary', textTransform: 'capitalize' }}
            >
              {row.status === TransportStatusEnum.Entregado
                ? formatCurrency(row.bruto_E)
                : formatCurrency(row.bruto)}
            </Typography>
          </Box>
        </Box>
      )
    },
  },

  {
    flex: 0.18,
    minWidth: 150,
    field: 'date',
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
        <CustomChip
          skin="light"
          size="small"
          label={transportDocStatusLabels[row?.status] || ''}
          color={transportStatusObj[row.status]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    },
  },
]

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate =
    props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate =
    props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props?.dates?.length && props.setDates
    ? props.setDates([])
    : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return (
    <TextField
      fullWidth
      inputRef={ref}
      {...updatedProps}
      label={props.label || ''}
      value={value}
    />
  )
})
/* eslint-enable */

interface TransportDocsProps {
  noTransporte: string
}
const TransportDocs = (props: TransportDocsProps) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  })
  const [ecfModalOpen, setEcfModalOpen] = useState(false)
  const [selectedEcfDocument, setSelectedEcfDocument] = useState<any>(null)
  const [selectedDocumentTitle, setSelectedDocumentTitle] = useState<string>('')

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.transports)
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchTransportDocsData(props.noTransporte))
  }, [dispatch])

  const handleRefresh = () => {
    dispatch(fetchTransportDocsData(props.noTransporte))
  }

  const handlePrint = (row: DocumentoEntregaType) => {
    // Store the document data in sessionStorage
    sessionStorage.setItem('printTransportInvoice', JSON.stringify(row))

    // Open the print page in a new window
    const printUrl = `/apps/transports/print-invoice?doc=${row.noDocEntrega}`
    window.open(printUrl, '_blank', 'width=1024,height=768')
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 120,
      field: 'eCF',
      headerName: 'eCF',
      renderCell: ({ row }: CellType) => {
        const statusEcf = row?.ecfDocumento?.statusEcf
        const label = statusEcf ? ecfStatusLabels[statusEcf] || statusEcf : '-'
        const color =
          statusEcf && ecfStatusObj[statusEcf]
            ? ecfStatusObj[statusEcf]
            : 'secondary'

        const handleEcfClick = () => {
          if (statusEcf && row.ecfDocumento) {
            setSelectedEcfDocument(row.ecfDocumento)
            setSelectedDocumentTitle(row.noDocEntrega)
            setEcfModalOpen(true)
          }
        }

        return (
          <CustomChip
            skin="light"
            size="small"
            label={label}
            color={color as any}
            sx={{
              textTransform: 'capitalize',
              cursor: statusEcf ? 'pointer' : 'default',
              '&:hover': statusEcf
                ? {
                    opacity: 0.8,
                    transform: 'scale(1.02)',
                  }
                : {},
            }}
            onClick={statusEcf ? handleEcfClick : undefined}
          />
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MapModal data={[row]}></MapModal>
          {/* <SignatureModal url={row.firmaUrl} /> */}

          {row.ecfDocumento?.qrUrl ? (
            <Tooltip title="Ver información del comprobante fiscal">
              <IconButton
                type="button"
                size="small"
                onClick={() => {
                  setSelectedEcfDocument(row.ecfDocumento)
                  setSelectedDocumentTitle(row.noDocEntrega)
                  setEcfModalOpen(true)
                }}
                sx={{
                  color: 'success.main',
                  '&:hover': {
                    backgroundColor: 'success.light',
                    color: 'success.dark',
                  },
                }}
              >
                <Icon icon="material-symbols:receipt" fontSize={20} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Comprobante fiscal no disponible">
              <IconButton type="button" size="small" disabled>
                <Icon icon="material-symbols:receipt" fontSize={20} />
              </IconButton>
            </Tooltip>
          )}

          {row.status === TransportStatusEnum.Entregado &&
          row.ecfDocumento?.ncf ? (
            <Tooltip title="Imprimir factura de transporte">
              <IconButton
                type="button"
                size="small"
                onClick={() => handlePrint(row)}
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.dark',
                  },
                }}
              >
                <Icon icon="mdi:printer" fontSize={20} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Imprimir disponible solo para documentos entregados con NCF">
              <span>
                <IconButton type="button" size="small" disabled>
                  <Icon icon="mdi:printer" fontSize={20} />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <CardStatisticsTransport
            docsData={store.docsData}
            isLoading={store.isLoading}
            onRefresh={handleRefresh}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CardWidgetsDocsDeliveryOverview
            docsData={store.docsData}
            isLoading={store.isLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <DataGrid
              autoHeight
              pagination
              rows={store.docsData?.documentos || []}
              columns={columns}
              disableRowSelectionOnClick
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              getRowId={(row) => row.noDocEntrega}
              loading={store.isLoading}
            />
          </Card>
        </Grid>
      </Grid>

      {/* ECF Document Modal */}
      <EcfDocumentModal
        open={ecfModalOpen}
        onClose={() => setEcfModalOpen(false)}
        ecfDocumento={selectedEcfDocument}
        documentTitle={selectedDocumentTitle}
      />
    </DatePickerWrapper>
  )
}

export default TransportDocs
