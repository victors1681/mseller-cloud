// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Redux
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  fetchConversations,
  fetchUnassignedContacts,
  selectConversation,
} from 'src/store/apps/communication'

// ** SignalR Service
import signalRService from 'src/services/signalRService'

// ** Custom Components
import ChatContent from 'src/views/apps/communication/ChatContent'
import SidebarLeft from 'src/views/apps/communication/SidebarLeft'

// ** Types
import { ConversationList } from 'src/types/apps/communicationTypes'

const CommunicationApp = () => {
  // ** State
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))

  // ** Redux
  const store = useAppSelector((state) => state.communication)

  useEffect(() => {
    // Initialize SignalR connection with auth token from localStorage
    const token = window.localStorage.getItem('accessToken')
    if (token) {
      signalRService.initialize(token, dispatch)
    }

    // Fetch initial data
    dispatch(fetchConversations({}))
    dispatch(fetchUnassignedContacts())

    return () => {
      // Cleanup: disconnect SignalR (using public disconnect method)
      signalRService.disconnect()
    }
  }, [dispatch])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  const handleSelectConversation = async (conversation: ConversationList) => {
    // Update selected conversation in store using conversationId
    await dispatch(selectConversation(conversation.conversationId))

    // Close sidebar on mobile
    if (hidden) {
      handleLeftSidebarToggle()
    }
  }

  return (
    <Box
      className="app-chat"
      sx={{
        width: '100%',
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'background.paper',
        boxShadow: theme.shadows[6],
        ...(mdAbove
          ? { height: 'calc(100vh - 13rem)' }
          : { height: 'calc(100vh - 10rem)' }),
      }}
    >
      <SidebarLeft
        store={store}
        hidden={hidden}
        mdAbove={mdAbove}
        leftSidebarOpen={leftSidebarOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        onSelectConversation={handleSelectConversation}
      />
      <ChatContent hidden={hidden} mdAbove={mdAbove} />
    </Box>
  )
}

export default CommunicationApp
