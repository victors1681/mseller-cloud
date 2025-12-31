import httpProxy from 'http-proxy'
import type { NextApiRequest, NextApiResponse } from 'next/types'

// Disable body parsing for WebSocket proxy
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

const proxy = httpProxy.createProxyServer()

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('SignalR Proxy error:', err)
  if (!res.headersSent) {
    ;(res as any).writeHead(500, { 'Content-Type': 'application/json' })
  }
  ;(res as any).end(
    JSON.stringify({ error: 'Proxy error', message: err.message }),
  )
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Get target URL using same logic as [...path].ts
    let targetUrl = req.headers['x-url'] as string

    if (process.env.NODE_ENV === 'production') {
      targetUrl = req.headers['x-url'] as string
    }

    if (process.env.NODE_ENV === 'development') {
      if (process.env.TARGET && process.env.TARGET !== '') {
        targetUrl = process.env.TARGET
      } else {
        targetUrl = req.headers['x-url'] as string
      }
    }

    if (!targetUrl) {
      return res.status(400).json({ error: 'Target URL not configured' })
    }

    // Manually rewrite the path - remove /api prefix
    if (req.url) {
      req.url = req.url.replace(/^\/api/, '')
    }

    // Forward to backend SignalR hub
    const target = targetUrl

    // Handle WebSocket upgrade separately
    if (req.headers.upgrade === 'websocket') {
      // For WebSocket, we need to handle the upgrade event
      const socket = (req as any).socket
      const head = (req as any).head

      proxy.ws(
        req as any,
        socket,
        head,
        {
          target,
          changeOrigin: true,
          headers: {
            Authorization: req.headers.authorization || '',
          },
        },
        (err) => {
          if (err) {
            console.error('WebSocket proxy error:', err)
          }
        },
      )
    } else {
      // Handle regular HTTP request (negotiation)

      proxy.web(
        req,
        res as any,
        {
          target,
          changeOrigin: true,
          headers: {
            Authorization: req.headers.authorization || '',
          },
        },
        (err) => {
          if (err) {
            console.error('HTTP proxy error:', err)
          }
        },
      )
    }
  } catch (error: any) {
    console.error('SignalR proxy handler error:', error)
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message })
    }
  }
}

export default handler
