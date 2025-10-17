import { TipoDocumentoEnum } from 'src/types/apps/documentTypes'
import DocumentsListView from 'src/views/apps/documents/DocumentsListView'

const PedidosPage = () => {
  return (
    <DocumentsListView
      documentType={TipoDocumentoEnum.ORDER}
      pageTitle="Pedidos"
    />
  )
}

export default PedidosPage
