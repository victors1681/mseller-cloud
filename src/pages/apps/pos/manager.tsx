// ** React Imports
import { ReactElement } from 'react'

// ** Next.js Imports
import { NextPage } from 'next'

// ** MUI Imports
import { Box, Typography, Breadcrumbs, Link } from '@mui/material'

// ** Layout Import
import UserLayout from 'src/layouts/UserLayout'

// ** Components
import SimplePOSManager from 'src/views/apps/pos/SimplePOSManager'
import AbrirTurnoModal from 'src/views/apps/pos/AbrirTurnoModal'
import CerrarTurnoModal from 'src/views/apps/pos/CerrarTurnoModal'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Next.js Router
import { useRouter } from 'next/router'

// ** Types
import { ReactNode } from 'react'

const POSManagerPage: NextPage = () => {
  const router = useRouter()

  const handleBreadcrumbClick = (path: string) => {
    router.push(path)
  }

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          <Icon icon="mdi:cash-register" style={{ marginRight: 8 }} />
          Gestión de Turnos POS
        </Typography>

        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ color: 'text.secondary' }}
          separator={<Icon icon="mdi:chevron-right" />}
        >
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handleBreadcrumbClick('/home')
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            <Icon icon="mdi:home" style={{ marginRight: 4 }} />
            Inicio
          </Link>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handleBreadcrumbClick('/apps/pos')
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            <Icon icon="mdi:point-of-sale" style={{ marginRight: 4 }} />
            POS
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Icon icon="mdi:cash-register" style={{ marginRight: 4 }} />
            Gestión de Turnos
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Page Description */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Administra los turnos del punto de venta, incluyendo apertura, cierre,
          movimientos de efectivo y aprobaciones.
        </Typography>
      </Box>

      {/* Main Content */}
      <SimplePOSManager />

      {/* POS Modals */}
      <AbrirTurnoModal allowToClose={true} />
      <CerrarTurnoModal />
    </Box>
  )
}

POSManagerPage.getLayout = (page: ReactElement) => (
  <UserLayout>{page}</UserLayout>
)

export default POSManagerPage
