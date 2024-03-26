import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { transportStatusLabels } from 'src/utils/transportMappings'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

interface StatusProps {
  statusValue?: string
  handleStatusValue: (e: SelectChangeEvent) => void
  label?: string
  disabled?: boolean
}
export const TransportStatusSelect = ({
  statusValue,
  handleStatusValue,
  label = 'Estado del Transporte',
  disabled,
}: StatusProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="invoice-status-select">{label}</InputLabel>
      <Select
        fullWidth
        value={statusValue}
        sx={{ mr: 4, mb: 2 }}
        label={label}
        onChange={handleStatusValue}
        labelId="transport-status-select"
        disabled={disabled}
      >
        <MenuItem value="">none</MenuItem>
        {Object.keys(transportStatusLabels).map((k: any) => {
          return <MenuItem value={k}>{transportStatusLabels[k]}</MenuItem>
        })}
      </Select>
    </FormControl>
  )
}

export default TransportStatusSelect
