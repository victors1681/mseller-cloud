import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React from 'react'
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
  // ** Responsive
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Mobile card component for each detail
  const DetailCard = ({
    detail,
    index,
  }: {
    detail: DocumentTypeDetail
    index: number
  }) => (
    <Card
      sx={{
        mb: 2,
        border:
          isEditingDetail === index
            ? `2px solid ${theme.palette.primary.main}`
            : '1px solid',
        borderColor: isEditingDetail === index ? 'primary.main' : 'divider',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 4,
          borderColor: 'primary.light',
        },
        transition: 'all 0.2s ease-in-out',
      }}
      onClick={() => onEditDetail(detail, index)}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Header with product code and promotion status */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: '1rem', fontWeight: 600 }}
          >
            {detail.codigoProducto}
          </Typography>
          {detail.promocion ? (
            <Chip
              label="Promoción"
              color="success"
              size="small"
              sx={{ fontSize: '0.75rem', height: 24 }}
            />
          ) : null}
        </Box>

        {/* Product description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1.5, fontSize: '0.875rem' }}
        >
          {detail.descripcion}
        </Typography>

        {/* Main details in a grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
            mb: 1.5,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.75rem' }}
            >
              Cantidad
            </Typography>
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{ fontSize: '0.875rem' }}
            >
              {detail.cantidad.toLocaleString()} {detail.unidad}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.75rem' }}
            >
              Precio Unit.
            </Typography>
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{ fontSize: '0.875rem' }}
            >
              {formatCurrency(detail.precio)}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.75rem' }}
            >
              Imp. / Desc.
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              {detail.porcientoImpuesto}% / {detail.porcientoDescuento}%
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.75rem' }}
            >
              Subtotal
            </Typography>
            <Typography
              variant="body1"
              fontWeight="bold"
              color="primary"
              sx={{ fontSize: '1rem' }}
            >
              {formatCurrency(detail.subTotal)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Divider />

      <CardActions sx={{ px: 2, py: 1, justifyContent: 'flex-end' }}>
        <IconButton
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation()
            onEditDetail(detail, index)
          }}
          title="Editar línea"
          sx={{
            p: 1,
            '&:hover': { backgroundColor: 'primary.light' },
          }}
        >
          <Icon icon="mdi:pencil" fontSize="1.125rem" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation()
            onDeleteDetail(index)
          }}
          title="Eliminar línea"
          sx={{
            p: 1,
            '&:hover': { backgroundColor: 'error.light' },
          }}
        >
          <Icon icon="mdi:delete" fontSize="1.125rem" />
        </IconButton>
      </CardActions>
    </Card>
  )
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title="Detalles del Documento"
          sx={{
            pb: isMobile ? 1 : 2,
            '& .MuiCardHeader-title': {
              fontSize: isMobile ? '1.125rem' : '1.25rem',
            },
          }}
        />
        <CardContent sx={{ px: isMobile ? 2 : 3, pt: 0 }}>
          {/* Desktop Table View */}
          {!isMobile ? (
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
                          isEditingDetail === index
                            ? 'action.hover'
                            : 'inherit',
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
                        <Typography
                          variant="body2"
                          sx={{ fontSize: '0.90rem' }}
                        >
                          {detail.descripcion}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: '0.90rem' }}
                        >
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
                        <Typography
                          variant="body2"
                          sx={{ fontSize: '0.90rem' }}
                        >
                          {detail.porcientoImpuesto}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: '0.90rem' }}
                        >
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
          ) : (
            /* Mobile Card View */
            <Box
              sx={{
                maxHeight: isSmallMobile ? '50vh' : '60vh',
                overflow: 'auto',
                px: 0.5,
              }}
            >
              {detailsData && detailsData.length > 0 ? (
                detailsData.map((detail, index) => (
                  <DetailCard
                    key={detail.id || index}
                    detail={detail}
                    index={index}
                  />
                ))
              ) : (
                <Card sx={{ textAlign: 'center', py: 4 }}>
                  <CardContent>
                    <Icon
                      icon="mdi:format-list-bulleted"
                      fontSize="3rem"
                      style={{ color: '#ccc', marginBottom: 16 }}
                    />
                    <Typography variant="body2" color="textSecondary">
                      No hay detalles disponibles
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      Agrega productos para comenzar
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  )
}
