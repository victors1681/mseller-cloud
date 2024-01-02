// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import { DialogContent, IconButton, Tooltip } from '@mui/material'

const emails = ['username@gmail.com', 'user02@gmail.com']

interface Props {
  url: string
}
const SignatureModal = ({ url }: Props) => {
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
      <Tooltip title="Firma recepción">
        <IconButton size="small" onClick={handleClickOpen} disabled={!url}>
          <Icon icon="material-symbols:signature" fontSize={20} />
        </IconButton>
      </Tooltip>

      <Dialog
        onClose={handleDialogClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="full-screen-dialog-title">
          <Typography variant="h6" component="span">
            Firma del recibidor
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon="mdi:close" />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <img src={url} height={200} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SignatureModal
