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
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components
import ChatKitComponent from 'src/views/apps/ai-agent/ChatKitComponent'

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

  // ** Get workflow ID from user's business configuration
  const WORKFLOW_ID = auth.user?.business?.config?.aiAgents?.find(
    (agent) => agent.enabled && agent.workflowId,
  )?.workflowId

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
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 56, sm: 64 },
        left: { xs: 0, sm: 260 },
        right: 0,
        bottom: { xs: 80, sm: 60 },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: { xs: 0, sm: 3 },
        bgcolor: 'background.default',
      }}
    >
      {/* Header - Desktop Only */}
      {!isMobile && (
        <Box sx={{ flexShrink: 0, mb: 2 }}>
          <Card>
            <CardHeader
              sx={{ py: 2 }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Icon icon="mdi:robot-outline" fontSize="1.5rem" />
                  <Typography variant="h6">Chat AI Assistant</Typography>
                </Box>
              }
            />
            <Divider />
          </Card>
        </Box>
      )}

      {/* Workflow ID Error */}
      {!WORKFLOW_ID && (
        <Alert
          severity="error"
          icon={<Icon icon="mdi:alert-circle-outline" />}
          sx={{ mb: 2, flexShrink: 0 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Configuración del Agente AI no disponible
          </Typography>
          <Typography variant="caption" color="text.secondary">
            El ID del workflow del agente AI no está configurado en la
            configuración del negocio. Por favor, contacte al administrador para
            habilitar esta funcionalidad.
          </Typography>
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, flexShrink: 0 }}>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      )}

      {/* Chat Component */}
      {WORKFLOW_ID && (
        <Card
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 0, sm: 2 },
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              minHeight: 0,
              '&:last-child': { pb: { xs: 0, sm: 2 } },
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                minHeight: 0,
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
      )}
    </Box>
  )
}

export default ChatKitView
