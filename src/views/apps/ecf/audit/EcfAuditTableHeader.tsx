// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { GridRowId } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { exportEcfDocuments } from 'src/store/apps/ecf/ecfDocumentosSlice'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'

interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
  placeholder?: string
  showFilters?: boolean
  onToggleFilters?: () => void
}

const EcfAuditTableHeader = (props: TableHeaderProps) => {
  // ** Props
  const {
    value,
    selectedRows,
    handleFilter,
    placeholder = 'Buscar documentos ECF...',
    showFilters = false,
    onToggleFilters,
  } = props

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.ecfDocumentos)

  // ** Handlers
  const handleExport = (format: 'excel' | 'csv') => {
    dispatch(
      exportEcfDocuments({
        filters: store.params,
        format,
      }),
    )
  }

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Left side - Title and filters toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h5" sx={{ color: 'text.primary' }}>
          Auditoría de Documentos ECF
        </Typography>
        {onToggleFilters && (
          <Button
            size="small"
            variant="outlined"
            onClick={onToggleFilters}
            startIcon={
              <Icon
                icon={showFilters ? 'mdi:filter-minus' : 'mdi:filter-plus'}
              />
            }
          >
            {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
          </Button>
        )}
      </Box>

      {/* Right side - Search and actions */}
      <Box
        sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}
      >
        {/* Search field */}
        <TextField
          size="small"
          value={value}
          placeholder={placeholder}
          onChange={(e) => handleFilter(e.target.value)}
          sx={{
            minWidth: { xs: 200, sm: 300 },
            mb: 2,
          }}
          InputProps={{
            startAdornment: (
              <Icon
                icon="mdi:magnify"
                style={{ marginRight: 8, color: '#666' }}
              />
            ),
          }}
        />

        {/* Export buttons */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleExport('excel')}
            disabled={store.isExporting}
            startIcon={<Icon icon="mdi:file-excel" />}
          >
            Excel
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleExport('csv')}
            disabled={store.isExporting}
            startIcon={<Icon icon="mdi:file-delimited" />}
          >
            CSV
          </Button>
        </Stack>

        {/* Refresh button */}
        <Button
          size="small"
          variant="outlined"
          onClick={() => window.location.reload()}
          sx={{ mb: 2 }}
          startIcon={<Icon icon="mdi:refresh" />}
        >
          Actualizar
        </Button>
      </Box>
    </Box>
  )
}

export default EcfAuditTableHeader
