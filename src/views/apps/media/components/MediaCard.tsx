// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { MediaItem } from 'src/types/apps/mediaTypes'

// ** Utils
import { toLocalDateTimeString } from 'src/utils/dateUtils'

interface MediaCardProps {
  media: MediaItem
  selected?: boolean
  onSelect?: (media: MediaItem) => void
  onDelete?: (media: MediaItem) => void
  onEdit?: (media: MediaItem) => void
  onView?: (media: MediaItem) => void
  selectionMode?: boolean
}

const MediaCard = ({
  media,
  selected = false,
  onSelect,
  onDelete,
  onEdit,
  onView,
  selectionMode = false,
}: MediaCardProps) => {
  const [imageError, setImageError] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleCardClick = () => {
    if (selectionMode && onSelect) {
      onSelect(media)
    }
  }

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onView) {
      onView(media)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(media)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(media)
    }
  }

  const usedByCount =
    (media.usedBy?.products?.length || 0) +
    (media.usedBy?.customers?.length || 0)

  return (
    <Card
      sx={{
        position: 'relative',
        cursor: selectionMode ? 'pointer' : 'default',
        border: selected ? `2px solid ${theme.palette.primary.main}` : 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)',
          '& .action-buttons': {
            opacity: 1,
          },
          '& .selection-checkbox': {
            opacity: 1,
          },
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      {selectionMode && (
        <Box
          className="selection-checkbox"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2,
            opacity: selected ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={selected}
            onChange={() => onSelect && onSelect(media)}
            onClick={(e) => e.stopPropagation()}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
          />
        </Box>
      )}

      {/* Actions */}
      <Box
        className="action-buttons"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          display: 'flex',
          gap: 0.5,
          opacity: 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        {onEdit && (
          <IconButton
            size="small"
            onClick={handleEdit}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            <Icon icon="mdi:pencil-outline" fontSize={18} />
          </IconButton>
        )}
        {onDelete && usedByCount === 0 && (
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            <Icon icon="mdi:delete-outline" fontSize={18} />
          </IconButton>
        )}
      </Box>

      {/* Image Preview */}
      <Box
        onClick={onView ? handleView : undefined}
        sx={{
          position: 'relative',
          paddingTop: '100%', // 1:1 Aspect Ratio
          backgroundColor: 'action.hover',
          overflow: 'hidden',
          cursor: onView ? 'pointer' : 'default',
          '&:hover': onView
            ? {
                '& .view-icon': {
                  opacity: 1,
                },
              }
            : {},
        }}
      >
        {!imageError ? (
          <>
            <img
              src={media.thumbnailUrl || media.originalUrl}
              alt={media.title || 'Media'}
              onError={() => setImageError(true)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {onView && (
              <Box
                className="view-icon"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '50%',
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                }}
              >
                <Icon icon="mdi:magnify-plus" fontSize={32} color="white" />
              </Box>
            )}
          </>
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              icon="mdi:image-broken-variant"
              fontSize={48}
              color="action.disabled"
            />
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title */}
        <Tooltip title={media.title || media.originalFile} arrow>
          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mb: 0.5,
            }}
          >
            {media.title || 'Sin título'}
          </Typography>
        </Tooltip>

        {/* Type */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, textTransform: 'capitalize' }}
        >
          {media.type}
        </Typography>

        {/* Tags */}
        {media.tags && media.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {media.tags.slice(0, 2).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{ fontSize: '0.65rem', height: 18 }}
              />
            ))}
            {media.tags.length > 2 && (
              <Chip
                label={`+${media.tags.length - 2}`}
                size="small"
                sx={{ fontSize: '0.65rem', height: 18 }}
              />
            )}
          </Box>
        )}

        {/* Usage Badge */}
        {usedByCount > 0 && (
          <Chip
            label={`Usado en ${usedByCount} ${
              usedByCount === 1 ? 'lugar' : 'lugares'
            }`}
            size="small"
            color="info"
            icon={<Icon icon="mdi:link-variant" fontSize={14} />}
            sx={{ mb: 1, fontSize: '0.7rem' }}
          />
        )}

        {/* Metadata */}
        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {toLocalDateTimeString(media.createdAt)}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block' }}
          >
            {(media.metadata.size / 1024).toFixed(1)} KB •{' '}
            {media.metadata.width}x{media.metadata.height}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MediaCard
