// ** SignalR Imports
import * as signalR from '@microsoft/signalr'

// ** Store Imports
import { AppDispatch } from 'src/store'
import {
  addNewMessage,
  fetchConversations,
  setConnectionStatus,
  setTypingStatus,
  updateConversationLastMessage,
  updateMessageStatus,
} from 'src/store/apps/communication'

// ** Types
import {
  MessageList,
  MessageReadEvent,
  MessageStatus,
  MessageStatusChangedEvent,
  NewMessageEvent,
  SendMessageResult,
  UserTypingEvent,
} from 'src/types/apps/communicationTypes'

// ** API Client
import restClient from 'src/configs/restClient'

class SignalRService {
  private connection: signalR.HubConnection | null = null
  private dispatch: AppDispatch | null = null
  private authToken: string | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  /**
   * Initialize the SignalR connection
   */
  async initialize(authToken: string, dispatch: AppDispatch) {
    this.authToken = authToken
    this.dispatch = dispatch

    // Get the target URL from restClient headers (same as API calls)
    const targetUrl = restClient.defaults.headers['X-URL'] as string

    // Build connection through Next.js proxy
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/api/communicationHub', {
        accessTokenFactory: () => this.authToken || '',
        headers: {
          'x-url': targetUrl, // Pass target URL to Next.js proxy
        },
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    // Set up event handlers BEFORE starting connection
    this.setupEventHandlers()

    // Start connection
    await this.startConnection()
  }

  /**
   * Start the SignalR connection
   */
  private async startConnection() {
    if (!this.connection) return

    try {
      await this.connection.start()
      console.log('SignalR Connected')
      this.dispatch?.(setConnectionStatus(true))
      this.reconnectAttempts = 0
    } catch (err) {
      console.error('SignalR Connection Error:', err)
      this.dispatch?.(setConnectionStatus(false))

      // Retry connection
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++
        setTimeout(() => this.startConnection(), 5000)
      }
    }
  }

  /**
   * Set up SignalR event handlers
   */
  private setupEventHandlers() {
    if (!this.connection || !this.dispatch) return

    // Connection lifecycle events
    this.connection.onclose((error: Error | undefined) => {
      console.error('SignalR Connection closed:', error)
      this.dispatch?.(setConnectionStatus(false))

      // Attempt to reconnect
      setTimeout(() => this.startConnection(), 5000)
    })

    this.connection.onreconnecting((error: Error | undefined) => {
      console.log('SignalR Reconnecting...', error)
      this.dispatch?.(setConnectionStatus(false))
    })

    this.connection.onreconnected((connectionId: string | undefined) => {
      console.log('SignalR Reconnected:', connectionId)
      this.dispatch?.(setConnectionStatus(true))
      this.reconnectAttempts = 0

      // Refresh data after reconnection
      this.dispatch?.(fetchConversations({}))
    })

    // ReceiveMessage Event - conversation-specific with full message details
    this.connection.on('ReceiveMessage', (message: any) => {
      // Transform PascalCase to camelCase (backend sends PascalCase)
      const transformedMessage: MessageList = {
        messageId: message.MessageId,
        conversationId: message.ConversationId,
        direction: message.Direction,
        status: message.Status,
        messageContent: message.MessageContent,
        sentAt: message.SentAt,
        deliveredAt: message.DeliveredAt || null,
        readAt: message.ReadAt || null,
        attachments: message.Attachments || [],
      }

      // Add to messages if viewing this conversation
      this.dispatch?.(addNewMessage(transformedMessage))

      // Show browser notification if not focused
      if (!document.hasFocus()) {
        this.showNotification('New WhatsApp Message', transformedMessage.messageContent)
      }
    })

    // NewMessage Event - tenant-wide for conversation list updates
    this.connection.on('NewMessage', (data: any) => {
      // Transform PascalCase to camelCase
      const transformedData: NewMessageEvent = {
        messageId: data.MessageId,
        conversationId: data.ConversationId,
        isUnassignedContact: data.IsUnassignedContact,
        timestamp: data.Timestamp,
        messageContent: data.MessageContent,
      }

      // Update conversation list (last message, unread count, etc.)
      this.dispatch?.(
        updateConversationLastMessage({
          conversationId: transformedData.conversationId,
          lastMessage: transformedData.messageContent || '',
          lastMessageAt: transformedData.timestamp,
          incrementUnread: true,
        }),
      )
    })

    // Message Status Changed Event
    this.connection.on(
      'MessageStatusChanged',
      (data: any) => {
        // Transform PascalCase to camelCase
        const transformedData: MessageStatusChangedEvent = {
          messageId: data.MessageId,
          conversationId: data.ConversationId,
          newStatus: data.NewStatus,
          timestamp: data.Timestamp,
        }

        this.dispatch?.(
          updateMessageStatus({
            messageId: transformedData.messageId,
            status: transformedData.newStatus,
          }),
        )
      },
    )

    // Message Read Event
    this.connection.on('MessageRead', (data: any) => {
      // Transform PascalCase to camelCase
      const transformedData: MessageReadEvent = {
        messageId: data.MessageId,
        conversationId: data.ConversationId,
        readAt: data.ReadAt,
      }

      this.dispatch?.(
        updateMessageStatus({
          messageId: transformedData.messageId,
          status: MessageStatus.Read,
          timestamp: transformedData.readAt,
        }),
      )
    })

    // User Typing Event
    this.connection.on('UserTyping', (data: any) => {
      // Transform PascalCase to camelCase
      const transformedData: UserTypingEvent = {
        conversationId: data.ConversationId,
        isTyping: data.IsTyping,
        timestamp: data.Timestamp,
      }

      this.dispatch?.(
        setTypingStatus({
          conversationId: transformedData.conversationId,
          isTyping: transformedData.isTyping,
        }),
      )
    })
  }

  /**
   * Subscribe to a specific conversation
   */
  async subscribeToConversation(conversationId: number) {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error('SignalR not connected')
      return
    }

    try {
      await this.connection.invoke('SubscribeToConversation', conversationId)
    } catch (err) {
      console.error('Error subscribing to conversation:', err)
    }
  }

  /**
   * Unsubscribe from a conversation
   */
  async unsubscribeFromConversation(conversationId: number) {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      return
    }

    try {
      await this.connection.invoke(
        'UnsubscribeFromConversation',
        conversationId,
      )
    } catch (err) {
      console.error('Error unsubscribing from conversation:', err)
    }
  }

  /**
   * Send a message via SignalR
   */
  async sendMessage(
    conversationId: number,
    messageContent: string,
  ): Promise<SendMessageResult> {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      return { success: false, error: 'Not connected to SignalR' }
    }

    try {
      const result = await this.connection.invoke(
        'SendMessage',
        conversationId,
        messageContent,
      )

      // Backend returns full message object, not SendMessageResult
      // The message will be received via ReceiveMessage event
      return { success: true, messageId: result?.MessageId }
    } catch (err) {
      console.error('Error sending message via SignalR:', err)
      return { success: false, error: 'Failed to send message' }
    }
  }

  /**
   * Mark a message as read
   */
  async markMessageAsRead(messageId: number) {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      return
    }

    try {
      await this.connection.invoke('MarkMessageAsRead', messageId)
    } catch (err) {
      console.error('Error marking message as read:', err)
    }
  }

  /**
   * Send typing indicator
   */
  async sendTypingIndicator(conversationId: number, isTyping: boolean) {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      return
    }

    try {
      await this.connection.invoke(
        'SendTypingIndicator',
        conversationId,
        isTyping,
      )
    } catch (err) {
      console.error('Error sending typing indicator:', err)
    }
  }

  /**
   * Show browser notification
   */
  private showNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/images/logos/mseller-logo.svg',
        badge: '/images/logos/mseller-logo.svg',
      })
    } else if (
      'Notification' in window &&
      Notification.permission !== 'denied'
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/images/logos/mseller-logo.svg',
          })
        }
      })
    }
  }

  /**
   * Stop the SignalR connection
   */
  async stop() {
    if (this.connection) {
      try {
        await this.connection.stop()
        console.log('SignalR Disconnected')
        this.dispatch?.(setConnectionStatus(false))
      } catch (err) {
        console.error('Error stopping SignalR:', err)
      }
    }
  }

  /**
   * Get connection state
   */
  getState(): signalR.HubConnectionState | null {
    return this.connection?.state || null
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected
  }

  /**
   * Disconnect from SignalR hub
   */
  async disconnect() {
    if (this.connection) {
      try {
        await this.connection.stop()
        console.log('SignalR Disconnected')
        this.dispatch?.(setConnectionStatus(false))
      } catch (err) {
        console.error('Error disconnecting SignalR:', err)
      }
    }
  }
}

// Export singleton instance
const signalRService = new SignalRService()
export default signalRService
