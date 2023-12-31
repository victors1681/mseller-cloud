import { Box, CircularProgress, Typography } from '@mui/material'

interface LoadingProps {
  isLoading: boolean
  children: React.ReactNode
}
export const LoadingWrapper = ({ isLoading, children }: LoadingProps) => {
  return isLoading ? (
    <Box
      sx={{
        mt: 11,
        mb: 11,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <CircularProgress sx={{ mb: 4 }} />
      <Typography variant="caption">Cargando...</Typography>
    </Box>
  ) : (
    <>{children}</>
  )
}

export default LoadingWrapper
