// ** React Imports
import { useState, useEffect, forwardRef, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import { Box, debounce, IconButton, Tooltip } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchLegacyOffer,
  toggleAddUpdateLegacyOffer,
} from 'src/store/apps/offers'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import TableHeader from 'src/views/apps/offers/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { LegacyOfferType } from 'src/types/apps/offerType'
import OptionsMenu from 'src/@core/components/option-menu'
import formatDate from '@/utils/formatDate'
import Chip from '@/@core/components/mui/chip'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: LegacyOfferType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

const defaultColumns: GridColDef[] = [
  {
    flex: 0.05,
    field: 'id',
    minWidth: 80,
    headerName: 'Id',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`#`}>{`${row.idOferta}`}</LinkStyled>
    ),
  },
  {
    flex: 0.2,
    minWidth: 130,
    field: 'nombre',
    headerName: 'Nombre',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            noWrap
            variant="body2"
            sx={{ color: 'text.primary', fontWeight: 600 }}
          >
            {row.nombre}
          </Typography>
          <Typography noWrap variant="caption">
            {row.descripcion}
          </Typography>
        </Box>
      </Box>
    ),
  },
  {
    flex: 0.2,
    minWidth: 130,
    field: 'tipoOferta',
    headerName: 'Tipo Oferta',
    renderCell: ({ row }: CellType) => (
      <Typography
        noWrap
        variant="body2"
        sx={{
          color: 'text.primary',
        }}
      >
        {row.tipoOferta === '0'
          ? 'Escaca'
          : row.tipoOferta === '1'
          ? 'Promocion'
          : row.tipoOferta === '2'
          ? 'Mixtas'
          : row.tipoOferta}
      </Typography>
    ),
  },
  {
    flex: 0.2,
    minWidth: 130,
    field: 'fecha',
    headerName: 'Fecha Inicio - Fin',
    renderCell: ({ row }: CellType) => (
      <Box>
        <Typography
          noWrap
          variant="body2"
          sx={{
            color: 'text.primary',
          }}
        >
          {formatDate(row.fechaInicio)}
        </Typography>
        <Typography
          noWrap
          variant="body2"
          sx={{
            color: 'text.primary',
          }}
        >
          {formatDate(row.fechaFin)}
        </Typography>
      </Box>
    ),
  },
  {
    flex: 0.05,
    minWidth: 50,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => (
      <Box>
        <Chip
          label={row.status ? 'Activo' : 'Inactivo'}
          color={row.status ? 'success' : 'default'}
          size="small"
        />
      </Box>
    ),
  },
]

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate =
    props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate =
    props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates
    ? props.setDates([])
    : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return (
    <TextField
      fullWidth
      inputRef={ref}
      {...updatedProps}
      label={props.label || ''}
      value={value}
    />
  )
})
/* eslint-enable */

const LegacyOfferList = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.offers)

  //Initial Load
  useEffect(() => {
    dispatch(
      fetchLegacyOffer({
        query: value,
        pageNumber: paginationModel.page,
      }),
    )
  }, [statusValue])

  const handlePagination = useCallback(
    (values: any) => {
      setPaginationModel(values)
      dispatch(
        fetchLegacyOffer({
          query: value,
          pageNumber: values.page,
        }),
      )
    },
    [paginationModel, value, statusValue],
  )

  const performRequest = useCallback(
    (value: string) => {
      dispatch(
        fetchLegacyOffer({
          query: value,
          pageNumber: paginationModel.page,
        }),
      )
    },
    [dispatch, statusValue, value, dates, paginationModel],
  )

  const fn = useCallback(
    debounce((val: string) => {
      setPaginationModel({ page: 1, pageSize: 20 })
      performRequest(val)
    }, 900),
    [],
  )

  const handleFilter = useCallback(
    (val: string) => {
      fn.clear()
      setValue(val)
      fn(val)
    },
    [fn],
  )

  const handleEdit = (row: LegacyOfferType) => {
    dispatch(toggleAddUpdateLegacyOffer(row))
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleEdit(row)}>
              <Icon icon="tabler:edit" fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Legacy Offers"
              action={
                <OptionsMenu
                  options={[
                    {
                      text: 'Importar',
                      icon: <Icon icon="tabler:file-import" fontSize={20} />,
                    },
                    {
                      text: 'Exportar',
                      icon: <Icon icon="clarity:export-line" fontSize={20} />,
                    },
                  ]}
                  iconButtonProps={{
                    size: 'small',
                    sx: { color: 'text.primary' },
                  }}
                />
              }
            />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              value={value}
              selectedRows={selectedRows}
              handleFilter={handleFilter}
              placeholder="Nombre o código"
            />
            <DataGrid
              autoHeight
              pagination
              rows={store.legacyOfferData}
              columns={columns}
              disableRowSelectionOnClick
              paginationModel={paginationModel}
              onPaginationModelChange={handlePagination}
              onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
              getRowId={(row: LegacyOfferType) => row.idOferta}
              paginationMode="server"
              loading={store.isLoading}
              rowCount={store.totalResults}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default LegacyOfferList
