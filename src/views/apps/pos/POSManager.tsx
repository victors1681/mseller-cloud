// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'

// ** POS Store Actions
import {
  fetchTurnoActual,
  fetchTurnosByVendedor,
  fetchMovimientos,
  fetchAprobaciones,
  toggleAbrirTurnoModal,
  toggleCerrarTurnoModal,
  toggleMovimientoModal,
  toggleAprobacionModal,
} from 'src/store/apps/pos'

// ** Types
import { getTurnoEstadoSpanishName, TurnoEstado } from 'src/types/apps/posType'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const POSManager = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.pos)

  // ** Effects
  useEffect(() => {
    // Load current turno on component mount
    dispatch(fetchTurnoActual())
  }, [dispatch])

  // ** Handlers
  const handleOpenTurno = () => {
    dispatch(toggleAbrirTurnoModal(null))
  }

  const handleCloseTurno = () => {
    if (store.turnoActual) {
      dispatch(toggleCerrarTurnoModal(store.turnoActual))
    }
  }

  const handleCreateMovimiento = () => {
    if (store.turnoActual) {
      dispatch(toggleMovimientoModal(store.turnoActual))
    }
  }

  const handleCreateAprobacion = () => {
    if (store.turnoActual) {
      dispatch(toggleAprobacionModal(store.turnoActual))
    }
  }

  const handleLoadMovimientos = () => {
    if (store.turnoActual) {
      dispatch(fetchMovimientos(store.turnoActual.id))
    }
  }

  const handleLoadAprobaciones = () => {
    if (store.turnoActual) {
      dispatch(fetchAprobaciones(store.turnoActual.id))
    }
  }

  const handleLoadTurnosByVendedor = (codigoVendedor: string) => {
    dispatch(fetchTurnosByVendedor(codigoVendedor))
  }

  // ** Render loading state
  if (store.isTurnoActualLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={5}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando turno actual...
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* Current Turno Card */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Turno Actual
            </Typography>

            {store.turnoActual ? (
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  ID: {store.turnoActual.id}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Vendedor: {store.turnoActual.codigoVendedor}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Dispositivo: {store.turnoActual.idDispositivo}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Efectivo Apertura: ${store.turnoActual.efectivoApertura}
                </Typography>
                {store.turnoActual.efectivoCierre && (
                  <Typography variant="body2" gutterBottom>
                    Efectivo Cierre: ${store.turnoActual.efectivoCierre}
                  </Typography>
                )}
                <Box mt={2}>
                  <Chip
                    label={getTurnoEstadoSpanishName(store.turnoActual.estado)}
                    color={
                      store.turnoActual.estado === TurnoEstado.ABIERTO
                        ? 'success'
                        : 'default'
                    }
                    size="small"
                  />
                </Box>

                <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                  {store.turnoActual.estado === TurnoEstado.ABIERTO && (
                    <>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Icon icon="mdi:close-circle" />}
                        onClick={handleCloseTurno}
                        size="small"
                      >
                        Cerrar Turno
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Icon icon="mdi:cash-plus" />}
                        onClick={handleCreateMovimiento}
                        size="small"
                      >
                        Movimiento
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outlined"
                    startIcon={<Icon icon="mdi:check-circle" />}
                    onClick={handleCreateAprobacion}
                    size="small"
                  >
                    Aprobación
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  No hay turno activo
                </Alert>
                <Button
                  variant="contained"
                  startIcon={<Icon icon="mdi:play-circle" />}
                  onClick={handleOpenTurno}
                >
                  Abrir Turno
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Actions Card */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Acciones
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="outlined"
                startIcon={<Icon icon="mdi:format-list-bulleted" />}
                onClick={handleLoadMovimientos}
                disabled={!store.turnoActual}
                fullWidth
              >
                Ver Movimientos
                {store.isMovimientosLoading && (
                  <CircularProgress size={16} sx={{ ml: 1 }} />
                )}
              </Button>

              <Button
                variant="outlined"
                startIcon={<Icon icon="mdi:clipboard-check" />}
                onClick={handleLoadAprobaciones}
                disabled={!store.turnoActual}
                fullWidth
              >
                Ver Aprobaciones
                {store.isAprobacionesLoading && (
                  <CircularProgress size={16} sx={{ ml: 1 }} />
                )}
              </Button>

              <Button
                variant="outlined"
                startIcon={<Icon icon="mdi:history" />}
                onClick={() =>
                  store.turnoActual &&
                  handleLoadTurnosByVendedor(store.turnoActual.codigoVendedor)
                }
                disabled={!store.turnoActual}
                fullWidth
              >
                Ver Historial de Turnos
                {store.isTurnosByVendedorLoading && (
                  <CircularProgress size={16} sx={{ ml: 1 }} />
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Movimientos List */}
      {store.movimientos.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Movimientos del Turno
              </Typography>
              <Box>
                {store.movimientos.map((movimiento, index) => (
                  <Box
                    key={index}
                    p={2}
                    border="1px solid #e0e0e0"
                    borderRadius={1}
                    mb={1}
                  >
                    <Typography variant="body2">
                      <strong>Tipo:</strong> {movimiento.tipo} |
                      <strong> Monto:</strong> ${movimiento.monto} |
                      <strong> Motivo:</strong> {movimiento.motivo}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {movimiento.fecha} - {movimiento.usuario}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Aprobaciones List */}
      {store.aprobaciones.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aprobaciones del Turno
              </Typography>
              <Box>
                {store.aprobaciones.map((aprobacion, index) => (
                  <Box
                    key={index}
                    p={2}
                    border="1px solid #e0e0e0"
                    borderRadius={1}
                    mb={1}
                  >
                    <Typography variant="body2">
                      <strong>Acción:</strong> {aprobacion.accion} |
                      <strong> Aprobado por:</strong> {aprobacion.aprobadoPor}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Razón:</strong> {aprobacion.razon}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {aprobacion.fecha}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Turnos by Vendedor List */}
      {store.turnosByVendedor.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Historial de Turnos
              </Typography>
              <Box>
                {store.turnosByVendedor.map((turno, index) => (
                  <Box
                    key={index}
                    p={2}
                    border="1px solid #e0e0e0"
                    borderRadius={1}
                    mb={1}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">
                        <strong>ID:</strong> {turno.id.substring(0, 8)}... |
                        <strong> Apertura:</strong> ${turno.efectivoApertura}
                        {turno.efectivoCierre && (
                          <span>
                            {' '}
                            | <strong>Cierre:</strong> ${turno.efectivoCierre}
                          </span>
                        )}
                      </Typography>
                      <Chip
                        label={getTurnoEstadoSpanishName(turno.estado)}
                        color={
                          turno.estado === TurnoEstado.ABIERTO
                            ? 'success'
                            : 'default'
                        }
                        size="small"
                      />
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      Apertura: {turno.fechaApertura}
                      {turno.fechaCierre && ` | Cierre: ${turno.fechaCierre}`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

export default POSManager
