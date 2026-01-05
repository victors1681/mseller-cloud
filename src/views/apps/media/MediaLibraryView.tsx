// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Hidden from '@mui/material/Hidden'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Pagination from '@mui/material/Pagination'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Redux Imports
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  bulkDeleteMedia,
  clearSelection,
  deleteMedia,
  fetchMediaList,
  setFilters,
  setViewMode,
  toggleMediaSelection,
  updateMediaMetadata,
} from 'src/store/apps/media'

// ** Components
import MediaCard from 'src/views/apps/media/components/MediaCard'
import LoadingWrapper from 'src/views/ui/LoadingWrapper'
import MediaUploadZone from 'src/views/ui/mediaUploadZone'

// ** Types
import { MediaItem, MediaType, MediaViewMode } from 'src/types/apps/mediaTypes'

// ** Utils
import { debounce } from '@mui/material/utils'
import toast from 'react-hot-toast'
import { toLocalDateTimeString } from 'src/utils/dateUtils'

const MediaLibraryView = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // ** Redux State
  const dispatch = useAppDispatch()
  const store = useAppSelector((state) => state.media)

  // ** Local State
  const [searchTerm, setSearchTerm] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editTags, setEditTags] = useState('')

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
    dispatch(fetchMediaList(store.filters))
  }, [store.filters])

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

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: MediaViewMode | null,
  ) => {
    if (newMode) {
      dispatch(setViewMode(newMode))
    }
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

  const handleEdit = (media: MediaItem) => {
    setSelectedItem(media)
    setEditTitle(media.title || '')
    setEditDescription(media.description || '')
    setEditTags(media.tags?.join(', ') || '')
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedItem) return

    try {
      await dispatch(
        updateMediaMetadata({
          mediaId: selectedItem.id,
          title: editTitle,
          description: editDescription,
          tags: editTags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      ).unwrap()

      toast.success('Metadata actualizada')
      setEditDialogOpen(false)
    } catch (error) {
      toast.error('Error al actualizar metadata')
    }
  }

  const handleDeleteClick = (media: MediaItem) => {
    setSelectedItem(media)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedItem) return

    try {
      await dispatch(deleteMedia(selectedItem.id)).unwrap()
      toast.success('Medio eliminado')
      setDeleteDialogOpen(false)
    } catch (error) {
      toast.error('Error al eliminar medio')
    }
  }

  const handleBulkDelete = async () => {
    const itemsWithUsage = store.selectedMedia.filter(
      (item) =>
        (item.usedBy?.products?.length || 0) +
          (item.usedBy?.customers?.length || 0) >
        0,
    )

    if (itemsWithUsage.length > 0) {
      toast.error(
        'No se pueden eliminar medios que están en uso. Desvincula primero.',
      )
      return
    }

    try {
      await dispatch(
        bulkDeleteMedia({
          mediaIds: store.selectedMedia.map((item) => item.id),
        }),
      ).unwrap()

      toast.success('Medios eliminados')
      dispatch(clearSelection())
    } catch (error) {
      toast.error('Error al eliminar medios')
    }
  }

  const handleUploadComplete = () => {
    setUploadDialogOpen(false)
    dispatch(fetchMediaList(store.filters))
    toast.success('Archivos subidos exitosamente')
  }

  const handleView = (media: MediaItem) => {
    setSelectedItem(media)
    setPreviewDialogOpen(true)
  }

  const totalPages = Math.ceil(store.total / (store.filters.pageSize || 20))

  const usedByCount = selectedItem
    ? (selectedItem.usedBy?.products?.length || 0) +
      (selectedItem.usedBy?.customers?.length || 0)
    : 0

  return (
    <>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Icon icon="mdi:folder-multiple-image" fontSize={32} />
                  <Box>
                    <Typography variant="h5">Biblioteca de Medios</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Administra tus imágenes y archivos
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Icon icon="mdi:upload" />}
                    onClick={() => setUploadDialogOpen(true)}
                    sx={{ minHeight: { xs: 44, sm: 'auto' } }}
                  >
                    Subir Archivos
                  </Button>

                  <Hidden mdDown>
                    <ToggleButtonGroup
                      value={store.viewMode}
                      exclusive
                      onChange={handleViewModeChange}
                      size="small"
                    >
                      <ToggleButton value={MediaViewMode.Grid}>
                        <Icon icon="mdi:view-grid-outline" />
                      </ToggleButton>
                      <ToggleButton value={MediaViewMode.List}>
                        <Icon icon="mdi:view-list-outline" />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Hidden>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8} md={9}>
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
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      value={store.filters.type || MediaType.All}
                      onChange={handleTypeChange}
                      label="Tipo"
                    >
                      <MenuItem value={MediaType.All}>Todos</MenuItem>
                      <MenuItem value={MediaType.Products}>Productos</MenuItem>
                      <MenuItem value={MediaType.Profile}>Perfil</MenuItem>
                      <MenuItem value={MediaType.Documents}>
                        Documentos
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Bulk Actions */}
              {store.selectedMedia.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: 'primary.light',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="body2" color="primary.dark">
                    {store.selectedMedia.length} seleccionados
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => dispatch(clearSelection())}
                      color="primary"
                    >
                      Limpiar
                    </Button>
                    <Tooltip
                      title={
                        store.selectedMedia.some(
                          (item) =>
                            (item.usedBy?.products?.length || 0) +
                              (item.usedBy?.customers?.length || 0) >
                            0,
                        )
                          ? 'Algunos elementos están en uso'
                          : ''
                      }
                    >
                      <span>
                        <Button
                          size="small"
                          onClick={handleBulkDelete}
                          color="error"
                          variant="outlined"
                          disabled={store.selectedMedia.some(
                            (item) =>
                              (item.usedBy?.products?.length || 0) +
                                (item.usedBy?.customers?.length || 0) >
                              0,
                          )}
                          startIcon={<Icon icon="mdi:delete-outline" />}
                        >
                          Eliminar
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Media Grid */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <LoadingWrapper isLoading={store.loading}>
                {store.data.length === 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 400,
                      textAlign: 'center',
                    }}
                  >
                    <Icon
                      icon="mdi:image-off-outline"
                      fontSize={80}
                      color="action.disabled"
                    />
                    <Typography
                      variant="h6"
                      sx={{ mt: 2 }}
                      color="text.secondary"
                    >
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
                    {store.viewMode === MediaViewMode.Grid ? (
                      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
                        {store.data.map((media) => (
                          <Grid item xs={6} sm={4} md={3} lg={2} key={media.id}>
                            <MediaCard
                              media={media}
                              selected={store.selectedMedia.some(
                                (item) => item.id === media.id,
                              )}
                              onSelect={(media) =>
                                dispatch(toggleMediaSelection(media))
                              }
                              onEdit={handleEdit}
                              onDelete={handleDeleteClick}
                              onView={handleView}
                              selectionMode={false}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                        }}
                      >
                        {store.data.map((media) => {
                          const usedByCount =
                            (media.usedBy?.products?.length || 0) +
                            (media.usedBy?.customers?.length || 0)
                          return (
                            <Card
                              key={media.id}
                              sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                              }}
                            >
                              <Box
                                onClick={() => handleView(media)}
                                sx={{
                                  width: { xs: '100%', sm: 200 },
                                  height: { xs: 200, sm: 150 },
                                  flexShrink: 0,
                                  cursor: 'pointer',
                                  position: 'relative',
                                  backgroundColor: 'action.hover',
                                  '&:hover .view-overlay': {
                                    opacity: 1,
                                  },
                                }}
                              >
                                <img
                                  src={media.thumbnailUrl || media.originalUrl}
                                  alt={media.title || 'Media'}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                />
                                <Box
                                  className="view-overlay"
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease',
                                  }}
                                >
                                  <Icon
                                    icon="mdi:magnify-plus"
                                    fontSize={48}
                                    color="white"
                                  />
                                </Box>
                              </Box>
                              <CardContent
                                sx={{
                                  flex: 1,
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'start',
                                    mb: 1,
                                  }}
                                >
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                                      {media.title ||
                                        media.originalFile?.split('/').pop() ||
                                        'Sin título'}
                                    </Typography>
                                    {media.description && (
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                      >
                                        {media.description}
                                      </Typography>
                                    )}
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        gap: 1,
                                        flexWrap: 'wrap',
                                        mb: 1,
                                      }}
                                    >
                                      <Chip
                                        label={media.type}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                      <Chip
                                        label={`${(
                                          media.metadata.size / 1024
                                        ).toFixed(1)} KB`}
                                        size="small"
                                        variant="outlined"
                                      />
                                      <Chip
                                        label={`${media.metadata.width}x${media.metadata.height}`}
                                        size="small"
                                        variant="outlined"
                                      />
                                      {usedByCount > 0 && (
                                        <Chip
                                          label={`En uso: ${usedByCount}`}
                                          size="small"
                                          color="info"
                                          icon={
                                            <Icon
                                              icon="mdi:link-variant"
                                              fontSize={14}
                                            />
                                          }
                                        />
                                      )}
                                    </Box>
                                    {media.tags && media.tags.length > 0 && (
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          gap: 0.5,
                                          flexWrap: 'wrap',
                                          mb: 1,
                                        }}
                                      >
                                        {media.tags.map((tag, idx) => (
                                          <Chip
                                            key={idx}
                                            label={tag}
                                            size="small"
                                          />
                                        ))}
                                      </Box>
                                    )}
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {toLocalDateTimeString(media.createdAt)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEdit(media)}
                                    >
                                      <Icon icon="mdi:pencil-outline" />
                                    </IconButton>
                                    {usedByCount === 0 && (
                                      <IconButton
                                        size="small"
                                        onClick={() => handleDeleteClick(media)}
                                        color="error"
                                      >
                                        <Icon icon="mdi:delete-outline" />
                                      </IconButton>
                                    )}
                                    <Checkbox
                                      checked={store.selectedMedia.some(
                                        (item) => item.id === media.id,
                                      )}
                                      onChange={() =>
                                        dispatch(toggleMediaSelection(media))
                                      }
                                    />
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          )
                        })}
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar Metadata</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Etiquetas (separadas por comas)"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="logo, producto, banner"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            {usedByCount > 0 ? (
              <>
                Este medio está siendo usado en <strong>{usedByCount}</strong>{' '}
                {usedByCount === 1 ? 'lugar' : 'lugares'}. No se puede eliminar.
              </>
            ) : (
              '¿Estás seguro de que deseas eliminar este medio? Esta acción no se puede deshacer.'
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          {usedByCount === 0 && (
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Eliminar
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6">Subir Archivos</Typography>
            <IconButton onClick={() => setUploadDialogOpen(false)} size="small">
              <Icon icon="mdi:close" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <MediaUploadZone
            type={
              store.filters.type === MediaType.All
                ? MediaType.Products
                : store.filters.type
            }
            onUploadComplete={handleUploadComplete}
            maxFiles={10}
            showLibraryButton={false}
          />
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6">
              {selectedItem?.title ||
                selectedItem?.originalFile?.split('/').pop() ||
                'Vista Previa'}
            </Typography>
            <IconButton
              onClick={() => setPreviewDialogOpen(false)}
              size="small"
            >
              <Icon icon="mdi:close" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: isMobile ? 300 : 500,
                  backgroundColor: 'action.hover',
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <img
                  src={selectedItem.originalUrl}
                  alt={selectedItem.title || 'Original'}
                  style={{
                    maxWidth: '100%',
                    maxHeight: isMobile ? '60vh' : '70vh',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip label={selectedItem.type} color="primary" />
                <Chip
                  label={`${(selectedItem.metadata.size / 1024).toFixed(1)} KB`}
                />
                <Chip
                  label={`${selectedItem.metadata.width}x${selectedItem.metadata.height}`}
                />
                <Chip label={selectedItem.originalFormat} />
              </Box>
              {selectedItem.description && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {selectedItem.description}
                </Typography>
              )}
              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedItem.tags.map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            component="a"
            href={selectedItem?.originalUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<Icon icon="mdi:download" />}
            disabled={!selectedItem?.originalUrl}
          >
            Descargar Original
          </Button>
          <Button onClick={() => setPreviewDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MediaLibraryView
