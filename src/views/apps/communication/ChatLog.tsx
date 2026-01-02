// ** React Imports
import { useEffect, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import {
  MessageDirection,
  MessageList,
  MessageStatus,
} from 'src/types/apps/communicationTypes'

interface Props {
  hidden: boolean
  messages: MessageList[]
}

const ChatLog = styled(Box)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(5),
  overflowY: 'auto',
  overflowX: 'hidden',
}))

const MessageBox = styled(Box)<{ direction: MessageDirection }>(
  ({ theme, direction }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems:
      direction === MessageDirection.Outbound ? 'flex-end' : 'flex-start',
    marginBottom: theme.spacing(4),
  }),
)

const MessageBubble = styled(Box)<{ direction: MessageDirection }>(
  ({ theme, direction }) => ({
    maxWidth: '65%',
    padding: theme.spacing(2, 3),
    borderRadius: theme.spacing(2),
    wordBreak: 'break-word',
    backgroundColor:
      direction === MessageDirection.Outbound
        ? '#e3f2fd' // Light blue background for sent messages
        : theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : '#ffffff',
    color:
      direction === MessageDirection.Outbound
        ? '#1976d2' // Blue text for sent messages
        : theme.palette.text.primary,
    border:
      direction === MessageDirection.Inbound
        ? `1px solid ${theme.palette.divider}`
        : 'none',
    boxShadow: theme.shadows[1],
    [theme.breakpoints.down('sm')]: {
      maxWidth: '80%',
    },
  }),
)

const TimeStamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.disabled,
  marginTop: theme.spacing(0.5),
}))

const StatusIcon = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: theme.spacing(0.5),
  fontSize: '0.875rem',
}))

const ChatLogComponent = ({ hidden, messages }: Props) => {
  // ** Ref
  const chatLogRef = useRef<HTMLDivElement>(null)

  // ** Scroll to bottom on new messages
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight
    }
  }, [messages])

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case MessageStatus.Queued:
        return <Icon icon="mdi:clock-outline" fontSize="inherit" />
      case MessageStatus.Sent:
        return <Icon icon="mdi:check" fontSize="inherit" />
      case MessageStatus.Delivered:
        return <Icon icon="mdi:check-all" fontSize="inherit" />
      case MessageStatus.Read:
        return (
          <Icon
            icon="mdi:check-all"
            fontSize="inherit"
            style={{ color: '#4fc3f7' }}
          />
        )
      case MessageStatus.Failed:
        return (
          <Icon
            icon="mdi:alert-circle-outline"
            fontSize="inherit"
            style={{ color: '#f44336' }}
          />
        )
      default:
        return null
    }
  }

  const renderMessages = () => {
    return messages.map((message) => {
      const isOutbound = message.direction === MessageDirection.Outbound
      const messageDate = new Date(message.sentAt)
      const messageTime = messageDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })

      return (
        <MessageBox key={message.messageId} direction={message.direction}>
          <MessageBubble direction={message.direction}>
            {/* Message Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <Box sx={{ mb: 2 }}>
                {message.attachments.map((attachment) => {
                  if (attachment.attachmentType === 'Image') {
                    return (
                      <Box
                        key={attachment.attachmentId}
                        component="img"
                        src={attachment.url}
                        alt="attachment"
                        sx={{
                          maxWidth: '100%',
                          borderRadius: 1,
                          cursor: 'pointer',
                        }}
                        onClick={() => window.open(attachment.url, '_blank')}
                      />
                    )
                  }

                  return (
                    <Box
                      key={attachment.attachmentId}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: 1,
                        cursor: 'pointer',
                      }}
                      onClick={() => window.open(attachment.url, '_blank')}
                    >
                      <Icon icon="mdi:file-document-outline" />
                      <Typography variant="body2">Document</Typography>
                    </Box>
                  )
                })}
              </Box>
            )}

            {/* Message Content */}
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {message.messageContent}
            </Typography>
          </MessageBubble>

          {/* Timestamp and Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimeStamp variant="caption">{messageTime}</TimeStamp>
            {isOutbound && (
              <StatusIcon>{getStatusIcon(message.status)}</StatusIcon>
            )}
          </Box>
        </MessageBox>
      )
    })
  }

  const renderEmptyState = () => {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Icon icon="mdi:message-text-outline" fontSize={100} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Start a Conversation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select a conversation to start messaging
        </Typography>
      </Box>
    )
  }

  return (
    <ChatLog ref={chatLogRef}>
      {messages.length ? renderMessages() : !hidden && renderEmptyState()}
    </ChatLog>
  )
}

export default ChatLogComponent
