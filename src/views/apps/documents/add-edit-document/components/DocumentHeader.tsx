import React from 'react'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material'

interface DocumentHeaderProps {
  documentData: any
  isCreateMode: boolean
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  documentData,
  isCreateMode,
}) => {
  if (isCreateMode) return null

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title="Documento" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mb: 0.5, display: 'block' }}
                >
                  No. Pedido
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {documentData?.noPedidoStr || '-'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mb: 0.5, display: 'block' }}
                >
                  NCF
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {documentData?.ncf || '-'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mb: 0.5, display: 'block' }}
                >
                  Descripción NCF
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {documentData?.ncfDescripcion || '-'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={2}>
              <Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mb: 0.5, display: 'block' }}
                >
                  Status
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography variant="body1" fontWeight="medium">
                    {documentData?.status || '-'}
                  </Typography>
                  {documentData?.anulado && (
                    <Chip
                      label="ANULADO"
                      color="error"
                      variant="filled"
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            </Grid>

            {documentData?.mensajesError && (
              <Grid item xs={12}>
                <Box>
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mb: 0.5, display: 'block' }}
                  >
                    Mensajes de Error
                  </Typography>
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{
                      p: 2,
                      backgroundColor: 'error.light',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'error.main',
                    }}
                  >
                    {documentData.mensajesError}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}
