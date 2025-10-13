// ** React Imports
import { useEffect } from 'react'
import type { ReactElement } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Redux Imports
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { setFilters } from 'src/store/apps/cxc'

// ** Layout Imports
import BlankLayoutWithAppBar from 'src/@core/layouts/BlankLayoutWithAppBar'

// ** MUI Imports
import { Box, CircularProgress, Typography } from '@mui/material'

const CxcOverduePage = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Set the overdue filter and redirect to main CXC list
    dispatch(setFilters({ soloVencidas: true }))

    // Redirect to main CXC list
    router.replace('/apps/cxc')
  }, [dispatch, router])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        Redirigiendo a cuentas vencidas...
      </Typography>
    </Box>
  )
}

export default CxcOverduePage
