// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { ReactNode } from 'react'
import React from 'react'

// ** Redux Imports
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { toggleCreateDocument } from 'src/store/apps/documents'

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

  const handleCreateDocument = () => {
    dispatch(toggleCreateDocument())
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
        <Button
          sx={{ mb: 2 }}
          // disabled
          // component={Link}
          onClick={handleCreateDocument}
          variant="contained"
        >
          Crear Documento
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
