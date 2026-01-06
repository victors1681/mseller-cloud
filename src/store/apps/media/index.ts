// ** Redux Imports
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** Types
import {
  BulkDeleteRequest,
  BulkDeleteResponse,
  MediaFilters,
  MediaItem,
  MediaState,
  MediaType,
  MediaViewMode,
  PaginatedMediaResponse,
  UpdateMediaMetadataRequest,
  UsageReference,
} from 'src/types/apps/mediaTypes'

// ** Firebase Imports
import {
  addUsageReferenceFirebase,
  bulkDeleteMediaFirebase,
  deleteMediaFirebase,
  isValidResponse,
  listMediaFirebase,
  removeUsageReferenceFirebase,
  updateMediaMetadataFirebase,
} from 'src/firebase'

const initialState: MediaState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
  selectedMedia: [],
  filters: {
    search: '',
    type: MediaType.All,
    pageNumber: 1,
    pageSize: 20,
  },
  viewMode: MediaViewMode.Grid,
}

// ** Async Thunks
export const fetchMediaList = createAsyncThunk(
  'media/fetchMediaList',
  async (filters: MediaFilters, { rejectWithValue }) => {
    try {
      const response = await listMediaFirebase(filters)
      if (isValidResponse(response)) {
        return response
      }
      return rejectWithValue(response?.error || 'Error fetching media')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error fetching media')
    }
  },
)

export const updateMediaMetadata = createAsyncThunk(
  'media/updateMetadata',
  async (data: UpdateMediaMetadataRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateMediaMetadataFirebase(data)
      if (isValidResponse(response)) {
        // Refetch the media list after update
        dispatch(fetchMediaList(initialState.filters))
        return response
      }
      return rejectWithValue(response?.error || 'Error updating metadata')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error updating metadata')
    }
  },
)

export const deleteMedia = createAsyncThunk(
  'media/deleteMedia',
  async (mediaId: string, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await deleteMediaFirebase(mediaId)
      if (isValidResponse(response)) {
        // Refetch after deletion
        const state = getState() as { media: MediaState }
        dispatch(fetchMediaList(state.media.filters))
        return { mediaId }
      }
      return rejectWithValue(response?.error || 'Error deleting media')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error deleting media')
    }
  },
)

export const bulkDeleteMedia = createAsyncThunk(
  'media/bulkDeleteMedia',
  async (data: BulkDeleteRequest, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await bulkDeleteMediaFirebase(data)
      if (isValidResponse(response)) {
        // Refetch after bulk deletion
        const state = getState() as { media: MediaState }
        dispatch(fetchMediaList(state.media.filters))
        return response
      }
      return rejectWithValue(response?.error || 'Error bulk deleting media')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error bulk deleting media')
    }
  },
)

export const addUsageReference = createAsyncThunk(
  'media/addUsageReference',
  async (data: UsageReference, { rejectWithValue }) => {
    try {
      const response = await addUsageReferenceFirebase(data)
      if (isValidResponse(response)) {
        return data
      }
      return rejectWithValue(response?.error || 'Error adding usage reference')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error adding usage reference')
    }
  },
)

export const removeUsageReference = createAsyncThunk(
  'media/removeUsageReference',
  async (data: UsageReference, { rejectWithValue }) => {
    try {
      const response = await removeUsageReferenceFirebase(data)
      if (isValidResponse(response)) {
        return data
      }
      return rejectWithValue(
        response?.error || 'Error removing usage reference',
      )
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error removing usage reference')
    }
  },
)

// ** Slice
const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action: PayloadAction<MediaFilters>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setViewMode: (state, action: PayloadAction<MediaViewMode>) => {
      state.viewMode = action.payload
    },
    setSelectedMedia: (state, action: PayloadAction<MediaItem[]>) => {
      state.selectedMedia = action.payload
    },
    toggleMediaSelection: (state, action: PayloadAction<MediaItem>) => {
      const index = state.selectedMedia.findIndex(
        (item) => item.id === action.payload.id,
      )
      if (index >= 0) {
        state.selectedMedia.splice(index, 1)
      } else {
        state.selectedMedia.push(action.payload)
      }
    },
    clearSelection: (state) => {
      state.selectedMedia = []
    },
  },
  extraReducers: (builder) => {
    // Fetch Media List
    builder
      .addCase(fetchMediaList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchMediaList.fulfilled,
        (state, action: PayloadAction<PaginatedMediaResponse>) => {
          state.loading = false
          state.data = action.payload.data
          state.total = action.payload.total
        },
      )
      .addCase(fetchMediaList.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Error fetching media'
      })

    // Update Metadata
    builder
      .addCase(updateMediaMetadata.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateMediaMetadata.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateMediaMetadata.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Error updating metadata'
      })

    // Delete Media
    builder
      .addCase(deleteMedia.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteMedia.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteMedia.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Error deleting media'
      })

    // Bulk Delete
    builder
      .addCase(bulkDeleteMedia.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        bulkDeleteMedia.fulfilled,
        (state, action: PayloadAction<BulkDeleteResponse>) => {
          state.loading = false
          state.selectedMedia = []
          // Show failures in error if any
          if (action.payload.failed.length > 0) {
            state.error = `Some items failed to delete: ${action.payload.failed
              .map((f) => f.reason)
              .join(', ')}`
          }
        },
      )
      .addCase(bulkDeleteMedia.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Error bulk deleting media'
      })
  },
})

export const {
  setLoading,
  clearError,
  setFilters,
  setViewMode,
  setSelectedMedia,
  toggleMediaSelection,
  clearSelection,
} = mediaSlice.actions

export default mediaSlice.reducer
