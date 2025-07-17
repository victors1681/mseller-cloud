import React from 'react'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  IconButton,
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { DocumentTypeDetail } from 'src/types/apps/documentTypes'
import formatCurrency from 'src/utils/formatCurrency'

interface DetailsTableProps {
  detailsData: DocumentTypeDetail[]
  isEditingDetail: number | null
  onEditDetail: (detail: DocumentTypeDetail, index: number) => void
  onDeleteDetail: (index: number) => void
}

export const DetailsTable: React.FC<DetailsTableProps> = ({
  detailsData,
  isEditingDetail,
  onEditDetail,
  onDeleteDetail,
}) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title="Detalles del Documento" />
        <CardContent>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="document details table"
              size="medium"
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 1 }}>Código</TableCell>
                  <TableCell sx={{ py: 1 }}>Descripción</TableCell>
                  <TableCell sx={{ py: 1 }}>Unidad</TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    Cant.
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    Precio
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    % Imp.
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    % Desc.
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    Subtotal
                  </TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>
                    Promo
                  </TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detailsData?.map((detail, index) => (
                  <TableRow
                    key={detail.id || index}
                    onClick={() => onEditDetail(detail, index)}
                    sx={{
                      '&:last-child td, &:last-child th': {
                        border: 0,
                      },
                      backgroundColor:
                        isEditingDetail === index ? 'action.hover' : 'inherit',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ py: 0.5 }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{ fontSize: '0.90rem' }}
                      >
                        {detail.codigoProducto}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.90rem' }}>
                        {detail.descripcion}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.90rem' }}>
                        {detail.unidad}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: '0.90rem', fontWeight: '500' }}
                      >
                        {detail.cantidad.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: '0.90rem', fontWeight: '500' }}
                      >
                        {formatCurrency(detail.precio)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 0.5 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.90rem' }}>
                        {detail.porcientoImpuesto}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 0.5 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.90rem' }}>
                        {detail.porcientoDescuento}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 0.5 }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{ fontSize: '0.90rem' }}
                      >
                        {formatCurrency(detail.subTotal)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.5 }}>
                      {detail.promocion ? (
                        <Chip
                          label="Sí"
                          color="success"
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.65rem',
                            height: '20px',
                          }}
                        />
                      ) : (
                        <Chip
                          label="No"
                          color="default"
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.65rem',
                            height: '20px',
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.5 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 0.5,
                          justifyContent: 'center',
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditDetail(detail, index)
                          }}
                          title="Editar línea"
                          sx={{ p: 0.5 }}
                        >
                          <Icon icon="mdi:pencil" fontSize="1rem" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteDetail(index)
                          }}
                          title="Eliminar línea"
                          sx={{ p: 0.5 }}
                        >
                          <Icon icon="mdi:delete" fontSize="1rem" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {(!detailsData || detailsData.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No hay detalles disponibles
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>
  )
}
