// ** React Imports
import { ReactElement } from 'react'

// ** Next Imports
import type { NextPage } from 'next'
import type { NextPageContext } from 'next/dist/shared/lib/utils'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

interface ErrorProps {
  statusCode: number
}

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw',
  },
}))

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
  },
  [theme.breakpoints.down('md')]: {
    height: 400,
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(13),
  },
}))

const ErrorPage: NextPage<ErrorProps> = ({ statusCode }) => {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <Box className="content-center">
      <Box
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <BoxWrapper>
          <Typography variant="h1" sx={{ mb: 2.5 }}>
            {statusCode || 'Error'}
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 2.5, fontSize: '1.5rem !important' }}
          >
            {statusCode === 404 ? 'Página no encontrada' : 'Algo salió mal'}
          </Typography>
          <Typography variant="body2">
            {statusCode === 404
              ? 'La página que buscas no existe'
              : 'Ha ocurrido un error. Por favor, intenta de nuevo.'}
          </Typography>
        </BoxWrapper>
        <Img
          height="487"
          alt="error-illustration"
          src="/images/pages/404.png"
        />
        <Button
          onClick={handleGoHome}
          variant="contained"
          sx={{ px: 5.5 }}
          startIcon={<Icon icon="mdi:home" />}
        >
          Volver al inicio
        </Button>
      </Box>
    </Box>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode ?? 500 : 404

  return { statusCode }
}

ErrorPage.getLayout = (page: ReactElement) => <BlankLayout>{page}</BlankLayout>

export default ErrorPage
