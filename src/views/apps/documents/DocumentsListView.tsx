// ** React Imports
import InvoiceList from 'src/pages/apps/documents/list'
import { TipoDocumentoEnum } from 'src/types/apps/documentTypes'

interface DocumentsListViewProps {
  documentType: TipoDocumentoEnum
  pageTitle: string
}

const DocumentsListView = ({
  documentType,
  pageTitle,
}: DocumentsListViewProps) => {
  return <InvoiceList documentType={documentType} pageTitle={pageTitle} />
}

export default DocumentsListView
