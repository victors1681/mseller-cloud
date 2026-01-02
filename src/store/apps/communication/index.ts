// ** Redux Imports
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// ** Types
import {
  CommunicationState,
  ConversationFilters,
  ConversationList,
  MessageFilters,
  MessageList,
  MessageStatus,
  PaginatedResponse,
  SendMessageRequest,
} from 'src/types/apps/communicationTypes'

// ** API Client
import restClient from 'src/configs/restClient'

// ** Initial State
const initialState: CommunicationState = {
  conversations: [],
  unassignedContacts: [],
  selectedConversation: null,
  messages: [],
  loading: false,
  error: null,
  messagesLoading: false,
  sendingMessage: false,
  isConnected: false,
  typingUsers: {},
}

// ============================================
// Async Thunks
// ============================================

// ** Fetch Conversations
export const fetchConversations = createAsyncThunk(
  'communication/fetchConversations',
  async (filters: ConversationFilters = {}, { rejectWithValue }) => {
    try {
      const params: any = {
        pageNumber: filters.pageNumber || 1,
        pageSize: filters.pageSize || 50,
        status: filters.status || 'Active',
      }

      // Add channelType filter if specified
      if (filters.channelType !== undefined) {
        params.channelType = filters.channelType
      }

      const response = await restClient.get<
        PaginatedResponse<ConversationList>
      >('/api/portal/Communication/conversations', { params })

      return response.data.items
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching conversations',
      )
    }
  },
)

// ** Fetch Unassigned Contacts
export const fetchUnassignedContacts = createAsyncThunk(
  'communication/fetchUnassignedContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await restClient.get('/api/portal/Contact/unassigned', {
        params: { page: 1, pageSize: 50 },
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching unassigned contacts',
      )
    }
  },
)

// ** Select Conversation
export const selectConversation = createAsyncThunk(
  'communication/selectConversation',
  async (conversationId: number, { dispatch, rejectWithValue }) => {
    try {
      // Fetch messages for this conversation
      await dispatch(
        fetchMessages({ conversationId, pageNumber: 1, pageSize: 50 }),
      )

      return conversationId
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error selecting conversation',
      )
    }
  },
)

// ** Fetch Messages
export const fetchMessages = createAsyncThunk(
  'communication/fetchMessages',
  async (filters: MessageFilters, { rejectWithValue }) => {
    try {
      const params = {
        pageNumber: filters.pageNumber || 1,
        pageSize: filters.pageSize || 50,
      }

      const response = await restClient.get<PaginatedResponse<MessageList>>(
        `/api/portal/Communication/conversations/${filters.conversationId}/messages`,
        { params },
      )

      return response.data.items
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching messages',
      )
    }
  },
)

// ** Send Message (REST API)
export const sendMessage = createAsyncThunk(
  'communication/sendMessage',
  async (data: SendMessageRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await restClient.post(
        '/api/portal/Communication/send',
        data,
      )

      // Refresh conversations after sending
      await dispatch(fetchConversations({}))

      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error sending message',
      )
    }
  },
)

// ** Assign Contact to Customer
export const assignContact = createAsyncThunk(
  'communication/assignContact',
  async (
    { contactId, clienteCodigo }: { contactId: number; clienteCodigo: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await restClient.put(`/api/portal/Contact/${contactId}/assign`, {
        clienteCodigo,
      })

      // Refresh data after assignment
      await dispatch(fetchConversations({}))
      await dispatch(fetchUnassignedContacts())

      return contactId
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error assigning contact',
      )
    }
  },
)

// ** Update Contact
export const updateContact = createAsyncThunk(
  'communication/updateContact',
  async (
    {
      contactId,
      data,
    }: {
      contactId: number
      data: { nombreContacto: string; phoneNumber: string; email?: string }
    },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await restClient.put(`/api/portal/Contact/${contactId}`, data)

      // Refresh conversations
      await dispatch(fetchConversations({}))

      return { contactId, data }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error updating contact',
      )
    }
  },
)

// ============================================
// Slice
// ============================================

export const communicationSlice = createSlice({
  name: 'communication',
  initialState,
  reducers: {
    // Clear selected conversation
    removeSelectedConversation: (state) => {
      state.selectedConversation = null
      state.messages = []
    },

    // Set SignalR connection status
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },

    // Add new message from SignalR
    addNewMessage: (state, action: PayloadAction<MessageList>) => {
      // Only add if not already in the list
      const exists = state.messages.some(
        (m) => m.messageId === action.payload.messageId,
      )

      if (!exists) {
        // Add message and create new array reference to trigger re-render
        state.messages = [...state.messages, action.payload]
      }
    },

    // Update message status
    updateMessageStatus: (
      state,
      action: PayloadAction<{
        messageId: number
        status: MessageStatus
        timestamp?: string
      }>,
    ) => {
      const message = state.messages.find(
        (m) => m.messageId === action.payload.messageId,
      )
      if (message) {
        message.status = action.payload.status

        // Update timestamp fields based on status
        if (
          action.payload.status === MessageStatus.Delivered &&
          action.payload.timestamp
        ) {
          message.deliveredAt = action.payload.timestamp
        } else if (
          action.payload.status === MessageStatus.Read &&
          action.payload.timestamp
        ) {
          message.readAt = action.payload.timestamp
        }
      }
    },

    // Handle typing indicator
    setTypingStatus: (
      state,
      action: PayloadAction<{ conversationId: number; isTyping: boolean }>,
    ) => {
      if (action.payload.isTyping) {
        state.typingUsers[action.payload.conversationId] = true
      } else {
        delete state.typingUsers[action.payload.conversationId]
      }
    },

    // Update conversation's last message and unread count
    updateConversationLastMessage: (
      state,
      action: PayloadAction<{
        conversationId: number
        lastMessage: string
        lastMessageAt: string
        incrementUnread?: boolean
      }>,
    ) => {
      const conversation = state.conversations.find(
        (c) => c.conversationId === action.payload.conversationId,
      )
      if (conversation) {
        conversation.lastMessage = action.payload.lastMessage
        conversation.lastMessageAt = action.payload.lastMessageAt
        if (action.payload.incrementUnread) {
          conversation.unreadCount += 1
        }
      }
    },

    // Clear unread count for a conversation
    clearUnreadCount: (state, action: PayloadAction<number>) => {
      const conversation = state.conversations.find(
        (c) => c.conversationId === action.payload,
      )
      if (conversation) {
        conversation.unreadCount = 0
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Conversations
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false
        state.conversations = action.payload
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch Unassigned Contacts
    builder
      .addCase(fetchUnassignedContacts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUnassignedContacts.fulfilled, (state, action) => {
        state.loading = false
        state.unassignedContacts = action.payload
      })
      .addCase(fetchUnassignedContacts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Select Conversation
    builder
      .addCase(selectConversation.pending, (state) => {
        state.messagesLoading = true
        state.error = null
      })
      .addCase(selectConversation.fulfilled, (state, action) => {
        state.messagesLoading = false
        const conversation = state.conversations.find(
          (c) => c.conversationId === action.payload,
        )
        if (conversation) {
          state.selectedConversation = conversation
        }
      })
      .addCase(selectConversation.rejected, (state, action) => {
        state.messagesLoading = false
        state.error = action.payload as string
      })

    // Fetch Messages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false
        state.messages = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false
        state.error = action.payload as string
      })

    // Send Message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.sendingMessage = false
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false
        state.error = action.payload as string
      })

    // Assign Contact
    builder
      .addCase(assignContact.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(assignContact.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(assignContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update Contact
    builder
      .addCase(updateContact.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateContact.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const {
  removeSelectedConversation,
  setConnectionStatus,
  addNewMessage,
  updateMessageStatus,
  setTypingStatus,
  updateConversationLastMessage,
  clearUnreadCount,
  clearError,
} = communicationSlice.actions

export default communicationSlice.reducer
