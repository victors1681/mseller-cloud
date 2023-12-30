// ** React Imports
import { useState } from 'react'

// ** MUI Imports 
import Dialog from '@mui/material/Dialog' 
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle' 
// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { DialogContent, IconButton, Tooltip } from '@mui/material'
import { Map } from 'src/views/ui/map'
import { DocumentoEntregaType } from 'src/types/apps/transportType'
import { TransportStatusEnum } from 'src/pages/apps/transports/utils/transportMappings'

const emails = ['username@gmail.com', 'user02@gmail.com']

interface Props {
    data: DocumentoEntregaType[]
}
const MapModal = ({data} : Props) => {
  // ** States
  const [open, setOpen] = useState<boolean>(false)
  const [selectedValue, setSelectedValue] = useState<string>(emails[1])

  const handleClickOpen = () => setOpen(true)

  const handleDialogClose = () => setOpen(false)

  const handleClose = (value: any) => {
    setOpen(false)
    setSelectedValue(value)
  }

  return (
    <div>
      <Tooltip title='Geolocalización'>
            <IconButton size='small'  onClick={handleClickOpen} disabled={data?.[0]?.status !== TransportStatusEnum.Entregado}>
              <Icon icon='carbon:map' fontSize={20} />
            </IconButton>
          </Tooltip>
          
      <Dialog onClose={handleDialogClose} aria-labelledby='simple-dialog-title' open={open}>
      <DialogTitle id='full-screen-dialog-title'>
          <Typography variant='h6' component='span'>
            Geolocalización
          </Typography>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          
          <Map orderDetails={data} />

        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MapModal
