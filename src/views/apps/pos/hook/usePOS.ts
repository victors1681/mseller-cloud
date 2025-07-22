// ** React Imports
import { useCallback } from 'react'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'

// ** POS Store Actions
import {
  fetchTurnoActual,
  fetchTurnosByVendedor,
  fetchMovimientos,
  fetchAprobaciones,
  abrirTurno,
  cerrarTurno,
  crearMovimiento,
  crearAprobacion,
  toggleAbrirTurnoModal,
  toggleCerrarTurnoModal,
  toggleMovimientoModal,
  toggleAprobacionModal,
  clearSelectedTurno,
} from 'src/store/apps/pos'

// ** Types
import {
  AbrirTurnoRequest,
  CerrarTurnoRequest,
  MovimientoTurnoRequest,
  AprobacionTurnoRequest,
  TurnoType,
} from 'src/types/apps/posType'

/**
 * Custom hook for managing POS operations
 * Provides easy access to POS store state and actions
 */
export const usePOS = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.pos)

  // ** Async Actions
  const loadTurnoActual = useCallback(() => {
    return dispatch(fetchTurnoActual())
  }, [dispatch])

  const loadTurnosByVendedor = useCallback(
    (codigoVendedor: string) => {
      return dispatch(fetchTurnosByVendedor(codigoVendedor))
    },
    [dispatch],
  )

  const loadMovimientos = useCallback(
    (idTurno: string) => {
      return dispatch(fetchMovimientos(idTurno))
    },
    [dispatch],
  )

  const loadAprobaciones = useCallback(
    (idTurno: string) => {
      return dispatch(fetchAprobaciones(idTurno))
    },
    [dispatch],
  )

  const openTurno = useCallback(
    (data: AbrirTurnoRequest) => {
      return dispatch(abrirTurno(data))
    },
    [dispatch],
  )

  const closeTurno = useCallback(
    (data: CerrarTurnoRequest) => {
      return dispatch(cerrarTurno(data))
    },
    [dispatch],
  )

  const createMovimiento = useCallback(
    (data: MovimientoTurnoRequest) => {
      return dispatch(crearMovimiento(data))
    },
    [dispatch],
  )

  const createAprobacion = useCallback(
    (data: AprobacionTurnoRequest) => {
      return dispatch(crearAprobacion(data))
    },
    [dispatch],
  )

  // ** UI Actions
  const showAbrirTurnoModal = useCallback(() => {
    dispatch(toggleAbrirTurnoModal(null))
  }, [dispatch])

  const showCerrarTurnoModal = useCallback(
    (turno: TurnoType) => {
      dispatch(toggleCerrarTurnoModal(turno))
    },
    [dispatch],
  )

  const showMovimientoModal = useCallback(
    (turno: TurnoType) => {
      dispatch(toggleMovimientoModal(turno))
    },
    [dispatch],
  )

  const showAprobacionModal = useCallback(
    (turno: TurnoType) => {
      dispatch(toggleAprobacionModal(turno))
    },
    [dispatch],
  )

  const hideAbrirTurnoModal = useCallback(() => {
    dispatch(toggleAbrirTurnoModal(null))
  }, [dispatch])

  const hideCerrarTurnoModal = useCallback(() => {
    dispatch(toggleCerrarTurnoModal(null))
  }, [dispatch])

  const hideMovimientoModal = useCallback(() => {
    dispatch(toggleMovimientoModal(null))
  }, [dispatch])

  const hideAprobacionModal = useCallback(() => {
    dispatch(toggleAprobacionModal(null))
  }, [dispatch])

  const clearSelection = useCallback(() => {
    dispatch(clearSelectedTurno())
  }, [dispatch])

  // ** Computed Values
  const isTurnoOpen = store.turnoActual?.estado === 0 // TurnoEstado.ABIERTO
  const hasTurnoActual = !!store.turnoActual
  const isAnyLoading =
    store.isTurnoActualLoading ||
    store.isTurnosByVendedorLoading ||
    store.isMovimientosLoading ||
    store.isAprobacionesLoading

  return {
    // ** State
    store,

    // ** Computed
    isTurnoOpen,
    hasTurnoActual,
    isAnyLoading,

    // ** Data Actions
    loadTurnoActual,
    loadTurnosByVendedor,
    loadMovimientos,
    loadAprobaciones,
    openTurno,
    closeTurno,
    createMovimiento,
    createAprobacion,

    // ** UI Actions
    showAbrirTurnoModal,
    showCerrarTurnoModal,
    showMovimientoModal,
    showAprobacionModal,
    hideAbrirTurnoModal,
    hideCerrarTurnoModal,
    hideMovimientoModal,
    hideAprobacionModal,
    clearSelection,
  }
}

export default usePOS
