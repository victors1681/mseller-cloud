// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import ChatLog from './ChatLog'
import SendMsgForm from './SendMsgForm'

// ** Types
import {
  ChatContentType,
  getChannelIcon,
  getChannelName,
} from 'src/types/apps/communicationTypes'

// ** Redux
import { useAppDispatch, useAppSelector } from 'src/store'
import { clearUnreadCount } from 'src/store/apps/communication'

// ** SignalR Service
import signalRService from 'src/services/signalRService'

const ChatWrapperStartChat = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  height: '100%',
  display: 'flex',
  borderRadius: 1,
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover,
}))

const ChatContent = (props: ChatContentType) => {
  // ** Props
  const { hidden, mdAbove } = props

  // ** Redux
  const dispatch = useAppDispatch()
  const store = useAppSelector((state) => state.communication)

  useEffect(() => {
    if (store.selectedConversation) {
      // Subscribe to conversation updates
      signalRService.subscribeToConversation(
        store.selectedConversation.conversationId,
      )

      // Mark messages as read
      const unreadMessages = store.messages.filter(
        (m) => m.direction === 'Inbound' && !m.readAt,
      )

      unreadMessages.forEach((message) => {
        signalRService.markMessageAsRead(message.messageId)
      })

      // Clear unread count in store
      dispatch(clearUnreadCount(store.selectedConversation.conversationId))

      return () => {
        // Unsubscribe when leaving conversation
        if (store.selectedConversation) {
          signalRService.unsubscribeFromConversation(
            store.selectedConversation.conversationId,
          )
        }
      }
    }
  }, [store.selectedConversation, dispatch])

  const handleSendMessage = async (message: string) => {
    if (!store.selectedConversation) return

    try {
      const result = await signalRService.sendMessage(
        store.selectedConversation.conversationId,
        message,
        store.selectedConversation.channelType, // Pass the conversation's channel type
      )

      if (!result.success) {
        console.error('Failed to send message:', result.error)
        // TODO: Show error toast
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // TODO: Show error toast
    }
  }

  const renderContent = () => {
    if (!store.selectedConversation) {
      return (
        <ChatWrapperStartChat
          sx={{
            ...(!mdAbove && {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }),
          }}
        >
          <Icon icon="mdi:message-text-outline" fontSize={100} />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Start Conversation
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', px: 4 }}>
            Select a conversation from the left sidebar to start messaging
          </Typography>
        </ChatWrapperStartChat>
      )
    }

    return (
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          height: '100%',
          backgroundColor: 'action.hover',
        }}
      >
        <Box
          sx={{
            py: 3,
            px: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
              }}
            >
              {store.selectedConversation.contactName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {store.selectedConversation.contactName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {store.selectedConversation.phoneNumber}
                </Typography>
                <Chip
                  icon={
                    <Icon
                      icon={getChannelIcon(
                        store.selectedConversation.channelType,
                      )}
                      fontSize={14}
                    />
                  }
                  label={getChannelName(store.selectedConversation.channelType)}
                  size="small"
                  color={
                    store.selectedConversation.channelType === 1
                      ? 'success'
                      : 'info'
                  }
                  sx={{ height: 20 }}
                />
                {store.selectedConversation.isUnassigned && (
                  <Chip label="Unassigned" size="small" color="warning" />
                )}
                {store.isConnected && (
                  <Chip
                    icon={<Icon icon="mdi:check-circle" fontSize={14} />}
                    label="Conectado"
                    size="small"
                    color="success"
                    sx={{ height: 20 }}
                  />
                )}
              </Box>
              {store.typingUsers[store.selectedConversation.conversationId] && (
                <Typography
                  variant="caption"
                  sx={{ color: 'primary.main', fontStyle: 'italic' }}
                >
                  Typing...
                </Typography>
              )}
            </Box>
          </Box>

          <Box>
            <IconButton size="small">
              <Icon icon="mdi:dots-vertical" />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            height: 'calc(95% - 8.875rem)',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? '#f5f5f5'
                : theme.palette.background.default,
          }}
        >
          {store.messagesLoading ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <ChatLog hidden={hidden} messages={store.messages} />
          )}
        </Box>

        <SendMsgForm
          onSendMessage={handleSendMessage}
          disabled={store.sendingMessage || !store.isConnected}
        />
      </Box>
    )
  }

  return renderContent()
}

export default ChatContent
