// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useGoBack } from 'src/hooks/useGoBack'

interface Props {
  id: string | undefined
  toggleAddPaymentDrawer: () => void
  toggleSendInvoiceDrawer: () => void
}

const PreviewActions = ({
  id,
  toggleSendInvoiceDrawer,
  toggleAddPaymentDrawer,
}: Props) => {
  const navigation = useGoBack('/apps/documents/list', true)

  return (
    <Card>
      <CardContent>
        <Button
          fullWidth
          sx={{ mb: 3.5 }}
          color="secondary"
          variant="outlined"
          onClick={navigation.goBack}
        >
          Cerrar
        </Button>
        <Button
          fullWidth
          target="_blank"
          sx={{ mb: 3.5 }}
          component={Link}
          color="secondary"
          variant="outlined"
          href={`/apps/documents/print/${id}`}
        >
          Imprimir
        </Button>
        <Button
          fullWidth
          sx={{ mb: 3.5 }}
          component={Link}
          color="secondary"
          variant="outlined"
          href={`#`}
        >
          Editar
        </Button>
        <Button
          fullWidth
          color="success"
          variant="contained"
          sx={{ mb: 3.5 }}
          onClick={toggleAddPaymentDrawer}
          startIcon={<Icon icon="material-symbols:order-approve-rounded" />}
        >
          Aprobar
        </Button>
        <Button
          fullWidth
          color="warning"
          sx={{ mb: 3.5 }}
          variant="contained"
          onClick={toggleSendInvoiceDrawer}
          startIcon={<Icon icon="ph:x-fill" />}
        >
          Retener
        </Button>
      </CardContent>
    </Card>
  )
}

export default PreviewActions
