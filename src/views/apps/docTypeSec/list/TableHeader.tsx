// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import { GridRowId } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useDispatch } from 'react-redux'
import { toggleDocTypeSecAddUpdate } from '@/store/apps/docTypeSec'

interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
  placeholder: string
  showInitializeButton?: boolean
  onInitializeSequence?: () => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const {
    value,
    selectedRows,
    handleFilter,
    showInitializeButton,
    onInitializeSequence,
  } = props
  const dispatch = useDispatch()

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
      <div></div>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {!showInitializeButton && (
          <TextField
            size="small"
            value={value}
            sx={{ mr: 4, mb: 2 }}
            placeholder={props.placeholder}
            onChange={(e) => handleFilter(e.target.value)}
          />
        )}
        {showInitializeButton ? (
          <Button
            sx={{ mb: 2 }}
            variant="contained"
            color="primary"
            onClick={onInitializeSequence}
          >
            Inicializar Secuencia
          </Button>
        ) : (
          <Button
            sx={{ mb: 2 }}
            variant="contained"
            onClick={() => dispatch(toggleDocTypeSecAddUpdate(null))}
          >
            Crear Secuencia
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default TableHeader
