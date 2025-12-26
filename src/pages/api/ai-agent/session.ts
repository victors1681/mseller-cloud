// ** Next Imports
import type { NextApiRequest, NextApiResponse } from 'next/types'

// ** API Error Response
interface ErrorResponse {
  error: string
  message: string
}

// ** API Success Response
interface SessionResponse {
  client_secret: string
  session_id?: string
}

/**
 * API Handler for creating ChatKit sessions
 * @route POST /api/ai-agent/session
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SessionResponse | ErrorResponse>,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed',
    })
  }

  try {
    const { userId, workflowId } = req.body

    // Validate required fields
    if (!workflowId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'workflowId is required',
      })
    }

    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error('OPENAI_API_KEY is not configured')
      return res.status(500).json({
        error: 'Configuration Error',
        message: 'OpenAI API key is not configured',
      })
    }

    // Create ChatKit session via OpenAI API
    const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'chatkit_beta=v1',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        workflow: { id: workflowId },
        user: userId || 'anonymous',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API error:', errorData)
      return res.status(response.status).json({
        error: 'OpenAI API Error',
        message: errorData.error?.message || 'Failed to create ChatKit session',
      })
    }

    const data = await response.json()

    return res.status(200).json({
      client_secret: data.client_secret,
      session_id: data.id,
    })
  } catch (error) {
    console.error('ChatKit session creation error:', error)
    return res.status(500).json({
      error: 'Internal Server Error',
      message:
        error instanceof Error
          ? error.message
          : 'Failed to create ChatKit session',
    })
  }
}
