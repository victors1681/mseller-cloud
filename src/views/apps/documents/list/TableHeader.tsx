// ** Next Import
import { useRouter } from 'next/router'

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
import { ReactNode, useRef, useState } from 'react'

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
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Select
        size="small"
        displayEmpty
        defaultValue={actionValue}
        value={actionValue}
        sx={{ mr: 4, mb: 2 }}
        disabled={selectedRows && selectedRows.length === 0}
        onChange={handleAction}
      >
        <MenuItem value="-1">Acciones</MenuItem>
        <MenuItem value="9">Aprobar</MenuItem>
        <MenuItem value="3">Retener</MenuItem>
        {/* <MenuItem value="delete">Eliminar</MenuItem> */}
      </Select>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          value={searchValue}
          sx={{ mr: 4, mb: 2 }}
          placeholder={props.placeholder}
          onChange={(e) => handleFilter(e.target.value)}
        />
        <PermissionGuard permission="orders.allowCreate">
          <ButtonGroup
            variant="contained"
            ref={anchorRef}
            sx={{ mb: 2 }}
            size="small"
          >
            <Button onClick={handleClick}>
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
