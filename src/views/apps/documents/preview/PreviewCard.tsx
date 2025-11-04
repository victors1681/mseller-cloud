// ** MUI Imports
import Alert from '@mui/material/Alert'
import Box, { BoxProps } from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

// ** React Imports
import { useEffect } from 'react'

// ** Configs

// ** Custom Component Imports
import QRCodeComponent from 'src/views/ui/qrCode'

// ** Types
import { useAuth } from 'src/hooks/useAuth'
import {
  DocumentStatus,
  DocumentType,
  TipoDocumentoEnum,
} from 'src/types/apps/documentTypes'
import formatCurrency from 'src/utils/formatCurrency'
import formatDate from 'src/utils/formatDate'
import formattedNumber from 'src/utils/formattedNumber'
import { orderStatusLabels } from 'src/views/apps/documents/list/tableColRows'

interface Props {
  data: DocumentType
}

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`,
  '@media print': {
    paddingTop: `${theme.spacing(0.5)} !important`,
    paddingBottom: `${theme.spacing(0.5)} !important`,
    fontSize: '0.75rem',
  },
}))

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(1),
  },
  '@media print': {
    marginBottom: theme.spacing(0.5),
    fontSize: '0.85rem',
  },
}))

const PrintHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '@media print': {
    backgroundColor: 'transparent',
    border: `1px solid #000`,
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(0.5),
  },
}))

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.65rem',
  height: 20,
  '@media print': {
    fontSize: '0.6rem',
    height: 18,
  },
}))

const getStatusColor = (status: DocumentStatus | number) => {
  const statusColors: {
    [key: string]:
      | 'success'
      | 'warning'
      | 'error'
      | 'info'
      | 'primary'
      | 'secondary'
  } = {
    '0': 'warning', // Pending
    '1': 'success', // Processed
    '3': 'info', // Retained
    '5': 'primary', // PendingPrint
    '6': 'secondary', // CreditCondition
    '7': 'secondary', // Backorder
    '8': 'error', // IntegrationError
    '9': 'info', // ReadyForIntegration
    '10': 'success', // SentToERP
  }
  return statusColors[status.toString()] || 'default'
}

const PreviewCard = ({ data }: Props) => {
  // ** Hook
  const theme = useTheme()
  const userData = useAuth()

  // Print styles to ensure proper page fitting
  useEffect(() => {
    const printStyles = `
      @media print {
        @page {
          size: letter;
          margin: 0.5in;
        }
        
        body {
          font-size: 12px !important;
          line-height: 1.3 !important;
        }
        
        .MuiCard-root {
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          page-break-inside: avoid;
        }
        
        .MuiCardContent-root {
          padding: 8px !important;
        }
        
        .MuiTypography-h5 {
          font-size: 16px !important;
        }
        
        .MuiTypography-h6 {
          font-size: 14px !important;
        }
        
        .MuiTypography-subtitle1 {
          font-size: 13px !important;
        }
        
        .MuiTypography-subtitle2 {
          font-size: 12px !important;
        }
        
        .MuiTypography-body2 {
          font-size: 11px !important;
        }
        
        .MuiTableContainer-root {
          margin: 8px 0 !important;
        }
        
        .MuiTable-root {
          font-size: 10px !important;
        }
        
        .MuiTableCell-root {
          padding: 4px 6px !important;
          font-size: 10px !important;
          border-bottom: 1px solid #ddd !important;
        }
        
        .MuiTableHead-root .MuiTableCell-root {
          background-color: #f5f5f5 !important;
          font-weight: bold !important;
          border-bottom: 2px solid #000 !important;
        }
        
        .MuiDivider-root {
          border-color: #000 !important;
          margin: 4px 0 !important;
        }
        
        .MuiChip-root {
          font-size: 8px !important;
          height: 16px !important;
        }
        
        .MuiAlert-root {
          font-size: 10px !important;
          padding: 8px !important;
          margin: 4px 0 !important;
        }
        
        .print-break {
          page-break-before: always;
        }
        
        .no-print {
          display: none !important;
        }
      }
    `

    const styleSheet = document.createElement('style')
    styleSheet.type = 'text/css'
    styleSheet.innerText = printStyles
    document.head.appendChild(styleSheet)

    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  if (data) {
    return (
      <Card
        sx={{
          '@media print': {
            boxShadow: 'none',
            border: 'none',
            fontSize: '0.85rem',
            lineHeight: 1.2,
          },
        }}
      >
        {/* Print-friendly header with document status and key info */}
        <PrintHeader>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6} sm={8}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                  '@media print': {
                    flexWrap: 'nowrap',
                    gap: 0.5,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1.1rem', print: '0.9rem' },
                    '@media print': { color: '#000' },
                    mr: 1,
                  }}
                >
                  {data.tipoDocumento === TipoDocumentoEnum.ORDER
                    ? 'ORDEN DE COMPRA'
                    : data.tipoDocumento === TipoDocumentoEnum.QUOTE
                    ? 'COTIZACIÓN'
                    : 'FACTURA'}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', print: '0.8rem' },
                    mr: 1,
                  }}
                >
                  #{data.noPedidoStr}
                </Typography>
                <StatusChip
                  label={orderStatusLabels[data.procesado] || 'Desconocido'}
                  color={getStatusColor(data.procesado)}
                  variant="filled"
                  size="small"
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={6}
              sm={4}
              sx={{
                textAlign: { xs: 'left', sm: 'right' },
                '@media print': {
                  textAlign: 'right',
                },
              }}
            ></Grid>
          </Grid>
        </PrintHeader>

        <CardContent
          sx={{
            padding: { xs: 2, print: 0.5 },
            '&:last-child': { paddingBottom: { xs: 2, print: 0.5 } },
          }}
        >
          <Grid container spacing={1}>
            <Grid item sm={6} xs={6} sx={{ mb: { sm: 0, xs: 1 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    '@media print': {
                      mb: 0.5,
                    },
                  }}
                >
                  {userData.user?.business.logoUrl && (
                    <img
                      src={userData.user?.business.logoUrl || ''}
                      height={40}
                      alt={userData.user?.business.name || 'Company Logo'}
                    />
                  )}
                  {!userData.user?.business.logoUrl && (
                    <Typography
                      variant="subtitle1"
                      sx={{
                        ml: 1.5,
                        fontWeight: 600,
                        lineHeight: 'normal',
                        textTransform: 'uppercase',
                        fontSize: { xs: '1rem', print: '0.8rem' },
                      }}
                    >
                      {userData.user?.business.name}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: 0.5,
                    '@media print': {
                      gap: 0.25,
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.7rem' },
                    }}
                  >
                    Dirección:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.875rem', print: '0.7rem' },
                    }}
                  >
                    {userData.user?.business.address.street}{' '}
                    {userData.user?.business.address.city}
                  </Typography>
                  {userData.user?.business.rnc && (
                    <>
                      {' '}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', print: '0.7rem' },
                        }}
                      >
                        RNC:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.875rem', print: '0.7rem' },
                        }}
                      >
                        {userData.user?.business.rnc}
                      </Typography>
                    </>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.7rem' },
                    }}
                  >
                    Teléfono:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.875rem', print: '0.7rem' },
                    }}
                  >
                    {userData.user?.business.phone}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.7rem' },
                    }}
                  >
                    Web:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.875rem', print: '0.7rem' },
                    }}
                  >
                    {userData.user?.business.website}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto auto',
                    gap: 0.5,
                    alignItems: 'center',
                    '@media print': {
                      gap: 0.25,
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.7rem' },
                    }}
                  >
                    Tipo de Documento:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.875rem', print: '0.7rem' },
                    }}
                  >
                    {data.tipoDocumento === TipoDocumentoEnum.ORDER
                      ? 'Pedido'
                      : data.tipoDocumento === TipoDocumentoEnum.QUOTE
                      ? 'Cotización'
                      : 'Factura'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.7rem' },
                    }}
                  >
                    No. Documento:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.875rem', print: '0.7rem' },
                    }}
                  >
                    {data.noPedidoStr}
                  </Typography>
                  {data.secuenciaDocumento && (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', print: '0.7rem' },
                        }}
                      >
                        Secuencia:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.875rem', print: '0.7rem' },
                        }}
                      >
                        {data.secuenciaDocumento}
                      </Typography>
                    </>
                  )}
                  {data.noOrden && (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', print: '0.7rem' },
                        }}
                      >
                        No. Orden:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.875rem', print: '0.7rem' },
                        }}
                      >
                        {data.noOrden}
                      </Typography>
                    </>
                  )}
                  {data.ncf && (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', print: '0.7rem' },
                        }}
                      >
                        {data.ncf?.substring(0, 1) === 'E' ? 'eCF:' : 'NCF:'}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.875rem', print: '0.7rem' },
                        }}
                      >
                        {data.ncf}
                      </Typography>
                    </>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.7rem' },
                    }}
                  >
                    Fecha Emisión:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.7rem' },
                    }}
                  >
                    {formatDate(data.fecha)}
                  </Typography>
                  {data.fechaVencimiento &&
                    data.tipoDocumento === TipoDocumentoEnum.ORDER &&
                    (data.condicion?.dias || 0) > 0 && (
                      <>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: '0.875rem', print: '0.7rem' },
                          }}
                        >
                          Fecha Vencimiento:
                        </Typography>
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{
                            fontSize: { xs: '0.875rem', print: '0.7rem' },
                            '@media print': { color: '#666' },
                          }}
                        >
                          {formatDate(data.fechaVencimiento)}
                        </Typography>
                      </>
                    )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ '@media print': { borderColor: '#000' } }} />

        <CardContent
          sx={{
            padding: { xs: 2, print: 0.5 },
            '&:last-child': { paddingBottom: { xs: 2, print: 0.5 } },
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={6} sm={6} sx={{ mb: { lg: 0, xs: 1 } }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 0.5,
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  fontSize: { xs: '1rem', print: '0.8rem' },
                  '@media print': { color: '#000' },
                }}
              >
                INFORMACIÓN DEL CLIENTE
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 0.5,
                  '@media print': {
                    gap: 0.25,
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  Nombre:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  {data.cliente?.nombre || data.nombreCliente}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  Código:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  {data.codigoCliente}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  RNC:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  {data.cliente?.rnc || 'N/A'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  Dirección:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  {data.cliente?.direccion} {data.cliente?.ciudad}
                </Typography>
                {data.cliente?.email && (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', print: '0.7rem' },
                      }}
                    >
                      Email:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.875rem', print: '0.7rem' },
                      }}
                    >
                      {data.cliente.email}
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={6} sm={6} sx={{ mb: { lg: 0, xs: 1 } }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 0.5,
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  fontSize: { xs: '1rem', print: '0.8rem' },
                  '@media print': { color: '#000' },
                }}
              >
                DETALLES DE VENTA
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 0.5,
                  '@media print': {
                    gap: 0.25,
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  Teléfono:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  {data.cliente?.telefono1 || 'N/A'}
                </Typography>
                {data.tipoDocumento === TipoDocumentoEnum.ORDER &&
                  (data.condicion?.dias || 0) > 0 && (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', print: '0.7rem' },
                        }}
                      >
                        Condición de Pago:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.875rem', print: '0.7rem' },
                        }}
                      >
                        {data.condicion?.descripcion || data.condicionPago}
                      </Typography>
                    </>
                  )}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  Localidad:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  {data.localidad?.descripcion || 'N/A'}
                </Typography>
                {data.tipoPedido && (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', print: '0.7rem' },
                      }}
                    >
                      Tipo de Pedido:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.875rem', print: '0.7rem' },
                      }}
                    >
                      {data.tipoPedido}
                    </Typography>
                  </>
                )}
                {data.confirmado && (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', print: '0.7rem' },
                      }}
                    >
                      Estado:
                    </Typography>
                    <Box>
                      <StatusChip
                        label="CONFIRMADO"
                        color="success"
                        variant="filled"
                        size="small"
                      />
                    </Box>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ '@media print': { borderColor: '#000' } }} />

        {/* Enhanced table with better formatting */}
        <TableContainer
          sx={{
            mb: 1,
            '@media print': {
              mb: 0.5,
              fontSize: '0.65rem',
              '& .MuiTableCell-root': {
                padding: '2px 4px',
                fontSize: '0.65rem',
                lineHeight: 1.1,
              },
            },
          }}
        >
          <Table size="small">
            <TableHead
              sx={{
                backgroundColor: theme.palette.grey[100],
                '@media print': {
                  backgroundColor: '#f5f5f5',
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid #000',
                    fontWeight: 'bold',
                    padding: '2px 4px',
                    fontSize: '0.65rem',
                  },
                },
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', print: '0.65rem' },
                  }}
                >
                  Cant.
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', print: '0.65rem' },
                  }}
                >
                  Código
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', print: '0.65rem' },
                  }}
                >
                  Unidad
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', print: '0.65rem' },
                  }}
                >
                  Descripción
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', print: '0.65rem' },
                  }}
                >
                  Desc. %
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', print: '0.65rem' },
                  }}
                >
                  Precio Unit.
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', print: '0.65rem' },
                  }}
                >
                  Impuesto
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', print: '0.65rem' },
                  }}
                >
                  SubTotal
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.detalle.map((detalle, index) => (
                <TableRow
                  key={detalle.id || index}
                  sx={{
                    '&:nth-of-type(even)': {
                      backgroundColor: theme.palette.grey[50],
                    },
                    '@media print': {
                      '&:nth-of-type(even)': {
                        backgroundColor: '#f9f9f9',
                      },
                      '& .MuiTableCell-root': {
                        borderBottom: '0.5px solid #ddd',
                        padding: '2px 4px',
                        fontSize: '0.65rem',
                      },
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.65rem' },
                    }}
                  >
                    {formattedNumber(detalle.cantidad)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: '0.875rem', print: '0.65rem' },
                    }}
                  >
                    {detalle.codigoProducto}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: '0.875rem', print: '0.65rem' },
                    }}
                  >
                    {detalle.unidad}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 180,
                      fontSize: { xs: '0.875rem', print: '0.65rem' },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', print: '0.7rem' },
                      }}
                    >
                      {detalle.descripcion}
                    </Typography>
                    {detalle.promocion && (
                      <Chip
                        label="PROMOCIÓN"
                        color="secondary"
                        size="small"
                        variant="outlined"
                        sx={{
                          mt: 0.25,
                          fontSize: { xs: '0.65rem', print: '0.6rem' },
                          height: { xs: 16, print: 14 },
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: '0.875rem', print: '0.65rem' },
                    }}
                  >
                    {formattedNumber(detalle.porcientoDescuento)}%
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.65rem' },
                    }}
                  >
                    {formatCurrency(detalle.precio)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: '0.875rem', print: '0.65rem' },
                    }}
                  >
                    {formatCurrency(detalle.impuesto)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '0.875rem', print: '0.65rem' },
                    }}
                  >
                    {formatCurrency(detalle.subTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent
          sx={{
            padding: { xs: 2, print: 1 },
            '&:last-child': { paddingBottom: { xs: 2, print: 1 } },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} sm={7} lg={8} sx={{ order: { sm: 1, xs: 1 } }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  fontSize: { xs: '1rem', print: '0.85rem' },
                  '@media print': { color: '#000' },
                }}
              >
                INFORMACIÓN ADICIONAL
              </Typography>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{
                    mr: 2,
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.75rem' },
                  }}
                >
                  Vendedor:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.875rem', print: '0.75rem' },
                  }}
                >
                  {data.vendedor?.codigo || data.codigoVendedor}-
                  {data.vendedor?.nombre || 'N/A'}
                </Typography>
              </Box>
              {data.vendedor?.email && (
                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mr: 2,
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.75rem' },
                    }}
                  >
                    Email Vendedor:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.875rem', print: '0.75rem' },
                    }}
                  >
                    {data.vendedor.email}
                  </Typography>
                </Box>
              )}
              {data.nota && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: { xs: '0.875rem', print: '0.75rem' },
                    }}
                  >
                    Observaciones:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      p: 1,
                      backgroundColor: theme.palette.grey[50],
                      borderRadius: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      fontSize: { xs: '0.875rem', print: '0.75rem' },
                      '@media print': {
                        backgroundColor: 'transparent',
                        border: '1px solid #ccc',
                      },
                    }}
                  >
                    {data.nota}
                  </Typography>
                </Box>
              )}

              {/* QR Code - Left side positioning */}
              {data.qrUrl && (
                <Box
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                >
                  <QRCodeComponent
                    url={data.qrUrl}
                    securityCode={data.securityCode}
                    signedDate={data.signedDate}
                  />
                </Box>
              )}
            </Grid>
            <Grid
              item
              xs={6}
              sm={5}
              lg={4}
              sx={{
                mb: { sm: 0, xs: 2 },
                order: { sm: 2, xs: 2 },
                textAlign: { xs: 'right', sm: 'left' },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  fontSize: { xs: '1rem', print: '0.85rem' },
                  '@media print': { color: '#000' },
                }}
              >
                RESUMEN FINANCIERO
              </Typography>
              <CalcWrapper>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.75rem' },
                  }}
                >
                  Subtotal:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.75rem' },
                  }}
                >
                  {formatCurrency(data.subTotal)}
                </Typography>
              </CalcWrapper>
              {(data.descuento || 0) > 0 && (
                <CalcWrapper>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.75rem' },
                    }}
                  >
                    Descuento:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: 'success.main',
                      fontSize: { xs: '0.875rem', print: '0.75rem' },
                      '@media print': { color: '#000' },
                    }}
                  >
                    -{formatCurrency(data.descuento)}
                  </Typography>
                </CalcWrapper>
              )}
              <CalcWrapper>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.75rem' },
                  }}
                >
                  Impuesto (ITBIS):
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.75rem' },
                  }}
                >
                  {formatCurrency(data.impuesto)}
                </Typography>
              </CalcWrapper>
              {data.isc > 0 && (
                <CalcWrapper>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.75rem' },
                    }}
                  >
                    ISC:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.75rem' },
                    }}
                  >
                    {formatCurrency(data.isc)}
                  </Typography>
                </CalcWrapper>
              )}
              {data.adv > 0 && (
                <CalcWrapper>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.75rem' },
                    }}
                  >
                    ADV:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.75rem' },
                    }}
                  >
                    {formatCurrency(data.adv)}
                  </Typography>
                </CalcWrapper>
              )}
              <Divider
                sx={{
                  my: 1,
                  '@media print': { borderColor: '#000' },
                }}
              />
              <CalcWrapper>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.1rem', print: '0.9rem' },
                  }}
                >
                  TOTAL:
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1.1rem', print: '0.9rem' },
                    '@media print': { color: '#000' },
                  }}
                >
                  {formatCurrency(data.total)}
                </Typography>
              </CalcWrapper>
            </Grid>
          </Grid>
        </CardContent>

        {/* Warnings and important notices */}
        {data.impedimento && (
          <>
            <Divider sx={{ '@media print': { borderColor: '#000' } }} />
            <CardContent
              sx={{
                padding: { xs: 2, print: 1 },
                '&:last-child': { paddingBottom: { xs: 2, print: 1 } },
              }}
            >
              <Alert
                severity="warning"
                sx={{
                  mb: 1,
                  fontSize: { xs: '0.875rem', print: '0.75rem' },
                  '& .MuiAlert-message': {
                    fontSize: { xs: '0.875rem', print: '0.75rem' },
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.75rem' },
                  }}
                >
                  IMPEDIMENTO ACTIVO
                </Typography>
                {data.notaImpedimento && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      fontSize: { xs: '0.875rem', print: '0.75rem' },
                    }}
                  >
                    {data.notaImpedimento}
                  </Typography>
                )}
              </Alert>
            </CardContent>
          </>
        )}

        {data.mensajesError && (
          <>
            <Divider sx={{ '@media print': { borderColor: '#000' } }} />
            <CardContent
              sx={{
                padding: { xs: 2, print: 1 },
                '&:last-child': { paddingBottom: { xs: 2, print: 1 } },
              }}
            >
              <Alert
                severity="error"
                sx={{
                  fontSize: { xs: '0.875rem', print: '0.75rem' },
                  '& .MuiAlert-message': {
                    fontSize: { xs: '0.875rem', print: '0.75rem' },
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.75rem' },
                  }}
                >
                  Errores de Procesamiento:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    fontSize: { xs: '0.875rem', print: '0.75rem' },
                  }}
                >
                  {data.mensajesError}
                </Typography>
              </Alert>
            </CardContent>
          </>
        )}

        <Divider sx={{ '@media print': { borderColor: '#000' } }} />

        <CardContent
          sx={{
            padding: { xs: 2, print: 1 },
            '&:last-child': { paddingBottom: { xs: 2, print: 1 } },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              fontSize: { xs: '0.875rem', print: '0.75rem' },
            }}
          >
            Términos y Condiciones:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontSize: { xs: '0.875rem', print: '0.75rem' },
            }}
          >
            {userData.user?.business.footerMessage ||
              'Gracias por su preferencia.'}
          </Typography>

          {/* Footer with additional document info */}
          <Box
            sx={{
              mt: 2,
              pt: 1,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
              '@media print': {
                borderTop: '1px solid #000',
                fontSize: '0.7rem',
              },
            }}
          >
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{
                fontSize: { xs: '0.75rem', print: '0.65rem' },
              }}
            >
              Documento generado el {formatDate(new Date().toISOString())}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{
                fontSize: { xs: '0.75rem', print: '0.65rem' },
              }}
            >
              Estado: {orderStatusLabels[data.procesado] || 'Desconocido'}
            </Typography>
            {data.fechaProcesado && (
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  fontSize: { xs: '0.75rem', print: '0.65rem' },
                }}
              >
                Procesado: {formatDate(data.fechaProcesado)}
              </Typography>
            )}
          </Box>

          {/* MSeller branding */}
          <Box
            sx={{
              mt: 1,
              textAlign: 'center',
              borderTop: `1px solid ${theme.palette.divider}`,
              pt: 0.5,
              '@media print': {
                borderTop: '1px solid #ddd',
              },
            }}
          >
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{
                fontSize: { xs: '0.7rem', print: '0.6rem' },
                fontStyle: 'italic',
              }}
            >
              Documento generado por mseller.app
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  } else {
    return null
  }
}

export default PreviewCard
