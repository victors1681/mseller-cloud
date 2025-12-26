// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components
import ChatKitComponent from 'src/views/apps/chatkit/ChatKitComponent'

// ** Types
import { ChatKitSession } from 'src/types/apps/chatkitTypes'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

const ChatKitView = () => {
  // ** Hooks
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const auth = useAuth()

  // ** State
  const [sessionInfo, setSessionInfo] = useState<ChatKitSession | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ** Get workflow ID from environment variable or use default
  const WORKFLOW_ID =
    process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID ||
    'wf_694bcfa27d008190bfea49d38cf488680c8fe335749752f0'

  // ** Handlers
  const handleSessionCreated = (session: ChatKitSession) => {
    console.log('ChatKit session created:', session)
    setSessionInfo(session)
    setError(null)
  }

  const handleError = (err: Error) => {
    console.error('ChatKit error:', err)
    setError(err.message)
  }

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }}>
      {/* Info Card (Desktop Only) */}

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Icon icon="mdi:robot-outline" fontSize="1.5rem" />
                <Typography variant="h6">Chat AI Assistant</Typography>
              </Box>
            }
          />
          <Divider />
        </Card>
      </Grid>

      {/* Chat Component */}
      <Grid item xs={12}>
        <Card>
          <CardContent
            sx={{
              p: { xs: 2, sm: 3 },
              '&:last-child': { pb: { xs: 2, sm: 3 } },
            }}
          >
            <Box
              sx={{
                height: { xs: 'calc(100vh - 120px)', sm: 'auto' },
              }}
            >
              <ChatKitComponent
                workflowId={WORKFLOW_ID}
                userId={auth.user?.userId}
                className="mseller-chatkit"
                onSessionCreated={handleSessionCreated}
                onError={handleError}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Error Display (Mobile) */}
      {error && isMobile && (
        <Grid item xs={12}>
          <Alert severity="error">
            <Typography variant="body2">{error}</Typography>
          </Alert>
        </Grid>
      )}

      {/* Mobile Info Card */}
      {isMobile && sessionInfo && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Session: {sessionInfo.sessionId?.substring(0, 20)}...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

export default ChatKitView
