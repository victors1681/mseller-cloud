// ** React Imports
import { KeyboardEvent, SyntheticEvent, useState } from 'react'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
interface SendMsgFormProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

const Form = styled('form')(({ theme }) => ({
  padding: theme.spacing(4),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}))

const SendMsgForm = ({ onSendMessage, disabled = false }: SendMsgFormProps) => {
  // ** State
  const [message, setMessage] = useState<string>('')

  const handleSendMessage = (e: SyntheticEvent) => {
    e.preventDefault()

    if (message.trim() && !disabled) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  return (
    <Form onSubmit={handleSendMessage}>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Escriba un mensaje..."
        disabled={disabled}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
      <IconButton
        type="submit"
        color="primary"
        disabled={!message.trim() || disabled}
        sx={{
          backgroundColor: 'primary.main',
          color: 'common.white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          '&.Mui-disabled': {
            backgroundColor: 'action.disabledBackground',
            color: 'action.disabled',
          },
        }}
      >
        <Icon icon="mdi:send" />
      </IconButton>
    </Form>
  )
}

export default SendMsgForm
