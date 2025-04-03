// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Button, Divider } from '@mui/material'

import { DocumentoEntregaResponse } from 'src/types/apps/transportType'
import formatDate from 'src/utils/formatDate'
import {
  transportStatusLabels,
  transportStatusObj,
} from 'src/utils/transportMappings'
import CustomChip from 'src/@core/components/mui/chip'
import Link from 'next/link'
import React from 'react'
import LoadingWrapper from '../../../../../ui/LoadingWrapper'
import OptionsMenu from 'src/@core/components/option-menu'
interface DataType {
  icon: string
  stats: string
  title: string
  color: ThemeColor
}

const renderStats = (docsData: DocumentoEntregaResponse | null) => {
  const data: DataType[] = [
    {
      stats: docsData?.entregadas?.toString() || '',
      title: 'Entregadas',
      color: 'success',
      icon: 'tabler:truck-delivery',
    },
    {
      stats: docsData?.entregarDespues?.toString() || '',
      title: 'Entregar Después',
      color: 'info',
      icon: 'quill:send-later',
    },
    {
      stats: docsData?.noEntregadas?.toString() || '',
      color: 'warning',
      title: 'No Entregadas',
      icon: 'dashicons:no',
    },
  ]

  return data.map((sale: DataType, index: number) => (
    <Grid item xs={6} md={4} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar
          variant="rounded"
          color={sale.color}
          sx={{ mr: 3, boxShadow: 3 }}
        >
          <Icon icon={sale.icon} fontSize="1.75rem" />
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption">{sale.title}</Typography>
          <Typography variant="h6">{sale.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

interface Props {
  docsData: DocumentoEntregaResponse | null
  isLoading: boolean
}

const CardStatisticsTransport = (props: Props) => {
  return (
    <Card>
      <LoadingWrapper isLoading={props.isLoading}>
        <>
          <CardHeader
            title={
              <Button
                sx={{ mb: 2 }}
                component={Link}
                startIcon={<Icon icon="ep:back" />}
                variant="text"
                href="/apps/transports/list"
              >
                Regresar Transporte
              </Button>
            }
            titleTypographyProps={{
              sx: {
                lineHeight: '2rem !important',
                letterSpacing: '0.15px !important',
              },
            }}
            action={
              <OptionsMenu
                options={[
                  {
                    icon: (
                      <Icon
                        name="material-symbols:print"
                        icon="tabler:report-money"
                      ></Icon>
                    ),
                    text: 'Resumen de Entrega',
                    menuItemProps: {
                      onClick: () => {
                        window.open(
                          `/apps/transports/printDeliveryReportAmount/${props.docsData?.noTransporte}/`,
                          '_blank',
                        )
                      },
                    },
                  },
                  {
                    icon: (
                      <Icon
                        name="material-symbols:print"
                        icon="material-symbols:print"
                      ></Icon>
                    ),
                    text: 'Entrega Productos',
                    menuItemProps: {
                      onClick: () => {
                        window.open(
                          `/apps/transports/print?noTransporte=${props.docsData?.noTransporte}/`,
                          '_blank',
                        )
                      },
                    },
                  },
                  {
                    icon: (
                      <Icon
                        name="material-symbols:print"
                        icon="material-symbols:print"
                      ></Icon>
                    ),
                    text: 'Entrega Promociones',
                    menuItemProps: {
                      onClick: () => {
                        window.open(
                          `/apps/transports/print?noTransporte=${props.docsData?.noTransporte}&promocionesOnly=true`,
                          '_blank',
                        )
                      },
                    },
                  },
                ]}
                iconButtonProps={{
                  size: 'small',
                  sx: { color: 'text.secondary' },
                }}
              />
            }
          />
          <CardContent>
            <Grid container>
              <Grid item xs={6} md={6}>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2">No. Transporte</Typography>
                    <Typography variant="h6">
                      {props.docsData?.noTransporte}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} md={6}>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2">Distribuidor</Typography>
                    <Typography variant="h6">
                      {props.docsData?.distribuidor.nombre}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} md={6}>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2">Status</Typography>

                    <CustomChip
                      skin="light"
                      size="small"
                      label={
                        transportStatusLabels[props.docsData?.status || 0] || ''
                      }
                      color={transportStatusObj[props.docsData?.status || '']}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} md={6}>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2">Fecha</Typography>
                    <Typography variant="h6">
                      {formatDate(props.docsData?.fecha || '')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
                <Divider sx={{ mt: 5, mb: 5 }}></Divider>
              </Grid>
              {renderStats(props.docsData)}
            </Grid>
          </CardContent>
        </>
      </LoadingWrapper>
    </Card>
  )
}

export default CardStatisticsTransport
