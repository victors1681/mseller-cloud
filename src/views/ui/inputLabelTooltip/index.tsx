import Icon from '@/@core/components/icon'
import { Box, IconButton, Tooltip } from '@mui/material'

interface InputLabelTooltipProps {
  title: string
  description: string
}

export const InputLabelTooltip = ({
  title,
  description,
}: InputLabelTooltipProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {title}
      <Tooltip title={description}>
        <IconButton size="small" sx={{ ml: 1 }}>
          <Icon icon="mdi:information-slab-circle-outline" fontSize={20} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default InputLabelTooltip
