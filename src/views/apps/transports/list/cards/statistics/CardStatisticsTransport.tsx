// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import { Button, Divider, IconButton } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import { AppDispatch } from 'src/store'
import {
  fetchTransportDocsData,
  retryEcfGeneration,
} from 'src/store/apps/transports'
import { DocumentoEntregaResponse } from 'src/types/apps/transportType'
import formatDate from 'src/utils/formatDate'
import {
  transportStatusLabels,
  transportStatusObj,
} from 'src/utils/transportMappings'
import LoadingWrapper from '../../../../../ui/LoadingWrapper'
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
  onRefresh?: () => void
}

const CardStatisticsTransport = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [retryingEcf, setRetryingEcf] = useState(false)

  const handleRetryEcf = async () => {
    if (!props.docsData?.noTransporte) return

    setRetryingEcf(true)
    try {
      await dispatch(retryEcfGeneration(props.docsData.noTransporte)).unwrap()
      // After successful ECF retry, reload the transport docs data
      await dispatch(fetchTransportDocsData(props.docsData.noTransporte))
      props.onRefresh?.() // Also call the parent refresh if available
    } catch (error) {
      // Error handling is done in the thunk with toast notifications
      console.error('ECF Retry Error:', error)
    } finally {
      setRetryingEcf(false)
      setConfirmDialogOpen(false)
    }
  }
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
                        name="mdi:receipt-text-check"
                        icon="mdi:receipt-text-check"
                      />
                    ),
                    text: 'Reasignar eCF Faltantes',
                    menuItemProps: {
                      onClick: () => setConfirmDialogOpen(true),
                      disabled: retryingEcf || props.isLoading,
                    },
                  },
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
                        icon="tabler:report-money"
                      ></Icon>
                    ),
                    text: 'Resumen de Entrega v2',
                    menuItemProps: {
                      onClick: () => {
                        window.open(
                          `/apps/transports/printDeliveryReportAmountV2?noTransporte=${props.docsData?.noTransporte}`,
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
                          `/apps/transports/print?noTransporte=${props.docsData?.noTransporte}`,
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
                      {props.docsData?.distribuidor.codigo} -{' '}
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
              <Grid item xs={6} md={6}>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2">Código Autorización</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h6">
                        {props.docsData?.codigoAutorizacion || 'No Código'}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => props.onRefresh?.()}
                        sx={{ ml: 1 }}
                        title="Refrescar datos"
                      >
                        <Icon icon="mdi:refresh" fontSize="1.25rem" />
                      </IconButton>
                    </Box>
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

      {/* Confirmation Dialog for ECF Retry */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => !retryingEcf && setConfirmDialogOpen(false)}
        aria-labelledby="retry-ecf-dialog-title"
        aria-describedby="retry-ecf-dialog-description"
      >
        <DialogTitle id="retry-ecf-dialog-title">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon icon="mdi:receipt-text-check" />
            Reasignar ECF Faltantes
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="retry-ecf-dialog-description">
            ¿Está seguro que desea reintentar la generación de comprobantes
            fiscales electrónicos (ECF) para todos los documentos faltantes en
            este transporte?
            <br />
            <br />
            <strong>Transporte:</strong> {props.docsData?.noTransporte}
            <br />
            <strong>Distribuidor:</strong> {props.docsData?.distribuidor.codigo}{' '}
            - {props.docsData?.distribuidor.nombre}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            disabled={retryingEcf}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRetryEcf}
            disabled={retryingEcf}
            variant="contained"
            startIcon={
              retryingEcf ? (
                <Icon icon="mdi:loading" className="animate-spin" />
              ) : (
                <Icon icon="mdi:receipt-text-check" />
              )
            }
          >
            {retryingEcf ? 'Procesando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default CardStatisticsTransport
