// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  Hidden,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Type Imports
import { ProductType, ProductoStockDTO } from 'src/types/apps/productTypes'

// ** Utils
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { formatCurrency } from 'src/utils/formatCurrency'

interface ProductDetailModalProps {
  open: boolean
  onClose: () => void
  product: ProductType | null
}

// ** Styled Components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    overflow: 'visible',
    borderRadius: theme.spacing(2),
  },
}))

const StyledCard = styled(Card)(({ theme }) => ({
  border: 0,
  boxShadow: theme.shadows[0],
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
}))

const InfoCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  transition: 'border 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[3],
  },
}))

const StatsAvatar = styled(Avatar)(({ theme }) => ({
  width: 44,
  height: 44,
  boxShadow: theme.shadows[3],
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
}))

const ProductImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}))

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  fontWeight: 600,
  [theme.breakpoints.down('sm')]: {
    minWidth: 'auto',
    minHeight: 40,
  },
  [theme.breakpoints.up('sm')]: {
    minWidth: 120,
  },
}))

const ProductDetailModal = ({
  open,
  onClose,
  product,
}: ProductDetailModalProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!product) return null

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const handleCloseImageModal = () => {
    setSelectedImage(null)
  }

  const StockCard = ({ stock }: { stock: ProductoStockDTO }) => (
    <InfoCard sx={{ mb: 2 }}>
      <CardContent
        sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StatsAvatar sx={{ mr: 2 }}>
            <Icon icon="mdi:warehouse" />
          </StatsAvatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
            >
              {stock.localidadNombre || `Localidad ${stock.localidadId}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID Stock: {stock.id}
            </Typography>
          </Box>
          <CustomChip
            skin="light"
            size="small"
            label={stock.existencia > 0 ? 'En Stock' : 'Sin Stock'}
            color={stock.existencia > 0 ? 'success' : 'error'}
          />
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  color: stock.existencia > 0 ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                {stock.existencia.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unidades
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(stock.ultimaActualizacion).toLocaleDateString(
                  'es-ES',
                  {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  },
                )}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(stock.ultimaActualizacion).toLocaleTimeString(
                  'es-ES',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  },
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </InfoCard>
  )

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
      PaperProps={{
        sx: {
          minHeight: { xs: '100vh', sm: '80vh' },
          maxHeight: { xs: '100vh', sm: '90vh' },
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StatsAvatar sx={{ mr: 2 }}>
            <Icon icon="mdi:package-variant" />
          </StatsAvatar>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 600,
              }}
            >
              {product.nombre}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 0.5,
              }}
            >
              <Icon icon="mdi:barcode" style={{ marginRight: 8 }} />
              {product.codigo}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Edit Button */}
          <Tooltip title="Editar Producto">
            <IconButton
              component={Link}
              href={`/apps/products/add/${product.codigo}`}
              size="small"
              color="primary"
            >
              <Icon icon="mdi:pencil" />
            </IconButton>
          </Tooltip>

          {/* Inventory Movements Button */}
          <Tooltip title="Ver Movimientos de Inventario">
            <IconButton
              component={Link}
              href={`/apps/inventory-management/movements?productCode=${product.codigo}`}
              size="small"
              color="info"
            >
              <Icon icon="mdi:chart-line" />
            </IconButton>
          </Tooltip>

          {/* Close Button */}
          <IconButton onClick={onClose} size="small">
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 1, sm: 2 } }}>
        {/* Product Basic Information */}
        <InfoCard sx={{ mb: 3 }}>
          <CardHeader
            title="Información General"
            avatar={
              <StatsAvatar
                sx={{
                  backgroundColor: hexToRGBA(theme.palette.info.main, 0.12),
                  color: 'info.main',
                }}
              >
                <Icon icon="mdi:information-outline" />
              </StatsAvatar>
            }
            titleTypographyProps={{
              variant: 'h6',
              sx: { fontSize: { xs: '1.1rem', sm: '1.25rem' } },
            }}
            sx={{ pb: 1 }}
          />
          <CardContent sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Nombre
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                  {product.nombre}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Código de Barra
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.codigoBarra || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Descripción
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.descripcion || 'Sin descripción'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Área
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.area} ({product.iDArea})
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Departamento
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.departamento}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Unidad
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.unidad}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Empaque
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.empaque}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Estado
                </Typography>
                <CustomChip
                  skin="light"
                  label={product.status === 'A' ? 'Activo' : 'Inactivo'}
                  color={product.status === 'A' ? 'success' : 'error'}
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
        </InfoCard>

        {/* Product Images */}
        {product.imagenes && product.imagenes.length > 0 && (
          <InfoCard sx={{ mb: 3 }}>
            <CardHeader
              title="Imágenes del Producto"
              avatar={
                <StatsAvatar
                  sx={{
                    backgroundColor: hexToRGBA(
                      theme.palette.secondary.main,
                      0.12,
                    ),
                    color: 'secondary.main',
                  }}
                >
                  <Icon icon="mdi:image-multiple" />
                </StatsAvatar>
              }
              titleTypographyProps={{
                variant: 'h6',
                sx: { fontSize: { xs: '1.1rem', sm: '1.25rem' } },
              }}
              sx={{ pb: 1 }}
            />
            <CardContent sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {product?.imagenes?.length > 0 &&
                  product?.imagenes
                    ?.sort(
                      (a, b) => a.ordenVisualizacion - b.ordenVisualizacion,
                    )
                    .map((image, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            transition:
                              'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: theme.shadows[8],
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="140"
                            image={image.rutaPublica || image.ruta}
                            alt={image.titulo || product.nombre}
                            onClick={() =>
                              handleImageClick(image.rutaPublica || image.ruta)
                            }
                            sx={{
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                          {image.esImagenPredeterminada && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'success.main',
                                borderRadius: '50%',
                                p: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Icon
                                icon="mdi:star"
                                color="white"
                                fontSize="0.8rem"
                              />
                            </Box>
                          )}
                          {image.titulo && (
                            <CardContent
                              sx={{ p: 1, '&:last-child': { pb: 1 } }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                              >
                                {image.titulo}
                              </Typography>
                            </CardContent>
                          )}
                        </Card>
                      </Grid>
                    ))}
              </Grid>
            </CardContent>
          </InfoCard>
        )}

        {/* Pricing Information */}
        <InfoCard sx={{ mb: 3 }}>
          <CardHeader
            title="Precios y Costos"
            avatar={
              <StatsAvatar
                sx={{
                  backgroundColor: hexToRGBA(theme.palette.success.main, 0.12),
                  color: 'success.main',
                }}
              >
                <Icon icon="mdi:currency-usd" />
              </StatsAvatar>
            }
            titleTypographyProps={{
              variant: 'h6',
              sx: { fontSize: { xs: '1.1rem', sm: '1.25rem' } },
            }}
            sx={{ pb: 1 }}
          />
          <CardContent sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Costo
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  {formatCurrency(product.costo)}
                </Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Precio 1
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  {formatCurrency(product.precio1)}
                </Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Precio 2
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(product.precio2)}
                </Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Precio 3
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(product.precio3)}
                </Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Impuesto
                </Typography>
                <Typography variant="body1">{product.impuesto}%</Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Factor
                </Typography>
                <Typography variant="body1">{product.factor}</Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Descuento
                </Typography>
                <Typography variant="body1">{product.descuento}%</Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  ISC
                </Typography>
                <Typography variant="body1">{product.iSC}%</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </InfoCard>

        {/* Stock Information */}
        {product.existencias && product.existencias.length > 0 && (
          <InfoCard>
            <CardHeader
              title="Existencias por Localidad"
              avatar={
                <StatsAvatar
                  sx={{
                    backgroundColor: hexToRGBA(
                      theme.palette.warning.main,
                      0.12,
                    ),
                    color: 'warning.main',
                  }}
                >
                  <Icon icon="mdi:warehouse" />
                </StatsAvatar>
              }
              titleTypographyProps={{
                variant: 'h6',
                sx: { fontSize: { xs: '1.1rem', sm: '1.25rem' } },
              }}
              sx={{ pb: 1 }}
            />
            <CardContent sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
              {/* Desktop Table View */}
              <Hidden mdDown>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Localidad</TableCell>
                        <TableCell align="right">Existencia</TableCell>
                        <TableCell align="center">
                          Última Actualización
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.existencias.map((stock, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {stock.id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              {stock.localidadNombre ||
                                `ID: ${stock.localidadId}`}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                color:
                                  stock.existencia > 0
                                    ? 'success.main'
                                    : 'error.main',
                              }}
                            >
                              {stock.existencia.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {new Date(
                                stock.ultimaActualizacion,
                              ).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              })}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {new Date(
                                stock.ultimaActualizacion,
                              ).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Hidden>

              {/* Mobile Card View */}
              <Hidden mdUp>
                <Box sx={{ mt: 2 }}>
                  {product.existencias.map((stock, index) => (
                    <StockCard key={index} stock={stock} />
                  ))}
                </Box>
              </Hidden>
            </CardContent>
          </InfoCard>
        )}

        {/* No Stock Information */}
        {(!product.existencias || product.existencias.length === 0) && (
          <InfoCard>
            <CardContent sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
              <StatsAvatar
                sx={{
                  mx: 'auto',
                  mb: 2,
                  width: 64,
                  height: 64,
                  backgroundColor: hexToRGBA(
                    theme.palette.secondary.main,
                    0.12,
                  ),
                  color: 'text.secondary',
                }}
              >
                <Icon icon="mdi:package-variant-closed" fontSize="2rem" />
              </StatsAvatar>
              <Typography
                variant="h6"
                sx={{ mt: 2, mb: 1, color: 'text.primary' }}
              >
                Sin información de existencias
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No hay datos de stock disponibles para este producto
              </Typography>
            </CardContent>
          </InfoCard>
        )}

        {/* Mobile Action Buttons */}
        {isMobile && (
          <Box sx={{ p: 2, pt: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Link href={`/apps/products/add/${product.codigo}`} passHref>
                  <ActionButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<Icon icon="mdi:pencil" />}
                    sx={{ mb: 1 }}
                  >
                    Editar
                  </ActionButton>
                </Link>
              </Grid>
              <Grid item xs={6}>
                <Link
                  href={`/apps/inventory-management/movements?productCode=${product.codigo}`}
                  passHref
                >
                  <ActionButton
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<Icon icon="mdi:chart-line" />}
                    sx={{ mb: 1 }}
                  >
                    Movimientos
                  </ActionButton>
                </Link>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      {/* Image Modal */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseImageModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <DialogContent sx={{ p: 1, textAlign: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <IconButton
              onClick={handleCloseImageModal}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                },
                zIndex: 1,
              }}
            >
              <Icon icon="mdi:close" />
            </IconButton>
            {selectedImage && (
              <img
                src={selectedImage}
                alt={product.nombre}
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: 8,
                }}
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </StyledDialog>
  )
}

export default ProductDetailModal
