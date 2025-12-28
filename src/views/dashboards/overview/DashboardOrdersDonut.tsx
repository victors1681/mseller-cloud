// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Types
import { OrdersByStatus } from 'src/types/apps/dashboardTypes'

interface Props {
  data: OrdersByStatus
}

const DashboardOrdersDonut = ({ data }: Props) => {
  const theme = useTheme()

  // Ensure data exists with default values
  const validData = data || {
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
  }

  const options: ApexOptions = {
    chart: {
      fontFamily: theme.typography.fontFamily,
    },
    labels: ['Pendientes', 'En Proceso', 'Completadas', 'Canceladas'],
    colors: [
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.error.main,
    ],
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper],
    },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '14px',
      fontFamily: theme.typography.fontFamily,
      labels: {
        colors: theme.palette.text.primary,
      },
      markers: {
        width: 10,
        height: 10,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              fontSize: '16px',
              color: theme.palette.text.secondary,
            },
            value: {
              fontSize: '24px',
              fontWeight: 600,
              color: theme.palette.text.primary,
              formatter: (val: string) => val,
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              color: theme.palette.text.secondary,
              formatter: () => {
                const total =
                  (validData.pending || 0) +
                  (validData.processing || 0) +
                  (validData.completed || 0) +
                  (validData.cancelled || 0)
                return total.toString()
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  }

  const series = [
    validData.pending || 0,
    validData.processing || 0,
    validData.completed || 0,
    validData.cancelled || 0,
  ]

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Órdenes por Estado"
        sx={{
          '& .MuiCardHeader-title': {
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          },
        }}
      />
      <CardContent>
        <ReactApexcharts
          type="donut"
          height={350}
          options={options}
          series={series}
        />
      </CardContent>
    </Card>
  )
}

export default DashboardOrdersDonut
