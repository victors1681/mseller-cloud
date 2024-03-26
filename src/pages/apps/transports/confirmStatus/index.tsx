// ** React Imports
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useState,
} from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import TransportStatusSelect from '../transportStatusSelect'
import { SelectChangeEvent } from '@mui/material'
import { changeTransportStatus } from 'src/store/apps/transports'
import { TransportStatusEnum } from 'src/utils/transportMappings'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'src/store'

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  transportNo: string
}
const ConfirmTransportStatus = ({ open, setOpen, transportNo }: Props) => {
  const [statusValue, setStatusValue] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleClose = () => setOpen(false)

  const dispatch = useDispatch<AppDispatch>()

  const handleConfirm = useCallback(() => {
    setLoading(true)
    dispatch(
      changeTransportStatus({
        transportNo,
        status: statusValue as unknown as TransportStatusEnum,
      }),
    )
      .then(() => {
        setLoading(false)
        handleClose()
      })
      .catch(() => {
        setLoading(false)
      })
  }, [statusValue, loading])

  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
  }

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Transporte Estatus</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3, pb: 5, width: 400 }}>
            Actualizar la el estado del transporte, use esta opción con
            precaución.
          </DialogContentText>
          <TransportStatusSelect
            handleStatusValue={handleStatusValue}
            statusValue={statusValue}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions className="dialog-actions-dense">
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={statusValue === ''}>
            Cambiar Estatus
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default ConfirmTransportStatus
function dispatch() {
  throw new Error('Function not implemented.')
}
