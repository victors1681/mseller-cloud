import { TipoDocumentoEnum } from 'src/types/apps/documentTypes'
import DocumentsListView from 'src/views/apps/documents/DocumentsListView'

const FacturasPage = () => {
  return (
    <DocumentsListView
      documentType={TipoDocumentoEnum.INVOICE}
      pageTitle="Facturas"
    />
  )
}

export default FacturasPage
