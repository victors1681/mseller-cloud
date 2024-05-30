// ** React Imports
import { useState, useEffect, forwardRef, useCallback } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'

import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridRowParams } from '@mui/x-data-grid'
import {
  columns,
  orderStatusLabels,
} from 'src/views/apps/documents/list/tableColRows'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, changeDocumentStatus } from 'src/store/apps/documents'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'

import { DocumentStatus, StatusParam } from 'src/types/apps/documentTypes'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/documents/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import { debounce } from '@mui/material'
import { SellerAutocomplete } from 'src/views/ui/sellerAutoComplete'
import { LocationAutocomplete } from 'src/views/ui/locationAutoComplete'
import { PaymentTypeAutocomplete } from 'src/views/ui/paymentTypeAutoComplete'

import { useRouter } from 'next/router'

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

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

const InvoiceList = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [actionValue, setActionValue] = useState<string>('-1')
  const [statusValue, setStatusValue] = useState<string>('0')
  const [documentTypeValue, setDocumentTypeValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [startDateRange, setStartDateRange] = useState<any>(null)
  const [selectedSellers, setSelectedSellers] = useState<string | undefined>(
    undefined,
  )
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    undefined,
  )
  const [selectedPaymentType, setSelectedPaymentType] = useState<any>(null)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.documents)
  const router = useRouter()

  const orderStatusParam = router?.query?.status
  const documentTypeParam = router?.query?.documentType
  const startDateParam = router?.query?.startDate
  const endDateParam = router?.query?.endDate
  const sellersParam = router?.query?.sellers
  const PaymentTypeParam = router?.query?.paymentType
  const LocationParam = router?.query?.location
  const { page, pageSize } = router.query

  useEffect(() => {
    setPaginationModel({
      page: page ? Number(page) : 0,
      pageSize: pageSize ? Number(pageSize) : 20,
    })

    if (!orderStatusParam) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, status: '0' },
      })
    } else {
      setStatusValue(orderStatusParam as string)
    }

    if (documentTypeParam) {
      setDocumentTypeValue(documentTypeParam as string)
    }
    if (startDateParam && endDateParam) {
      const startDate = new Date(startDateParam as string)
      const endDate = new Date(endDateParam as string)
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        setStartDateRange(startDate)
        setEndDateRange(endDate)
        setDates([startDate, endDate])
      }
    }
    if (sellersParam) {
      setSelectedSellers(decodeURIComponent(sellersParam as string))
    }
    if (PaymentTypeParam) {
      setSelectedPaymentType(decodeURIComponent(PaymentTypeParam as string))
    }
    if (LocationParam) {
      setSelectedLocation(decodeURIComponent(LocationParam as string))
    }
  }, [
    orderStatusParam,
    documentTypeParam,
    startDateParam,
    endDateParam,
    sellersParam,
    PaymentTypeParam,
    LocationParam,
  ])

  useEffect(() => {
    dispatch(
      fetchData({
        dates,
        query: value,
        procesado: statusValue,
        pageNumber: paginationModel.page,
        vendedores: selectedSellers,
        localidad: selectedLocation,
        condicionPago: selectedPaymentType,
        tipoDocumento: documentTypeValue,
      }),
    )
  }, [
    dispatch,
    statusValue,
    dates,
    selectedSellers,
    selectedPaymentType,
    selectedLocation,
    documentTypeValue,
  ])

  const performRequest = useCallback(
    (value: string) => {
      dispatch(
        fetchData({
          dates,
          query: value,
          procesado: statusValue,
          pageNumber: paginationModel.page,
          vendedores: selectedSellers,
          localidad: selectedLocation,
          condicionPago: selectedPaymentType,
          tipoDocumento: documentTypeValue,
        }),
      )
    },
    [
      dispatch,
      statusValue,
      value,
      dates,
      selectedSellers,
      selectedPaymentType,
      selectedLocation,
      paginationModel,
    ],
  )

  const fn = useCallback(
    debounce((val: string) => {
      setPaginationModel({ page: 1, pageSize: 20 })
      performRequest(val)
    }, 900),
    [],
  )

  const handlePagination = useCallback(
    (values: any) => {
      setPaginationModel(values)
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          page: values.page,
          pageSize: values.pageSize,
        },
      })
      dispatch(
        fetchData({
          dates,
          query: value,
          procesado: statusValue,
          pageNumber: values.page,
          vendedores: selectedSellers,
          localidad: selectedLocation,
          condicionPago: selectedPaymentType,
          tipoDocumento: documentTypeValue,
        }),
      )
    },
    [
      paginationModel,
      value,
      statusValue,
      selectedLocation,
      selectedPaymentType,
      documentTypeValue,
    ],
  )

  const handleFilter = useCallback(
    (val: string) => {
      fn.clear()
      setValue(val)
      fn(val)
    },
    [fn],
  )

  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
    router.push({
      pathname: `/apps/documents/list`,
      query: {
        ...router.query,
        page: 0,
        status: e.target.value,
      },
    })
  }

  const handleSellerValue = (sellers: string) => {
    setSelectedSellers(sellers)
    router.push({
      pathname: `/apps/documents/list`,
      query: {
        ...router.query,
        page: 0,
        sellers: sellers,
      },
    })
  }

  const handlePaymentTypeValue = (paymentType: string) => {
    setSelectedPaymentType(paymentType)
    router.push({
      pathname: `/apps/documents/list`,
      query: {
        ...router.query,
        page: 0,
        paymentType: paymentType,
      },
    })
  }

  const handleLocationValue = (location: string) => {
    setSelectedLocation(location)
    router.push({
      pathname: `/apps/documents/list`,
      query: {
        ...router.query,
        page: 0,
        location: location,
      },
    })
  }

  const handleDocumentTypeValue = (e: SelectChangeEvent) => {
    setDocumentTypeValue(e.target.value)
    router.push({
      pathname: `/apps/documents/list`,
      query: {
        ...router.query,
        page: 0,
        documentType: e.target.value,
      },
    })
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
    router.push({
      pathname: `/apps/documents/list`,
      query: {
        ...router.query,
        page: 0,
        startDate: start ? start.toISOString() : '',
        endDate: end ? end.toISOString() : '',
      },
    })
  }

  const handleSelectionAction = async (event: SelectChangeEvent<string>) => {
    setActionValue(event.target.value)

    const label = event.target.value === '9' ? 'aprobar' : 'retener'
    const template = `Seguro que deseas ${label} ${selectedRows.length} documentos`
    const result = window.confirm(template)

    if (result) {
      const payload = []
      for (let row of selectedRows) {
        const params: StatusParam = {
          noPedidoStr: row,
          status: parseInt(event.target.value) as any,
        }
        payload.push(params)
      }
      await dispatch(changeDocumentStatus(payload))
    }
    setActionValue('-1')
  }

  //Params for paymentTypes
  const selectedPaymentTypeParams = Array.isArray(PaymentTypeParam)
    ? PaymentTypeParam.map((param) => decodeURIComponent(param)).join(', ')
    : decodeURIComponent(PaymentTypeParam ?? '')

  const selectedSellersParams = Array.isArray(sellersParam)
    ? sellersParam.map((param) => decodeURIComponent(param)).join(', ')
    : decodeURIComponent(sellersParam ?? '')

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Pedidos" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="order-status-select">
                      Estado de la orden
                    </InputLabel>

                    <Select
                      fullWidth
                      value={statusValue}
                      sx={{ mr: 4, mb: 2 }}
                      label="Estado de la orden"
                      onChange={handleStatusValue}
                      labelId="order-status-select"
                    >
                      <MenuItem value="">none</MenuItem>
                      {Object.keys(orderStatusLabels).map((k, index) => {
                        return (
                          <MenuItem value={k} key={`${k}-${index}`}>
                            {orderStatusLabels[k]}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <PaymentTypeAutocomplete
                    selectedPaymentType={selectedPaymentTypeParams}
                    multiple
                    callBack={handlePaymentTypeValue}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <LocationAutocomplete
                    selectedLocation={
                      Array.isArray(LocationParam)
                        ? LocationParam.map((param) =>
                            decodeURIComponent(param),
                          ).join(', ')
                        : decodeURIComponent(LocationParam ?? '')
                    }
                    multiple
                    callBack={handleLocationValue}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="documentType-status-select">
                      Tipo Documento
                    </InputLabel>

                    <Select
                      fullWidth
                      value={documentTypeValue}
                      sx={{ mr: 4, mb: 2 }}
                      label="Tipo Documento"
                      onChange={handleDocumentTypeValue}
                      labelId="documentType-status-select"
                    >
                      <MenuItem value="">none</MenuItem>
                      <MenuItem value="order">Pedido</MenuItem>
                      <MenuItem value="invoice">Cotización</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={4}>
                  <SellerAutocomplete
                    selectedSellers={selectedSellersParams}
                    multiple
                    callBack={handleSellerValue}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id="date-range-picker-months"
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label="Fecha"
                        end={endDateRange as number | Date}
                        start={startDateRange as number | Date}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              actionValue={actionValue}
              searchValue={value}
              selectedRows={selectedRows}
              handleFilter={handleFilter}
              handleAction={handleSelectionAction}
              placeholder="Cliente, NoPedido"
            />
            <DataGrid
              autoHeight
              pagination
              checkboxSelection
              isRowSelectable={(params: GridRowParams) =>
                params.row.procesado === DocumentStatus.Pending
              }
              rows={store.data}
              columns={columns(dispatch)}
              disableRowSelectionOnClick
              paginationModel={paginationModel}
              onPaginationModelChange={handlePagination}
              onRowSelectionModelChange={(rows) =>
                setSelectedRows(rows as string[])
              }
              getRowId={(row) => row.noPedidoStr}
              paginationMode="server"
              loading={store.isLoading}
              rowCount={store.totalResults} //
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default InvoiceList
