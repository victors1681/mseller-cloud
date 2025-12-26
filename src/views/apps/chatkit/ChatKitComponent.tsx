// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material'

// ** ChatKit Imports
import { ChatKit, useChatKit } from '@openai/chatkit-react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ChatKitProps, ChatKitSession } from 'src/types/apps/chatkitTypes'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Config Imports

/**
 * ChatKit Component
 * Embeds OpenAI ChatKit with workflow integration using official React SDK
 */
const ChatKitComponent = ({
  workflowId,
  userId,
  className,
  onError,
  onSessionCreated,
}: ChatKitProps) => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  // ** State
  const [error, setError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // ** Load ChatKit Web Component Script
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ChatKit) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src =
      'https://cdn.platform.openai.com/deployments/chatkit/chatkit.js'
    script.async = true
    script.onload = () => setScriptLoaded(true)
    script.onerror = () => setError('Failed to load ChatKit script')

    document.head.appendChild(script)
  }, [])

  // ** Get Client Secret
  const getClientSecret = async (
    existingSecret?: string | null,
  ): Promise<string> => {
    try {
      if (existingSecret) {
        return existingSecret
      }

      const resolvedUserId = userId || auth.user?.userId || 'guest'

      const response = await fetch('/api/chatkit/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, userId: resolvedUserId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create ChatKit session')
      }

      const data = await response.json()
      const session: ChatKitSession = {
        clientSecret: data.client_secret,
        sessionId: data.session_id,
        userId: resolvedUserId,
      }

      onSessionCreated?.(session)

      return data.client_secret
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get client secret'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
      throw err
    }
  }

  // ** Initialize ChatKit using official React SDK
  const { control } = useChatKit({
    api: { getClientSecret },
    startScreen: {
      greeting:
        '¡Hola! Soy tu asistente virtual de MSeller.\n¿En qué puedo ayudarte hoy?',
      prompts: [
        {
          label: '📦 Consultar productos',
          prompt:
            '¿Qué productos tenemos disponibles? Muéstrame el inventario con stock bajo.',
        },
        {
          label: '👥 Información de cliente',
          prompt:
            'Necesito ver el estado de cuenta y frecuencia de pedidos de un cliente.',
        },
        {
          label: '📊 Rendimiento de vendedor',
          prompt:
            '¿Cómo está el rendimiento de ventas? Muéstrame las métricas de cobro y clientes top.',
        },
        {
          label: '🚚 Estado de entregas',
          prompt:
            'Quiero ver el estado de las entregas de hoy y el rendimiento de los choferes.',
        },
        {
          label: '📋 Pedidos pendientes',
          prompt: 'Muéstrame los pedidos pendientes de esta semana.',
        },
        {
          label: '💰 Análisis de cobranza',
          prompt:
            '¿Qué clientes tienen saldo vencido y cuál es la tasa de cobro actual?',
        },
      ],
    },
    composer: { placeholder: 'Escribe tu mensaje aquí...' },
  })

  // ** Loading state
  if (!scriptLoaded || !control) {
    return (
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: 400, sm: 600 },
              gap: 2,
            }}
          >
            <CircularProgress size={48} />
            <Typography variant="body2" color="text.secondary">
              {!scriptLoaded ? 'Cargando ChatKit...' : 'Inicializando chat...'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Workflow ID: {workflowId?.substring(0, 20)}...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  // ** Error State
  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert
            severity="error"
            action={
              <IconButton
                size="small"
                onClick={() => router.reload()}
                sx={{ color: 'error.main' }}
              >
                <Icon icon="mdi:refresh" />
              </IconButton>
            }
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Error al cargar el chat:</strong>
            </Typography>
            <Typography variant="caption">{error}</Typography>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box
      sx={{
        height: { xs: 'calc(100vh - 160px)', sm: '600px' },
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        '& openai-chatkit': {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: '400px',
          width: '100%',
        },
      }}
    >
      <ChatKit
        control={control}
        className={className || 'mseller-chatkit'}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: '400px',
          width: '100%',
        }}
      />
    </Box>
  )
}

export default ChatKitComponent
