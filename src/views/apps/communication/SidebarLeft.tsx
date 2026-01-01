// ** React Imports
import { ChangeEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Alert from '@mui/material/Alert'
import MuiAvatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import {
  ChannelType,
  ConversationList,
  SidebarLeftType,
  UnassignedContactList,
  getChannelIcon,
} from 'src/types/apps/communicationTypes'

// ** Redux
import { useAppDispatch } from 'src/store'
import {
  fetchConversations,
  fetchUnassignedContacts,
} from 'src/store/apps/communication'

// ** Utils

const ScrollWrapper = ({
  children,
  hidden,
}: {
  children: React.ReactNode
  hidden: boolean
}) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>
  } else {
    return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>
  }
}

const SidebarLeft = (props: SidebarLeftType) => {
  // ** Props
  const {
    store,
    hidden,
    mdAbove,
    leftSidebarOpen,
    handleLeftSidebarToggle,
    onSelectConversation,
  } = props

  // ** Hooks
  const dispatch = useAppDispatch()

  // ** State
  const [query, setQuery] = useState<string>('')
  const [filteredConversations, setFilteredConversations] = useState<
    ConversationList[]
  >([])
  const [filteredUnassigned, setFilteredUnassigned] = useState<
    UnassignedContactList[]
  >([])
  const [activeTab, setActiveTab] = useState<number>(0)
  const [channelFilter, setChannelFilter] = useState<ChannelType | null>(null)

  // ** Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 0) {
      // Active conversations tab
      dispatch(fetchConversations({ channelType: channelFilter || undefined }))
    } else {
      // Unassigned contacts tab
      dispatch(fetchUnassignedContacts())
    }
  }, [activeTab, dispatch, channelFilter])

  useEffect(() => {
    if (query) {
      const searchQuery = query.toLowerCase()
      let filteredConvs = store.conversations.filter((conversation) => {
        return (
          conversation.contactName.toLowerCase().includes(searchQuery) ||
          conversation.phoneNumber.includes(searchQuery) ||
          conversation.lastMessage.toLowerCase().includes(searchQuery)
        )
      })

      // Apply channel filter
      if (channelFilter !== null) {
        filteredConvs = filteredConvs.filter(
          (conv) => conv.channelType === channelFilter,
        )
      }

      const filteredUnass = store.unassignedContacts.filter((contact) => {
        return (
          contact.nombreContacto.toLowerCase().includes(searchQuery) ||
          contact.phoneNumber.includes(searchQuery)
        )
      })

      setFilteredConversations(filteredConvs)
      setFilteredUnassigned(filteredUnass)
    } else {
      let filteredConvs = store.conversations

      // Apply channel filter even without search query
      if (channelFilter !== null) {
        filteredConvs = filteredConvs.filter(
          (conv) => conv.channelType === channelFilter,
        )
      }

      setFilteredConversations(filteredConvs)
      setFilteredUnassigned(store.unassignedContacts)
    }
  }, [query, store.conversations, store.unassignedContacts, channelFilter])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleConversationClick = (conversation: ConversationList) => {
    onSelectConversation(conversation)
    if (!mdAbove) {
      handleLeftSidebarToggle()
    }
  }

  const renderConversations = () => {
    if (filteredConversations.length) {
      return (
        <List sx={{ p: 0 }}>
          {filteredConversations.map((conversation: ConversationList) => {
            const lastMessageDate = new Date(conversation.lastMessageAt)
            const now = new Date()
            const isToday =
              lastMessageDate.toDateString() === now.toDateString()
            const lastMessageTime = isToday
              ? lastMessageDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : lastMessageDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })

            return (
              <ListItem
                key={conversation.conversationId}
                disablePadding
                sx={{ '&:not(:last-child)': { mb: 1.5 } }}
              >
                <ListItemButton
                  disableRipple
                  onClick={() => handleConversationClick(conversation)}
                  sx={{
                    px: 3,
                    py: 2.5,
                    width: '100%',
                    borderRadius: 1,
                    alignItems: 'flex-start',
                    ...(store.selectedConversation?.conversationId ===
                      conversation.conversationId && {
                      backgroundColor: (theme) =>
                        `${theme.palette.primary.main} !important`,
                      '& *': { color: 'common.white !important' },
                    }),
                  }}
                >
                  <ListItemAvatar sx={{ m: 0, alignSelf: 'center' }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      badgeContent={
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            color: 'success.main',
                            backgroundColor: 'success.main',
                            boxShadow: (theme) =>
                              `0 0 0 2px ${theme.palette.background.paper}`,
                          }}
                        />
                      }
                    >
                      <MuiAvatar
                        sx={{
                          width: 40,
                          height: 40,
                          fontSize: '1rem',
                        }}
                      >
                        {conversation.contactName.charAt(0).toUpperCase()}
                      </MuiAvatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      my: 0,
                      ml: 3,
                      mr: 1.5,
                      '& .MuiTypography-root': {
                        ...(store.selectedConversation?.conversationId ===
                          conversation.conversationId && {
                          color: 'common.white',
                        }),
                      },
                    }}
                    primary={
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Typography
                          noWrap
                          sx={{
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            flex: 1,
                          }}
                        >
                          {conversation.contactName}
                        </Typography>
                        <Icon
                          icon={getChannelIcon(conversation.channelType)}
                          fontSize={14}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography
                        noWrap
                        variant="body2"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        {conversation.lastMessage}
                      </Typography>
                    }
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Typography
                      sx={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}
                    >
                      {lastMessageTime}
                    </Typography>
                    {conversation.unreadCount > 0 && (
                      <Chip
                        label={conversation.unreadCount}
                        color="primary"
                        sx={{
                          mt: 0.5,
                          height: 18,
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          '& .MuiChip-label': { pt: 0.25, px: 1.655 },
                        }}
                      />
                    )}
                  </Box>
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      )
    } else {
      return (
        <Box
          sx={{
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Icon icon="mdi:message-outline" fontSize={40} />
          <Typography sx={{ mt: 2 }}>No conversations found</Typography>
        </Box>
      )
    }
  }

  const renderUnassignedContacts = () => {
    if (filteredUnassigned.length) {
      return (
        <List sx={{ p: 0 }}>
          {filteredUnassigned.map((contact: UnassignedContactList) => {
            const lastMessageDate = new Date(contact.lastMessageAt)
            const now = new Date()
            const isToday =
              lastMessageDate.toDateString() === now.toDateString()
            const lastMessageTime = isToday
              ? lastMessageDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : lastMessageDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })

            return (
              <ListItem
                key={contact.contactoId}
                disablePadding
                sx={{ '&:not(:last-child)': { mb: 1.5 } }}
              >
                <ListItemButton
                  disableRipple
                  onClick={() => {
                    // TODO: Handle unassigned contact selection - need to assign first
                    console.log('Unassigned contact clicked:', contact)
                  }}
                  sx={{
                    px: 3,
                    py: 2.5,
                    width: '100%',
                    borderRadius: 1,
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemAvatar sx={{ m: 0, alignSelf: 'center' }}>
                    <MuiAvatar
                      sx={{
                        width: 40,
                        height: 40,
                        fontSize: '1rem',
                        backgroundColor: 'warning.main',
                      }}
                    >
                      <Icon icon="mdi:account-question" />
                    </MuiAvatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ my: 0, ml: 3, mr: 1.5 }}
                    primary={
                      <Typography
                        noWrap
                        sx={{ fontWeight: 500, fontSize: '0.875rem' }}
                      >
                        {contact.nombreContacto}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        noWrap
                        variant="body2"
                        sx={{ fontSize: '0.75rem', color: 'text.disabled' }}
                      >
                        {contact.phoneNumber}
                      </Typography>
                    }
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Typography
                      sx={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}
                    >
                      {lastMessageTime}
                    </Typography>
                    <Chip
                      label="New Lead"
                      color="warning"
                      size="small"
                      sx={{
                        mt: 0.5,
                        height: 18,
                        fontSize: '0.65rem',
                        '& .MuiChip-label': { pt: 0.25, px: 1 },
                      }}
                    />
                  </Box>
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      )
    } else {
      return (
        <Box
          sx={{
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Icon icon="mdi:account-check-outline" fontSize={40} />
          <Typography sx={{ mt: 2 }}>No unassigned contacts</Typography>
        </Box>
      )
    }
  }

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        sx={{
          p: 4,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Mensajes
        </Typography>

        {/* Connection Status */}
        {!store.isConnected && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="caption">
              Real-time updates disabled. Please refresh manually.
            </Typography>
          </Alert>
        )}

        <TextField
          fullWidth
          size="small"
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          placeholder="Search conversations..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="mdi:magnify" fontSize={20} />
              </InputAdornment>
            ),
          }}
        />

        {/* Channel Filter */}
        <Box sx={{ mt: 2 }}>
          <ToggleButtonGroup
            value={channelFilter}
            exclusive
            onChange={(event, newChannel) => {
              setChannelFilter(newChannel)
            }}
            fullWidth
            size="small"
          >
            <ToggleButton value={null}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon icon="mdi:message" fontSize={18} />
                <span>Todos</span>
              </Box>
            </ToggleButton>
            <ToggleButton value={ChannelType.WhatsApp}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon icon="mdi:whatsapp" fontSize={18} />
                <span>WhatsApp</span>
              </Box>
            </ToggleButton>
            <ToggleButton value={ChannelType.SMS}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon icon="mdi:message-text" fontSize={18} />
                <span>SMS</span>
              </Box>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>Active</span>
              {store.conversations.length > 0 && (
                <Chip
                  label={store.conversations.length}
                  size="small"
                  color="primary"
                />
              )}
            </Box>
          }
        />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>Unassigned</span>
              {store.unassignedContacts.length > 0 && (
                <Chip
                  label={store.unassignedContacts.length}
                  size="small"
                  color="warning"
                />
              )}
            </Box>
          }
        />
      </Tabs>

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <ScrollWrapper hidden={hidden}>
          <Box sx={{ p: 4 }}>
            {activeTab === 0
              ? renderConversations()
              : renderUnassignedContacts()}
          </Box>
        </ScrollWrapper>
      </Box>
    </Box>
  )

  if (mdAbove) {
    return drawerContent
  } else {
    return (
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          zIndex: 7,
          height: '100%',
          display: 'block',
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
            width: 300,
            position: 'absolute',
            borderTopLeftRadius: (theme) => theme.shape.borderRadius,
            borderBottomLeftRadius: (theme) => theme.shape.borderRadius,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    )
  }
}

export default SidebarLeft
