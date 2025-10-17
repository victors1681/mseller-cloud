import { TipoDocumentoEnum } from 'src/types/apps/documentTypes'
import DocumentsListView from 'src/views/apps/documents/DocumentsListView'

const CotizacionPage = () => {
  return (
    <DocumentsListView
      documentType={TipoDocumentoEnum.QUOTE}
      pageTitle="Cotización"
    />
  )
}

export default CotizacionPage
