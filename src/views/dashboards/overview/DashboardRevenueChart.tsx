// ** React Imports

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
import { RevenueData } from 'src/types/apps/dashboardTypes'

interface Props {
  data: RevenueData[]
}

const DashboardRevenueChart = ({ data }: Props) => {
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: [theme.palette.primary.main, theme.palette.success.main],
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      strokeWidth: 3,
      strokeOpacity: 1,
      strokeColors: [theme.palette.background.paper],
      colors: [theme.palette.primary.main, theme.palette.success.main],
    },
    grid: {
      strokeDashArray: 7,
      borderColor: theme.palette.divider,
      padding: {
        top: -10,
        left: 0,
        right: 0,
        bottom: 5,
      },
    },
    xaxis: {
      categories: data.map((d) => d.month),
      labels: {
        style: {
          fontSize: '14px',
          colors: theme.palette.text.secondary,
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '14px',
          colors: theme.palette.text.secondary,
        },
        formatter: (value) => `$${value.toLocaleString()}`,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '14px',
      fontFamily: theme.typography.fontFamily,
      labels: {
        colors: theme.palette.text.primary,
      },
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
    {
      name: 'Pedidos',
      data: data.map((d) => d.revenue),
    },
    {
      name: 'Cobros',
      data: data.map((d) => d.collections),
    },
  ]

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Pedidos vs Cobros"
        subheader="Tendencia mensual"
        sx={{
          '& .MuiCardHeader-title': {
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          },
        }}
      />
      <CardContent>
        <ReactApexcharts
          type="line"
          height={350}
          options={options}
          series={series}
        />
      </CardContent>
    </Card>
  )
}

export default DashboardRevenueChart
