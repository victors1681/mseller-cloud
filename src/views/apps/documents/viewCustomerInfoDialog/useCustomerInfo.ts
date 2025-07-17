import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchCustomer } from 'src/store/apps/clients'
import { fetchInvoice } from 'src/store/apps/invoices'
import { InvoiceType } from 'src/types/apps/invoicesTypes'

interface UseCustomerInfoProps {
  open: boolean
  codigoCliente: string
}

export const useCustomerInfo = ({
  open,
  codigoCliente,
}: UseCustomerInfoProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const clientStore = useSelector((state: RootState) => state.clients)
  const invoiceStore = useSelector((state: RootState) => state.invoices)

  const [totalAmountDue, setTotalAmountDue] = useState(0)
  const [totalAmountDueToday, setTotalAmountDueToday] = useState(0)
  const [overdue, setOverdue] = useState<InvoiceType[]>([])

  // Fetch customer data when dialog opens
  useEffect(() => {
    if (open && codigoCliente) {
      dispatch(fetchCustomer(codigoCliente))
      dispatch(
        fetchInvoice({
          query: '',
          pageNumber: 0,
          cliente: codigoCliente,
        }),
      )
    }
  }, [open, codigoCliente, dispatch])

  // Calculate totals when invoices change
  useEffect(() => {
    if (invoiceStore.data) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      let totalDue = 0
      let totalDueToday = 0
      const overdueInvoices: InvoiceType[] = []

      invoiceStore.data.forEach((invoice: InvoiceType) => {
        const dueDate = new Date(invoice.fecha_vencimiento)
        dueDate.setHours(0, 0, 0, 0)

        totalDue += invoice.saldo_restante || 0

        if (dueDate.getTime() === today.getTime()) {
          totalDueToday += invoice.saldo_restante || 0
        }

        if (dueDate < today && invoice.saldo_restante > 0) {
          overdueInvoices.push(invoice)
        }
      })

      setTotalAmountDue(totalDue)
      setTotalAmountDueToday(totalDueToday)
      setOverdue(overdueInvoices)
    }
  }, [invoiceStore.data])

  const customer = clientStore.customerDetail?.client

  return {
    customer,
    clientStore,
    invoiceStore,
    totalAmountDue,
    totalAmountDueToday,
    overdue,
  }
}
