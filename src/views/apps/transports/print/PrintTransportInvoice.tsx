// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** React Imports
import { useEffect } from 'react'

// ** Custom Component Imports
import QRCodeComponent from 'src/views/ui/qrCode/QRCodeComponent'

// ** Types
import { useAuth } from 'src/hooks/useAuth'
import {
  EcfDocumentoType,
  ecfStatusLabels,
} from 'src/types/apps/ecfDocumentoTypes'
import { DocumentoEntregaType } from 'src/types/apps/transportType'
import formatCurrency from 'src/utils/formatCurrency'
import formatDate from 'src/utils/formatDate'
import {
  TransportStatusEnum,
  transportDocStatusLabels,
  transportStatusObj,
} from 'src/utils/transportMappings'

interface Props {
  data: DocumentoEntregaType
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

const CalcWrapper = styled(Box)(({ theme }) => ({
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

const CompanyLogo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '@media print': {
    marginBottom: theme.spacing(0.5),
  },
}))

const InvoiceTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.2rem',
  color: theme.palette.primary.main,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  '@media print': {
    fontSize: '0.9rem',
    color: '#000',
  },
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1rem',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  '@media print': {
    fontSize: '0.9rem',
    marginBottom: theme.spacing(0.5),
  },
}))

const InfoBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '@media print': {
    padding: theme.spacing(0.5),
    backgroundColor: '#f9f9f9',
    WebkitPrintColorAdjust: 'exact',
    printColorAdjust: 'exact',
  },
}))

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    '@media print': {
      backgroundColor: '#1976d2',
      fontSize: '0.75rem',
      WebkitPrintColorAdjust: 'exact',
      printColorAdjust: 'exact',
    },
  },
}))

const TotalBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  '@media print': {
    backgroundColor: '#1976d2',
    padding: theme.spacing(0.5),
    WebkitPrintColorAdjust: 'exact',
    printColorAdjust: 'exact',
  },
}))

const getStatusColor = (status: TransportStatusEnum | number) => {
  return transportStatusObj[status] || 'default'
}

const PrintTransportInvoice = ({ data }: Props) => {
  // ** Hook
  const theme = useTheme()
  const userData = useAuth()

  // Print styles to ensure proper page fitting for 8.5 x 11 inch paper
  useEffect(() => {
    const printStyles = `
      @media print {
        @page {
          size: 8.5in 11in;
          margin: 0.4in 0.3in;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body {
          font-size: 9px !important;
          line-height: 1.2 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .MuiCard-root {
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          page-break-inside: avoid;
          max-width: 100% !important;
        }
        
        .MuiCardContent-root {
          padding: 4px !important;
        }
        
        .MuiTypography-h5 {
          font-size: 12px !important;
        }
        
        .MuiTypography-h6 {
          font-size: 11px !important;
        }
        
        .MuiTypography-subtitle1 {
          font-size: 10px !important;
        }
        
        .MuiTypography-subtitle2 {
          font-size: 9px !important;
        }
        
        .MuiTypography-body2 {
          font-size: 8px !important;
        }
        
        .MuiTypography-caption {
          font-size: 7px !important;
        }
        
        .MuiTableContainer-root {
          margin: 4px 0 !important;
        }
        
        .MuiTable-root {
          font-size: 8px !important;
        }
        
        .MuiTableCell-root {
          padding: 2px 4px !important;
          font-size: 8px !important;
          border-bottom: 0.5px solid #ddd !important;
          line-height: 1.1 !important;
        }
        
        .MuiTableHead-root .MuiTableCell-root {
          background-color: #1976d2 !important;
          color: #fff !important;
          font-weight: bold !important;
          border-bottom: 1px solid #000 !important;
          padding: 3px 4px !important;
        }
        
        .MuiDivider-root {
          border-color: #000 !important;
          margin: 2px 0 !important;
        }
        
        .MuiChip-root {
          font-size: 7px !important;
          height: 14px !important;
        }
        
        .MuiGrid-container {
          display: flex !important;
          flex-wrap: nowrap !important;
        }
        
        .MuiGrid-root {
          margin: 0 !important;
        }
        
        .MuiBox-root {
          line-height: 1.1 !important;
        }
        
        .print-break {
          page-break-before: always;
        }
        
        .no-print {
          display: none !important;
        }
        
        .qr-code-container {
          page-break-inside: avoid;
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

  if (!data) {
    return null
  }

  const ecfDocument: EcfDocumentoType | undefined = data.ecfDocumento
  console.log('ecfDocument', ecfDocument)
  const selectedValue = (delivered: number, original: number) =>
    data.status === TransportStatusEnum.Entregado ? delivered : original

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
      {/* Print-friendly header with business info and document details */}
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
              {userData?.user?.business?.logoUrl && (
                <Box
                  component="img"
                  src={userData.user.business.logoUrl}
                  alt="Business Logo"
                  sx={{
                    width: 50,
                    height: 50,
                    objectFit: 'contain',
                    mr: 1,
                    '@media print': {
                      width: 40,
                      height: 40,
                    },
                  }}
                />
              )}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1.1rem', print: '0.9rem' },
                    lineHeight: 1.2,
                    '@media print': { color: '#000' },
                  }}
                >
                  {userData?.user?.business?.name || 'MSeller Cloud'}
                </Typography>
                {userData?.user?.business?.address && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: '0.75rem', print: '0.65rem' },
                      display: 'block',
                    }}
                  >
                    {typeof userData.user.business.address === 'string'
                      ? userData.user.business.address
                      : `${userData.user.business.address.street}, ${userData.user.business.address.city}, ${userData.user.business.address.country}`}
                  </Typography>
                )}
                {userData?.user?.business?.phone && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: '0.75rem', print: '0.65rem' },
                      display: 'block',
                    }}
                  >
                    Tel: {userData.user.business.phone}
                  </Typography>
                )}
                {userData?.user?.business?.rnc && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: '0.75rem', print: '0.65rem' },
                      display: 'block',
                    }}
                  >
                    RNC: {userData.user.business.rnc}
                  </Typography>
                )}
              </Box>
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
          >
            <InvoiceTitle sx={{ mb: 1 }}>
              {data.ecfDocumento.ncfDescripcion}
            </InvoiceTitle>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1rem', print: '0.8rem' },
                mb: 0.5,
              }}
            >
              #{data.noDocEntrega}
            </Typography>
            {ecfDocument?.ncf && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.875rem', print: '0.7rem' },
                  mb: 0.5,
                }}
              >
                NCF: {ecfDocument.ncf}
              </Typography>
            )}
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                flexWrap: 'wrap',
                mt: 0.5,
              }}
            >
              <StatusChip
                label={transportDocStatusLabels[data.status] || ''}
                color="primary"
                variant="filled"
                size="small"
              />
              {ecfDocument?.statusEcf && (
                <StatusChip
                  label={
                    ecfStatusLabels[ecfDocument.statusEcf] ||
                    ecfDocument.statusEcf
                  }
                  color="success"
                  variant="filled"
                  size="small"
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </PrintHeader>

      <CardContent
        sx={{
          padding: { xs: 2, print: 0.3 },
          '&:last-child': { paddingBottom: { xs: 2, print: 0.3 } },
        }}
      >
        <Grid container spacing={2}>
          {/* Company/Seller Info */}
          <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 2 } }}>
            <InfoBox>
              <SectionTitle>Información del Vendedor</SectionTitle>

              <Box sx={{ mb: 1.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.95rem', print: '0.8rem' },
                    color: 'text.primary',
                    mb: 0.3,
                  }}
                >
                  {data.vendedor.nombre}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.85rem', print: '0.7rem' },
                    color: 'text.secondary',
                  }}
                >
                  Código: <strong>{data.vendedor.codigo}</strong>
                </Typography>
              </Box>

              {userData?.user?.email && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: '0.75rem', print: '0.65rem' },
                      color: 'text.secondary',
                      display: 'block',
                      mb: 0.3,
                    }}
                  >
                    Emitido por
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.85rem', print: '0.7rem' },
                      color: 'text.primary',
                    }}
                  >
                    {userData.user.email}
                  </Typography>
                </Box>
              )}

              {ecfDocument && (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: '0.75rem', print: '0.65rem' },
                      color: 'text.secondary',
                      display: 'block',
                      mb: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    Información ECF
                  </Typography>
                  <Box
                    sx={{
                      pl: 1,
                      borderLeft: '3px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    {ecfDocument.securityCode && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.8rem', print: '0.68rem' },
                          mb: 0.3,
                        }}
                      >
                        <strong>Código:</strong> {ecfDocument.securityCode}
                      </Typography>
                    )}
                    {ecfDocument.internalTrackId && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.8rem', print: '0.68rem' },
                          mb: 0.3,
                        }}
                      >
                        <strong>Track ID:</strong> {ecfDocument.internalTrackId}
                      </Typography>
                    )}
                    {ecfDocument.signedDate && (
                      <Typography
                        variant="body2"
                        sx={{ fontSize: { xs: '0.8rem', print: '0.68rem' } }}
                      >
                        <strong>Fecha Firma:</strong>{' '}
                        {formatDate(ecfDocument.signedDate)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </InfoBox>
          </Grid>

          {/* Customer Info */}
          <Grid item sm={6} xs={12}>
            <InfoBox>
              <SectionTitle>Facturado a</SectionTitle>

              <Box sx={{ mb: 1.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.95rem', print: '0.8rem' },
                    color: 'text.primary',
                    mb: 0.3,
                  }}
                >
                  {data.cliente.nombre}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.85rem', print: '0.7rem' },
                    color: 'text.secondary',
                  }}
                >
                  Código: <strong>{data.cliente.codigo}</strong>
                </Typography>
              </Box>

              {data.cliente.direccion && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: '0.75rem', print: '0.65rem' },
                      color: 'text.secondary',
                      display: 'block',
                      mb: 0.3,
                    }}
                  >
                    Dirección
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.85rem', print: '0.7rem' },
                      color: 'text.primary',
                    }}
                  >
                    {data.cliente.direccion}
                    {data.cliente.ciudad && `, ${data.cliente.ciudad}`}
                  </Typography>
                </Box>
              )}

              <Grid container spacing={2}>
                {data.cliente.telefono1 && (
                  <Grid item xs={6}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: '0.75rem', print: '0.65rem' },
                        color: 'text.secondary',
                        display: 'block',
                        mb: 0.3,
                      }}
                    >
                      Teléfono
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.85rem', print: '0.7rem' },
                        color: 'text.primary',
                      }}
                    >
                      {data.cliente.telefono1}
                    </Typography>
                  </Grid>
                )}

                {data.cliente.rnc && (
                  <Grid item xs={6}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: '0.75rem', print: '0.65rem' },
                        color: 'text.secondary',
                        display: 'block',
                        mb: 0.3,
                      }}
                    >
                      RNC
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.85rem', print: '0.7rem' },
                        color: 'text.primary',
                        fontWeight: 600,
                      }}
                    >
                      {data.cliente.rnc}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </InfoBox>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ '@media print': { borderColor: '#000' } }} />

      {/* Document Details */}
      <CardContent
        sx={{
          padding: { xs: 2, print: 0.5 },
          backgroundColor: 'grey.50',
          '@media print': {
            backgroundColor: '#f5f5f5',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
          },
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={3} sm={3}>
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: '0.7rem', print: '0.65rem' },
                color: 'text.secondary',
                display: 'block',
                mb: 0.3,
              }}
            >
              Fecha Documento
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: '0.85rem', print: '0.75rem' },
                fontWeight: 600,
              }}
            >
              {formatDate(data.fecha)}
            </Typography>
          </Grid>

          {data.fechaEntrega && (
            <Grid item xs={3} sm={3}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: '0.7rem', print: '0.65rem' },
                  color: 'text.secondary',
                  display: 'block',
                  mb: 0.3,
                }}
              >
                Fecha Entrega
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.85rem', print: '0.75rem' },
                  fontWeight: 600,
                }}
              >
                {formatDate(data.fechaEntrega)}
              </Typography>
            </Grid>
          )}

          {data.noPedido && (
            <Grid item xs={3} sm={3}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: '0.7rem', print: '0.65rem' },
                  color: 'text.secondary',
                  display: 'block',
                  mb: 0.3,
                }}
              >
                No. Pedido
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.85rem', print: '0.75rem' },
                  fontWeight: 600,
                }}
              >
                {data.noPedido}
              </Typography>
            </Grid>
          )}

          {data.condicionPago && (
            <Grid item xs={3} sm={3}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: '0.7rem', print: '0.65rem' },
                  color: 'text.secondary',
                  display: 'block',
                  mb: 0.3,
                }}
              >
                Condición de Pago
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.85rem', print: '0.75rem' },
                  fontWeight: 600,
                }}
              >
                {data.condicion?.descripcion}
              </Typography>
            </Grid>
          )}

          {data.tipoPago && (
            <Grid item xs={3} sm={3}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: '0.7rem', print: '0.65rem' },
                  color: 'text.secondary',
                  display: 'block',
                  mb: 0.3,
                }}
              >
                Tipo de Pago
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.85rem', print: '0.75rem' },
                  fontWeight: 600,
                }}
              >
                {data.tipoPago}
              </Typography>
            </Grid>
          )}

          {data.referencia && (
            <Grid item xs={3} sm={3}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: '0.7rem', print: '0.65rem' },
                  color: 'text.secondary',
                  display: 'block',
                  mb: 0.3,
                }}
              >
                Referencia
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.85rem', print: '0.75rem' },
                  fontWeight: 600,
                }}
              >
                {data.referencia}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>

      <Divider sx={{ '@media print': { borderColor: '#000' } }} />

      {/* Product Details Table */}
      <TableContainer
        sx={{
          mb: 2,
          '@media print': {
            mb: 0.5,
          },
        }}
      >
        <Table size="small">
          <StyledTableHead>
            <TableRow>
              <TableCell sx={{ width: '8%' }}>Cant.</TableCell>
              <TableCell sx={{ width: '8%' }}>Un.</TableCell>
              <TableCell sx={{ width: '40%' }}>Producto</TableCell>
              <TableCell align="right" sx={{ width: '13%' }}>
                Precio
              </TableCell>
              <TableCell align="right" sx={{ width: '11%' }}>
                Desc.
              </TableCell>
              <TableCell align="right" sx={{ width: '10%' }}>
                ITBIS
              </TableCell>
              <TableCell align="right" sx={{ width: '10%' }}>
                Total
              </TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {data.detalle.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <TableCell
                  sx={{
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                    fontWeight: 600,
                  }}
                >
                  {item.cantidad_E}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  {item.unidad}
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', print: '0.7rem' },
                      lineHeight: 1.3,
                    }}
                  >
                    {item.producto.nombre}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: '0.75rem', print: '0.65rem' },
                      color: 'text.secondary',
                    }}
                  >
                    Código: {item.producto.codigo}
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  {formatCurrency(item.precioUnitario)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  {formatCurrency(item.totalDescuento_E)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  {formatCurrency(item.totalImpuesto_E)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', print: '0.7rem' },
                  }}
                >
                  {formatCurrency(item.subtotal_E)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* QR Code and Totals Section */}
      <CardContent
        sx={{
          padding: { xs: 2, print: 0.5 },
          '&:last-child': { paddingBottom: { xs: 2, print: 0.5 } },
        }}
      >
        <Grid container spacing={2}>
          {/* QR Code Section (left side) */}
          {ecfDocument?.qrUrl ? (
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                '@media print': {
                  flex: '0 0 50%',
                  maxWidth: '50%',
                },
              }}
            >
              <Box
                className="qr-code-container"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  justifyContent: 'flex-start',
                  '@media print': {
                    alignItems: 'flex-start',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', print: '0.75rem' },
                    mb: 1,
                  }}
                >
                  Comprobante Fiscal Electrónico
                </Typography>
                <QRCodeComponent
                  url={ecfDocument.qrUrl}
                  size={150}
                  printSize={100}
                  securityCode={ecfDocument.securityCode || undefined}
                  signedDate={
                    ecfDocument.signedDate
                      ? formatDate(ecfDocument.signedDate)
                      : undefined
                  }
                />
              </Box>
            </Grid>
          ) : (
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                '@media print': {
                  flex: '0 0 50%',
                  maxWidth: '50%',
                },
              }}
            />
          )}

          {/* Totals Section (right side) */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              '@media print': {
                flex: '0 0 50%',
                maxWidth: '50%',
              },
            }}
          >
            <Box
              sx={{
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 1,
                '@media print': {
                  p: 1,
                  backgroundColor: '#f5f5f5',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                },
              }}
            >
              <CalcWrapper>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: '0.9rem', print: '0.75rem' } }}
                >
                  Subtotal:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', print: '0.75rem' },
                  }}
                >
                  {formatCurrency(selectedValue(data.bruto_E, data.bruto))}
                </Typography>
              </CalcWrapper>

              <CalcWrapper>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: '0.9rem', print: '0.75rem' } }}
                >
                  Descuento:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', print: '0.75rem' },
                    color: 'success.main',
                  }}
                >
                  -
                  {formatCurrency(
                    selectedValue(data.descuento_E, data.descuento),
                  )}
                </Typography>
              </CalcWrapper>

              <CalcWrapper>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: '0.9rem', print: '0.75rem' } }}
                >
                  ITBIS:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', print: '0.75rem' },
                  }}
                >
                  {formatCurrency(
                    selectedValue(data.impuestos_E, data.impuestos),
                  )}
                </Typography>
              </CalcWrapper>

              <Divider
                sx={{
                  my: 1.5,
                  '@media print': { my: 0.5, borderColor: '#666' },
                }}
              />

              <TotalBox>
                <CalcWrapper sx={{ mb: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.1rem', print: '0.95rem' },
                      color: '#fff',
                    }}
                  >
                    TOTAL A PAGAR
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.3rem', print: '1.1rem' },
                      color: '#fff',
                    }}
                  >
                    {formatCurrency(selectedValue(data.neto_E, data.neto))}
                  </Typography>
                </CalcWrapper>
              </TotalBox>
            </Box>
          </Grid>
        </Grid>

        {/* Observations Section (bottom) */}
        {data.observacion && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '0.875rem', print: '0.75rem' },
                mb: 0.5,
              }}
            >
              Observaciones:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: '0.875rem', print: '0.75rem' },
                p: 1.5,
                backgroundColor: 'grey.50',
                borderRadius: 1,
                '@media print': {
                  p: 1,
                  backgroundColor: '#f5f5f5',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                },
              }}
            >
              {data.observacion}
            </Typography>
          </Box>
        )}
      </CardContent>

      <Divider sx={{ '@media print': { borderColor: '#000' } }} />

      {/* Footer */}
      <CardContent
        sx={{
          padding: { xs: 2, print: 0.5 },
          '&:last-child': { paddingBottom: { xs: 2, print: 0.5 } },
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
          Esta factura es válida como comprobante de pago. Conserve este
          documento para futuras referencias.
        </Typography>

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
            sx={{ fontSize: { xs: '0.75rem', print: '0.65rem' } }}
          >
            Generado el: {formatDate(new Date().toISOString())}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: { xs: '0.75rem', print: '0.65rem' } }}
          >
            Documento: {data.noDocEntrega}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: { xs: '0.75rem', print: '0.65rem' } }}
          >
            Usuario: {userData?.user?.email || 'N/A'}
          </Typography>
        </Box>

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
            sx={{ fontSize: { xs: '0.75rem', print: '0.65rem' } }}
          >
            Sistema de Gestión MSeller Cloud - Factura Electrónica
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PrintTransportInvoice
