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
  collectionStatusLabels,
  collectionStatusObj,
} from 'src/utils/collectionMappings'
import CustomChip from 'src/@core/components/mui/chip'
import Link from 'next/link'
import React from 'react'
import LoadingWrapper from '../../../../../ui/LoadingWrapper'
import { CollectionType } from 'src/types/apps/collectionType'
import formatCurrency from 'src/utils/formatCurrency'
import OptionsMenu from 'src/@core/components/option-menu'
interface DataType {
  icon: string
  stats: string
  title: string
  color: ThemeColor
}

const renderStats = (collection: CollectionType | null) => {
  const data: DataType[] = [
    {
      stats:
        collection?.tipoTransaccion?.toLowerCase() === 'p'
          ? 'Personal'
          : 'Bancaria',
      title: 'Tipo deposito',
      color: 'success',
      icon:
        collection?.tipoTransaccion?.toLowerCase() === 'p'
          ? 'game-icons:receive-money'
          : 'mdi:bank',
    },
    {
      stats: formatCurrency(collection?.totalCobrado || 0),
      title: 'Total Cobrado',
      color: 'info',
      icon: 'vaadin:calc-book',
    },
    {
      stats: formatCurrency(collection?.totalCobrado || 0),
      color: 'warning',
      title: 'Total General',
      icon: 'ep:list',
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
  collection: CollectionType
  isLoading: boolean
}

const CardStatisticsReceipt = (props: Props) => {
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
                href="/apps/collections/list"
              >
                Regresar Depositos
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
                    text: 'Imprimit depósito',
                    menuItemProps: {
                      onClick: () => {
                        window.open(
                          `/apps/collections/print/${props?.collection?.noDepositoStr}/`,
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
                    <Typography variant="body2">No. Deposito</Typography>
                    <Typography variant="h6">
                      {props.collection?.noDepositoStr}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} md={6}>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2">Vendedor</Typography>
                    <Typography variant="h6">
                      {props.collection?.vendedor?.codigo}-
                      {props.collection?.vendedor?.nombre}
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
                        collectionStatusLabels[
                          props.collection?.procesado || 0
                        ] || ''
                      }
                      color={
                        collectionStatusObj[props.collection?.procesado || '']
                      }
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
                      {formatDate(props.collection?.fecha || '')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
                <Divider sx={{ mt: 5, mb: 5 }}></Divider>
              </Grid>
              {renderStats(props.collection)}
            </Grid>
          </CardContent>
        </>
      </LoadingWrapper>
    </Card>
  )
}

export default CardStatisticsReceipt
