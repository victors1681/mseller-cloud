// ** Next Import
import { useRouter } from 'next/router'

// ** React Imports
import { ReactNode, useEffect, useRef, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Redux Imports
import PermissionGuard from '@/views/ui/permissionGuard'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { toggleCreateDocument } from 'src/store/apps/documents'
import {
  TipoDocumentoEnum,
  tipoDocumentoSpanishNames,
} from 'src/types/apps/documentTypes'

interface TableHeaderProps {
  searchValue: string
  actionValue: string
  selectedRows: string[]
  handleFilter: (val: string) => void
  handleAction: (event: SelectChangeEvent<string>, child: ReactNode) => void
  placeholder: string
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { searchValue, actionValue, selectedRows, handleFilter, handleAction } =
    props

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  // ** Split Button State
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(1)
  const anchorRef = useRef<HTMLDivElement>(null)

  // ** Document type options
  const documentTypes = [
    {
      type: TipoDocumentoEnum.ORDER,
      label: tipoDocumentoSpanishNames[TipoDocumentoEnum.ORDER],
    },
    {
      type: TipoDocumentoEnum.INVOICE,
      label: tipoDocumentoSpanishNames[TipoDocumentoEnum.INVOICE],
    },
    {
      type: TipoDocumentoEnum.QUOTE,
      label: tipoDocumentoSpanishNames[TipoDocumentoEnum.QUOTE],
    },
  ]

  // ** Auto-select document type based on current route
  useEffect(() => {
    const currentPath = router.pathname

    if (currentPath.includes('/pedidos')) {
      setSelectedIndex(0) // ORDER
    } else if (currentPath.includes('/facturas')) {
      setSelectedIndex(1) // INVOICE
    } else if (currentPath.includes('/cotizacion')) {
      setSelectedIndex(2) // QUOTE
    }
  }, [router.pathname])

  const handleCreateDocument = (documentType: string) => {
    // Add document type to URL query parameters
    router.push({
      pathname: router.pathname,
      query: { ...router.query, createDocumentType: documentType },
    })
    dispatch(toggleCreateDocument())
  }

  const handleClick = () => {
    handleCreateDocument(documentTypes[selectedIndex].type)
  }

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index)
    setOpen(false)
    handleCreateDocument(documentTypes[index].type)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        flexWrap: 'wrap',
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: { xs: 'center', sm: 'space-between' },
        gap: 2,
      }}
    >
      <Select
        size="small"
        displayEmpty
        defaultValue={actionValue}
        value={actionValue}
        sx={{
          minWidth: { xs: '100%', sm: 200 },
          mb: { xs: 2, sm: 0 },
          minHeight: 44, // Better touch target
        }}
        disabled={selectedRows && selectedRows.length === 0}
        onChange={handleAction}
      >
        <MenuItem value="-1">Acciones</MenuItem>
        <MenuItem value="9">Aprobar</MenuItem>
        <MenuItem value="3">Retener</MenuItem>
        {/* <MenuItem value="delete">Eliminar</MenuItem> */}
      </Select>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        <TextField
          size="small"
          value={searchValue}
          sx={{
            minWidth: { xs: '100%', sm: 250 },
            '& .MuiInputBase-root': {
              minHeight: 44, // Better touch target
            },
          }}
          placeholder={props.placeholder}
          onChange={(e) => handleFilter(e.target.value)}
        />
        <PermissionGuard permission="orders.allowCreate">
          <ButtonGroup
            variant="contained"
            ref={anchorRef}
            size="small"
            sx={{
              width: { xs: '100%', sm: 'auto' },
              '& .MuiButton-root': {
                minHeight: 44, // Better touch target
              },
            }}
          >
            <Button onClick={handleClick} sx={{ flex: { xs: 1, sm: 'none' } }}>
              Crear {documentTypes[selectedIndex].label}
            </Button>
            <Button size="small" onClick={handleToggle} sx={{ px: 1 }}>
              <Icon icon="mdi:chevron-down" />
            </Button>
          </ButtonGroup>
          <Popper
            sx={{
              zIndex: 1,
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {documentTypes.map((option, index) => (
                        <MenuItem
                          key={option.type}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </PermissionGuard>
      </Box>
    </Box>
  )
}

export default TableHeader
