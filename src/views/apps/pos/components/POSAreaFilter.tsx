import React from 'react'
import { Box, Chip, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { POSAreaFilter as AreaFilterType } from 'src/types/apps/posTypes'

const StyledFilterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    height: 4,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.grey[100],
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 2,
  },
}))

const StyledChipsContainer = styled(Box)({
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  minWidth: 'max-content',
})

interface POSAreaFilterProps {
  areas: AreaFilterType[]
  selectedArea: string | null
  onAreaSelect: (area: string | null) => void
}

const POSAreaFilter: React.FC<POSAreaFilterProps> = ({
  areas,
  selectedArea,
  onAreaSelect,
}) => {
  const theme = useTheme()

  if (!areas || areas.length === 0) {
    return null
  }

  return (
    <StyledFilterContainer>
      <StyledChipsContainer>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', mr: 1, flexShrink: 0 }}
        >
          Áreas:
        </Typography>

        <Chip
          label="Todos"
          variant={selectedArea === null ? 'filled' : 'outlined'}
          color={selectedArea === null ? 'primary' : 'default'}
          size="small"
          onClick={() => onAreaSelect(null)}
          sx={{
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />

        {areas.map((area) => (
          <Chip
            key={area.area}
            label={`${area.area} (${area.count})`}
            variant={selectedArea === area.area ? 'filled' : 'outlined'}
            color={selectedArea === area.area ? 'primary' : 'default'}
            size="small"
            onClick={() => onAreaSelect(area.area)}
            sx={{
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        ))}
      </StyledChipsContainer>
    </StyledFilterContainer>
  )
}

export default POSAreaFilter
