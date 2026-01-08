// ** React Imports

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import { Box, CircularProgress } from '@mui/material'

// ** Custom Components
import ClientDetailView from 'src/views/apps/clients/ClientDetailView'

const ClientDetailPage = () => {
  const router = useRouter()
  const { codigoCliente } = router.query

  if (!codigoCliente || typeof codigoCliente !== 'string') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return <ClientDetailView codigoCliente={codigoCliente} />
}

export default ClientDetailPage
