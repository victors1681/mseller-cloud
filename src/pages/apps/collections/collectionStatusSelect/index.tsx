import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { collectionStatusLabels } from 'src/utils/collectionMappings'

interface StatusProps {
  statusValue?: string
  handleStatusValue: (e: SelectChangeEvent) => void
  label?: string
  disabled?: boolean
}

export const CollectionStatusSelect = ({
  statusValue,
  handleStatusValue,
  label = 'Estado de la Cobranza',
  disabled,
}: StatusProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="collection-status-select">{label}</InputLabel>
      <Select
        fullWidth
        value={statusValue}
        sx={{ mr: 4, mb: 2 }}
        label={label}
        onChange={handleStatusValue}
        labelId="collection-status-select"
        disabled={disabled}
      >
        <MenuItem value="">none</MenuItem>
        {Object.keys(collectionStatusLabels).map((k: any) => {
          return (
            <MenuItem key={k} value={k}>
              {collectionStatusLabels[k]}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

export default CollectionStatusSelect
