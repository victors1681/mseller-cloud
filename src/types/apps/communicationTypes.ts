// ** Types for Communication (WhatsApp) Module

// ============================================
// Enums
// ============================================
export enum MessageDirection {
  Inbound = 'Inbound',
  Outbound = 'Outbound',
}

export enum MessageStatus {
  Queued = 'Queued',
  Sent = 'Sent',
  Delivered = 'Delivered',
  Read = 'Read',
  Failed = 'Failed',
}

export enum ConversationStatus {
  Active = 'Active',
  Archived = 'Archived',
}

export enum AttachmentType {
  Image = 'Image',
  Document = 'Document',
  Audio = 'Audio',
  Video = 'Video',
}

// ============================================
// Message Interfaces
// ============================================
export interface MessageAttachment {
  attachmentId: number
  attachmentType: AttachmentType
  url: string
  mimeType: string
}

export interface MessageList {
  messageId: number
  conversationId: number
  direction: MessageDirection
  status: MessageStatus
  messageContent: string
  sentAt: string
  deliveredAt: string | null
  readAt: string | null
  attachments: MessageAttachment[]
}

// ============================================
// Conversation Interfaces
// ============================================
export interface ConversationList {
  conversationId: number
  contactoId: number
  contactName: string
  phoneNumber: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  status: ConversationStatus
  isUnassigned: boolean
}

// ============================================
// Contact Interfaces
// ============================================
export interface UnassignedContactList {
  contactoId: number
  nombreContacto: string
  phoneNumber: string
  lastMessageAt: string
  messageCount: number
  isActive: boolean
}

export interface ContactDetails {
  contactoId: number
  nombreContacto: string
  phoneNumber: string
  email: string | null
  clienteCodigo: string | null
  isAssigned: boolean
}

// ============================================
// Communication Configuration
// ============================================
export interface CommunicationConfig {
  twilioAccountSid: string
  twilioAuthToken: string
  twilioWhatsAppNumber: string
}

// ============================================
// API Request/Response Types
// ============================================
export interface SendMessageRequest {
  toContactoId: number
  messageContent: string
  attachmentUrl?: string | null
}

export interface SendMessageResponse {
  messageId: number
}

export interface AssignContactRequest {
  clienteCodigo: string
}

export interface UpdateContactRequest {
  nombreContacto: string
  phoneNumber: string
  email?: string | null
}

export interface PaginatedResponse<T> {
  items: T[]
  totalPages: number
  totalCount: number
  pageNumber: number
  pageSize: number
}

// ============================================
// SignalR Event Types
// ============================================
export interface NewMessageEvent {
  messageId: number
  conversationId: number
  isUnassignedContact: boolean
  timestamp: string
}

export interface MessageStatusChangedEvent {
  businessId: string
  messageId: number
  conversationId: number
  newStatus: MessageStatus
}

export interface MessageReadEvent {
  messageId: number
  readAt: string
}

export interface UserTypingEvent {
  conversationId: number
  isTyping: boolean
  connectionId: string
}

export interface SendMessageResult {
  success: boolean
  messageId?: number
  error?: string
}

// ============================================
// Redux State Types
// ============================================
export interface CommunicationState {
  conversations: ConversationList[]
  unassignedContacts: UnassignedContactList[]
  selectedConversation: ConversationList | null
  messages: MessageList[]
  loading: boolean
  error: string | null
  messagesLoading: boolean
  sendingMessage: boolean
  isConnected: boolean
  typingUsers: { [conversationId: number]: boolean }
}

// ============================================
// Component Props Types
// ============================================
export interface ConversationFilters {
  status?: ConversationStatus
  search?: string
  pageNumber?: number
  pageSize?: number
}

export interface MessageFilters {
  conversationId: number
  pageNumber?: number
  pageSize?: number
}

export interface SendMsgParamsType {
  conversationId: number
  message: string
  attachmentUrl?: string
}

export interface ChatContentType {
  hidden: boolean
  mdAbove: boolean
}

export interface SidebarLeftType {
  hidden: boolean
  mdAbove: boolean
  store: CommunicationState
  leftSidebarOpen: boolean
  handleLeftSidebarToggle: () => void
  onSelectConversation: (conversation: ConversationList) => void
}
