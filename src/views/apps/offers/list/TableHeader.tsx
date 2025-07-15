// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { GridRowId } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import { useDispatch } from 'react-redux'
import { toggleAddUpdateLegacyOffer } from '@/store/apps/offers'
import FormControl from '@mui/material/FormControl'
import { InputLabel, MenuItem, Select } from '@mui/material'

interface TableHeaderProps {
  value: string
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
  handleSelectFilter: (val: string) => void
  placeholder: string
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, selectedRows, handleFilter } = props
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
        <FormControl sx={{ mt: -2 }}>
          <InputLabel id="tipo-oferta-label" size="small">
            Tipo de Oferta
          </InputLabel>
          <Select
            labelId="tipo-oferta-label"
            label="Tipo de Oferta"
            onChange={(e) => props.handleSelectFilter(e.target.value)}
            defaultValue=""
            size="small"
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="0">0 - Escala</MenuItem>
            <MenuItem value="1">1 - Promoción</MenuItem>
            <MenuItem value="3">3 - Mixta</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          value={value}
          sx={{ mr: 4, mb: 2, ml: 4 }}
          placeholder={props.placeholder}
          onChange={(e) => handleFilter(e.target.value)}
        />
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          onClick={() => dispatch(toggleAddUpdateLegacyOffer(null))}
        >
          Crear Legacy Offer
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
