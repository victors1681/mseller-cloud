// ** ChatKit Types

export interface ChatKitSession {
  clientSecret: string
  sessionId?: string
  userId?: string
}

export interface ChatKitConfig {
  workflowId: string
  userId?: string
  deviceId?: string
}

export interface ChatKitMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface ChatKitState {
  isOpen: boolean
  loading: boolean
  error: string | null
  sessionData: ChatKitSession | null
  messages: ChatKitMessage[]
}

export interface ChatKitProps {
  workflowId: string
  userId?: string
  className?: string
  onError?: (error: Error) => void
  onSessionCreated?: (session: ChatKitSession) => void
}
