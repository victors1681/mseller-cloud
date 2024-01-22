// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import {
  DocumentoEntregaType,
  TypoPagoEnum,
} from 'src/types/apps/transportType'
import { TransportStatusEnum } from 'src/utils/transportMappings'
import formatCurrency from 'src/utils/formatCurrency'
import React from 'react'
import LoadingWrapper from '../../../../../ui/LoadingWrapper'
import { CollectionType, PaymentTypeEnum } from 'src/types/apps/collectionType'

interface Props {
  collection: CollectionType
  isLoading: boolean
  isFailed: boolean
}

const getStats = (collection: CollectionType) => {
  const cashArr =
    collection?.recibos?.filter(
      (f) => f.tipoPago === PaymentTypeEnum.Efectivo,
    ) || []
  const cash = cashArr?.reduce((a, c) => (a += c.totalCobro), 0)

  const checkArr =
    collection?.recibos?.filter((f) => f.tipoPago === PaymentTypeEnum.Cheque) ||
    []
  const check = checkArr?.reduce((a, c) => (a += c.totalCobro), 0)

  const transferArr =
    collection?.recibos?.filter(
      (f) => f.tipoPago === PaymentTypeEnum.Transferencia,
    ) || []
  const transfer = transferArr?.reduce((a, c) => (a += c.totalCobro), 0)

  const ckFuturistArr =
    collection?.recibos?.filter((f) => f.ckFuturista === true) || []

  const ckFuturist = ckFuturistArr.reduce((a, c) => (a += c.totalCobro), 0)
  const total = collection?.totalCobrado
  const totalDocs = collection?.recibos?.length
  //const donut = [cash/total * 100, check/total * 100, transfer/total * 100, credit/total * 100]
  //const donut = [cash, check, transfer, credit]
  const donut = [
    cashArr.length,
    checkArr.length,
    ckFuturistArr.length,
    transferArr.length,
  ]
  return {
    total,
    cash,
    check,
    ckFuturist,
    transfer,
    donut,

    totalDocs,
  }
}
const CardWidgetsReceiptOverview = (props: Props) => {
  // ** Hook
  const theme = useTheme()

  const data =
    (!props.isLoading && !props.isFailed && getStats(props.collection)) ||
    ({} as any)

  const options = React.useCallback(
    () =>
      ({
        chart: {
          sparkline: { enabled: true },
        },
        colors: [
          theme.palette.primary.main,
          hexToRGBA(theme.palette.primary.main, 0.7),
          hexToRGBA(theme.palette.primary.main, 0.5),
          theme.palette.customColors.trackBg,
        ],
        stroke: { width: 0 },
        legend: { show: false },
        dataLabels: { enabled: false },
        labels: ['Cheque', 'Efectivo', 'Crédito', 'Transferencia'],
        states: {
          hover: {
            filter: { type: 'none' },
          },
          active: {
            filter: { type: 'none' },
          },
        },
        plotOptions: {
          pie: {
            customScale: 0.9,
            donut: {
              size: '70%',
              labels: {
                show: true,
                name: {
                  offsetY: 25,
                  fontSize: '0.875rem',
                  color: theme.palette.text.secondary,
                },
                value: {
                  offsetY: -15,
                  fontWeight: 500,
                  formatter: (value) => `${value}`,
                  color: theme.palette.text.primary,
                },
                total: {
                  show: true,
                  fontSize: '0.875rem',
                  label: 'Total Cobros',
                  color: theme.palette.text.secondary,
                  formatter: (value) =>
                    `${value.globals.seriesTotals.reduce(
                      (total: number, num: number) => total + num,
                    )}`,
                },
              },
            },
          },
        },
      } as ApexOptions),
    [data],
  )

  return (
    <Card>
      <LoadingWrapper isLoading={props.isLoading}>
        <CardHeader
          title="Cobros"
          titleTypographyProps={{
            sx: {
              lineHeight: '1.5rem !important',
              letterSpacing: '0.15px !important',
            },
          }}
        />
        <CardContent>
          <Grid container sx={{ my: [0, 4, 3] }}>
            <Grid item xs={12} sm={6} sx={{ mb: [3, 0] }}>
              <ReactApexcharts
                type="donut"
                height={200}
                series={data.donut}
                options={options()}
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ my: 'auto' }}>
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                <CustomAvatar
                  skin="light"
                  variant="rounded"
                  sx={{ mr: 3, '& svg': { color: 'primary.main' } }}
                >
                  <Icon icon="mdi:currency-usd" />
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2">Total Cobros</Typography>
                  <Typography variant="h6">
                    {formatCurrency(data.total)}
                  </Typography>
                </Box>
              </Box>
              <Divider
                sx={{ my: (theme) => `${theme.spacing(4)} !important` }}
              />
              <Grid container>
                <Grid item xs={6} sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': {
                        mr: 1.5,
                        fontSize: '0.75rem',
                        color: 'primary.main',
                      },
                    }}
                  >
                    <Icon icon="mdi:circle" />
                    <Typography variant="body2">Efectivo</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    {formatCurrency(data.cash)}
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': {
                        mr: 1.5,
                        fontSize: '0.75rem',
                        color: hexToRGBA(theme.palette.primary.main, 0.7),
                      },
                    }}
                  >
                    <Icon icon="mdi:circle" />
                    <Typography variant="body2">Cheque</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    {formatCurrency(data.check)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': {
                        mr: 1.5,
                        fontSize: '0.75rem',
                        color: hexToRGBA(theme.palette.primary.main, 0.5),
                      },
                    }}
                  >
                    <Icon icon="mdi:circle" />
                    <Typography variant="body2">Transferencia</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    {formatCurrency(data.transfer)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': {
                        mr: 1.5,
                        fontSize: '0.75rem',
                        color: 'customColors.trackBg',
                      },
                    }}
                  >
                    <Icon icon="mdi:circle" />
                    <Typography variant="body2">CK Futurista</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    {formatCurrency(data.ckFuturist)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </LoadingWrapper>
    </Card>
  )
}

export default CardWidgetsReceiptOverview
