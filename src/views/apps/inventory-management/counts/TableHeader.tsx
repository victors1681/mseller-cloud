// ** React Imports
import { ChangeEvent, useEffect } from 'react'

// ** MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'

// ** Types
import {
  EstadoInventario,
  InventarioFilters,
  LocalidadDTO,
} from 'src/types/apps/inventoryTypes'
import { LocationType } from 'src/types/apps/locationType'

// ** Icon Imports

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { setSelectedLocalidad } from 'src/store/apps/inventory'
import { fetchLocations } from 'src/store/apps/location'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

interface TableHeaderProps {
  filters: InventarioFilters
  onFilterChange: (field: keyof InventarioFilters, value: any) => void
  selectedLocalidad: LocalidadDTO | null
}

const TableHeader = ({
  filters,
  onFilterChange,
  selectedLocalidad,
}: TableHeaderProps) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const locationStore = useSelector((state: RootState) => state.locations)
  const { user } = useAuth()

  // ** Effects
  useEffect(() => {
    // Fetch locations if not already loaded
    if (locationStore.data.length === 0 && !locationStore.isLoading) {
      dispatch(fetchLocations({ query: '', pageNumber: 0 }))
    }
  }, [dispatch, locationStore.data.length, locationStore.isLoading])

  // Get localidades from the location store
  const localidades: LocalidadDTO[] = locationStore.data.map(
    (location: LocationType) => ({
      id: location.id,
      codigo: location.codigo,
      nombre: location.descripcion,
      activa: true, // Assuming all fetched locations are active
    }),
  )

  // Set default selected localidad based on user's warehouse or first available
  useEffect(() => {
    if (localidades.length > 0 && !selectedLocalidad && user) {
      let defaultLocalidad: LocalidadDTO | null = null

      // Try to find the user's warehouse first
      if (user.warehouse) {
        defaultLocalidad =
          localidades.find(
            (localidad) =>
              localidad.codigo === user.warehouse ||
              localidad.nombre
                .toLowerCase()
                .includes(user.warehouse.toLowerCase()),
          ) || null
      }

      // If user's warehouse not found, select the first available localidad
      if (!defaultLocalidad && localidades.length > 0) {
        defaultLocalidad = localidades[0]
      }

      if (defaultLocalidad) {
        dispatch(setSelectedLocalidad(defaultLocalidad))
      }
    }
  }, [localidades, selectedLocalidad, user, dispatch])

  const handleLocalidadChange = (event: SelectChangeEvent<string>) => {
    const localidadId = parseInt(event.target.value)
    const localidad = localidades.find(
      (l: LocalidadDTO) => l.id === localidadId,
    )
    dispatch(setSelectedLocalidad(localidad || null))
  }

  return (
    <CardContent>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Localidad</InputLabel>
            <Select
              value={selectedLocalidad?.id.toString() || ''}
              label="Localidad"
              onChange={handleLocalidadChange}
            >
              {localidades.map((localidad: LocalidadDTO) => (
                <MenuItem key={localidad.id} value={localidad.id.toString()}>
                  {localidad.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.estado || ''}
              label="Estado"
              onChange={(e) =>
                onFilterChange('estado', e.target.value || undefined)
              }
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.values(EstadoInventario).map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2.5}>
          <TextField
            fullWidth
            type="date"
            label="Fecha Desde"
            InputLabelProps={{ shrink: true }}
            value={filters.fechaDesde || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFilterChange('fechaDesde', e.target.value || undefined)
            }
          />
        </Grid>

        <Grid item xs={12} sm={2.5}>
          <TextField
            fullWidth
            type="date"
            label="Fecha Hasta"
            InputLabelProps={{ shrink: true }}
            value={filters.fechaHasta || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFilterChange('fechaHasta', e.target.value || undefined)
            }
          />
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableHeader
