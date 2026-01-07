// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Pagination from '@mui/material/Pagination'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Redux Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  clearSelection,
  fetchMediaList,
  setFilters,
  toggleMediaSelection,
} from 'src/store/apps/media'

// ** Components
import MediaCard from 'src/views/apps/media/components/MediaCard'
import LoadingWrapper from 'src/views/ui/LoadingWrapper'
import MediaUploadZone from 'src/views/ui/mediaUploadZone'

// ** Types
import { MediaItem, MediaType } from 'src/types/apps/mediaTypes'

// ** Utils
import { debounce } from '@mui/material/utils'

interface MediaLibraryDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (media: MediaItem[]) => void
  multiple?: boolean
  maxSelection?: number
  filterType?: MediaType | string
  title?: string
}

const MediaLibraryDialog = ({
  open,
  onClose,
  onSelect,
  multiple = false,
  maxSelection = 10,
  filterType,
  title = 'Seleccionar Medios',
}: MediaLibraryDialogProps) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ** Redux State
  const dispatch = useAppDispatch()
  const store = useAppSelector((state) => state.media)

  // ** Local State
  const [searchTerm, setSearchTerm] = useState('')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // ** Debounced search
  const debouncedSearch = debounce((value: string) => {
    dispatch(
      setFilters({
        ...store.filters,
        search: value,
        pageNumber: 1,
      }),
    )
  }, 300)

  useEffect(() => {
    if (open) {
      // Initialize filters
      const initialFilters = {
        ...store.filters,
        type: filterType || MediaType.All,
        search: '',
        pageNumber: 1,
        pageSize: isMobile ? 12 : 20,
      }
      dispatch(setFilters(initialFilters))
      dispatch(fetchMediaList(initialFilters))
      dispatch(clearSelection())
    }
  }, [open, filterType, isMobile])

  useEffect(() => {
    if (open) {
      dispatch(fetchMediaList(store.filters))
    }
  }, [store.filters, open])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const handleTypeChange = (event: any) => {
    dispatch(
      setFilters({
        ...store.filters,
        type: event.target.value,
        pageNumber: 1,
      }),
    )
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    dispatch(
      setFilters({
        ...store.filters,
        pageNumber: page,
      }),
    )
  }

  const handleMediaSelect = (media: MediaItem) => {
    if (!multiple) {
      // Single selection mode
      dispatch(clearSelection())
      onSelect([media])
      onClose()
    } else {
      // Multiple selection mode
      const isSelected = store.selectedMedia.some(
        (item) => item.id === media.id,
      )
      if (isSelected || store.selectedMedia.length < maxSelection) {
        dispatch(toggleMediaSelection(media))
      }
    }
  }

  const handleConfirmSelection = () => {
    onSelect(store.selectedMedia)
    onClose()
  }

  const handleClose = () => {
    dispatch(clearSelection())
    setSearchTerm('')
    onClose()
  }

  const handleUploadComplete = () => {
    setUploadDialogOpen(false)
    // Refresh the media list after upload
    dispatch(fetchMediaList(store.filters))
  }

  const totalPages = Math.ceil(store.total / (store.filters.pageSize || 20))

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            m: fullScreen ? 0 : { xs: 2, sm: 4 },
            width: fullScreen ? '100%' : 'calc(100% - 32px)',
            maxHeight: fullScreen ? '100%' : 'calc(100% - 64px)',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon="mdi:folder-multiple-image" fontSize={28} />
            <Typography variant="h5">{title}</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Icon icon="mdi:close" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Filters, View Toggle, and Upload Button */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={7} md={8}>
              <TextField
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por título o descripción..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon="mdi:magnify" />
                    </InputAdornment>
                  ),
                }}
                autoFocus={!isMobile}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={store.filters.type || MediaType.All}
                  onChange={handleTypeChange}
                  label="Tipo"
                  disabled={!!filterType}
                >
                  <MenuItem value={MediaType.All}>Todos</MenuItem>
                  <MenuItem value={MediaType.Products}>Productos</MenuItem>
                  <MenuItem value={MediaType.Profile}>Perfil</MenuItem>
                  <MenuItem value={MediaType.Documents}>Documentos</MenuItem>
                  <MenuItem value={MediaType.Logo}>Logos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={2} md={2}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  height: '100%',
                  minHeight: { xs: 44, sm: 56 },
                }}
              >
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  sx={{
                    border: '1px solid',
                    borderColor:
                      viewMode === 'grid' ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    flex: 1,
                  }}
                >
                  <Icon icon="mdi:view-grid-outline" />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  sx={{
                    border: '1px solid',
                    borderColor:
                      viewMode === 'list' ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    flex: 1,
                  }}
                >
                  <Icon icon="mdi:view-list-outline" />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} sm={2} md={1}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => setUploadDialogOpen(true)}
                startIcon={<Icon icon="mdi:upload" />}
                sx={{
                  height: '100%',
                  minHeight: { xs: 44, sm: 56 },
                }}
              >
                {isMobile ? 'Subir' : 'Subir'}
              </Button>
            </Grid>
          </Grid>

          {/* Selection Info */}
          {multiple && store.selectedMedia.length > 0 && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                backgroundColor: 'primary.light',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body2" color="primary.dark">
                {store.selectedMedia.length} de {maxSelection} seleccionados
              </Typography>
              <Button
                size="small"
                onClick={() => dispatch(clearSelection())}
                color="primary"
              >
                Limpiar
              </Button>
            </Box>
          )}

          {/* Media Grid */}
          <LoadingWrapper isLoading={store.loading}>
            {store.data.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 300,
                  textAlign: 'center',
                }}
              >
                <Icon
                  icon="mdi:image-off-outline"
                  fontSize={64}
                  color="action.disabled"
                />
                <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">
                  No se encontraron medios
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Sube tu primera imagen para comenzar'}
                </Typography>
              </Box>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                    {store.data.map((media) => (
                      <Grid item xs={4} sm={3} md={2} lg={1.5} key={media.id}>
                        <MediaCard
                          media={media}
                          selected={store.selectedMedia.some(
                            (item) => item.id === media.id,
                          )}
                          onSelect={handleMediaSelect}
                          selectionMode={true}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {store.data.map((media) => (
                      <Box
                        key={media.id}
                        onClick={() => handleMediaSelect(media)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 1.5,
                          border: '1px solid',
                          borderColor: store.selectedMedia.some(
                            (item) => item.id === media.id,
                          )
                            ? 'primary.main'
                            : 'divider',
                          borderRadius: 1,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          backgroundColor: store.selectedMedia.some(
                            (item) => item.id === media.id,
                          )
                            ? 'action.hover'
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <Checkbox
                          checked={store.selectedMedia.some(
                            (item) => item.id === media.id,
                          )}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Box
                          component="img"
                          src={media.thumbnailUrl}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {media.title || 'Sin título'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {(media.metadata?.size / 1024).toFixed(1)} KB ·{' '}
                            {media.metadata?.width} x {media.metadata?.height}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
                {/* Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 4,
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={store.filters.pageNumber || 1}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? 'small' : 'medium'}
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            )}
          </LoadingWrapper>
        </DialogContent>

        <DialogActions
          sx={{
            p: { xs: 2, sm: 3 },
            gap: 1,
          }}
        >
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancelar
          </Button>
          {multiple && (
            <Button
              onClick={handleConfirmSelection}
              variant="contained"
              disabled={store.selectedMedia.length === 0}
              startIcon={<Icon icon="mdi:check" />}
            >
              Seleccionar ({store.selectedMedia.length})
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon icon="mdi:upload" fontSize={24} />
              <Typography variant="h6">Subir Imágenes</Typography>
            </Box>
            <IconButton onClick={() => setUploadDialogOpen(false)} size="small">
              <Icon icon="mdi:close" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <MediaUploadZone
            onUploadComplete={handleUploadComplete}
            {...(filterType && { filterType })}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MediaLibraryDialog
