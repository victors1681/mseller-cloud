// ** React Imports
import { useEffect, useRef } from 'react'

// ** Third Party Imports
import QRCode from 'qrcode'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface QRCodeComponentProps {
  url: string
  size?: number
  printSize?: number
  securityCode?: string
  signedDate?: string
}

const QRCodeComponent = ({
  url,
  size = 120,
  printSize = 100,
  securityCode,
  signedDate,
}: QRCodeComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: size,
          margin: 2,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error)
        },
      )
    }
  }, [url, size])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 1,
      }}
    >
      {/* QR Code */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '@media print': {
            '& canvas': {
              width: `${printSize}px !important`,
              height: `${printSize}px !important`,
            },
          },
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: size,
            height: size,
            border: '1px solid #ddd',
            borderRadius: 4,
          }}
        />
      </Box>

      {/* Security Code and Signed Date */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {securityCode && (
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: '0.75rem', print: '0.40rem' },
            }}
          >
            Código Seguridad: {securityCode}
          </Typography>
        )}
        {signedDate && (
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: '0.75rem', print: '0.40rem' },
            }}
          >
            Fecha Firma: {signedDate}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default QRCodeComponent
