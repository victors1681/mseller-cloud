// ** Types for Communication Module (WhatsApp & SMS)

// ============================================
// Enums
// ============================================
export enum ChannelType {
  WhatsApp = 1,
  SMS = 2,
}

// Helper functions for channel type
export const getChannelIcon = (channelType: ChannelType): string => {
  return channelType === ChannelType.WhatsApp
    ? 'mdi:whatsapp'
    : 'mdi:message-text'
}

export const getChannelName = (channelType: ChannelType): string => {
  return channelType === ChannelType.WhatsApp ? 'WhatsApp' : 'SMS'
}

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
  channelType: ChannelType
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
  channelType: ChannelType
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
  phoneNumber: string // For SMS
  phoneNumberWhatsApp?: string // For WhatsApp (optional, separate from SMS)
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
  channelType?: ChannelType
  attachmentUrls?: string[]
}

export interface SendMessageResponse {
  messageId: number
}

export interface AssignContactRequest {
  clienteCodigo: string
}

export interface UpdateContactRequest {
  nombreContacto: string
  phoneNumber: string // For SMS
  phoneNumberWhatsApp?: string // For WhatsApp (optional)
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
  channelType: ChannelType
  timestamp: string
  messageContent?: string
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
  channelType?: ChannelType
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

// ============================================
// Configuration Interfaces
// ============================================
export interface CommunicationConfig {
  id: number
  businessId: string
  twilioAccountSid: string
  twilioAuthToken: string
  twilioWhatsAppNumber: string
  twilioSmsNumber: string
  twilioWebhookSecret: string
  whatsAppEnabled: boolean
  smsEnabled: boolean
  isActive: boolean
  fechaCreacion: string
  fechaModificacion: string
}

export interface CommunicationConfigForm {
  twilioAccountSid: string
  twilioAuthToken: string
  twilioWhatsAppNumber: string
  twilioSmsNumber: string
  twilioWebhookSecret: string
  whatsAppEnabled: boolean
  smsEnabled: boolean
  isActive: boolean
}

export interface CommunicationConfigState {
  config: CommunicationConfig | null
  loading: boolean
  saving: boolean
  deleting: boolean
  error: string | null
  mode: 'create' | 'edit'
  successMessage: string | null
}
