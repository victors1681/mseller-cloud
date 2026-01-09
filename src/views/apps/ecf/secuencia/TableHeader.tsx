// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { GridRowId } from '@mui/x-data-grid'
import { useDispatch } from 'react-redux'
import { toggleSecuenciaECFAddUpdate } from 'src/store/apps/ecf'
import { tipoClienteOptions } from 'src/utils/tipoClienteOptions'

interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
  placeholder: string
  tipoCliente: string
  handleTipoClienteFilter: (val: string) => void
  entorno: string
  handleEntornoFilter: (val: string) => void
  esElectronico: string
  handleEsElectronicoFilter: (val: string) => void
  habilitado: string
  handleHabilitadoFilter: (val: string) => void
}

const SecuenciaTableHeader = (props: TableHeaderProps) => {
  // ** Props
  const {
    value,
    selectedRows,
    handleFilter,
    tipoCliente,
    handleTipoClienteFilter,
    entorno,
    handleEntornoFilter,
    esElectronico,
    handleEsElectronicoFilter,
    habilitado,
    handleHabilitadoFilter,
  } = props
  const dispatch = useDispatch()

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Search and Create Button Row */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div></div>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            value={value}
            sx={{ mr: 4, mb: 2 }}
            placeholder={props.placeholder}
            onChange={(e) => handleFilter(e.target.value)}
          />
          <Button
            sx={{ mb: 2 }}
            variant="contained"
            onClick={() => dispatch(toggleSecuenciaECFAddUpdate(null))}
          >
            Crear Secuencia Fiscal
          </Button>
        </Box>
      </Box>

      {/* Filters Row */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Tipo Cliente</InputLabel>
          <Select
            value={tipoCliente}
            label="Tipo Cliente"
            onChange={(e) => handleTipoClienteFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {tipoClienteOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Entorno</InputLabel>
          <Select
            value={entorno}
            label="Entorno"
            onChange={(e) => handleEntornoFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="PRODUCCION">Producción</MenuItem>
            <MenuItem value="CERTIFICACION">Certificación</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Es Electrónico</InputLabel>
          <Select
            value={esElectronico}
            label="Es Electrónico"
            onChange={(e) => handleEsElectronicoFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="true">Sí</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={habilitado}
            label="Estado"
            onChange={(e) => handleHabilitadoFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="true">Habilitado</MenuItem>
            <MenuItem value="false">Deshabilitado</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  )
}

export default SecuenciaTableHeader
