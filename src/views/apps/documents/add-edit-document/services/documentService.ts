import { AppDispatch } from 'src/store'
import {
  DocumentType,
  DocumentUpdateType,
  TipoDocumentoEnum,
} from 'src/types/apps/documentTypes'
import { addNewDocument, addUpdateDocument } from 'src/store/apps/documents'
import { convertToDocumentUpdate } from 'src/utils/documentUtils'
import { SelectedCustomerData } from '../types'
import toast from 'react-hot-toast'

interface CreateDocumentParams {
  formData: Partial<DocumentType>
  detailsData: any[]
  orderCalculations: any
  selectedCustomerData: SelectedCustomerData | null
  userPhotoURL?: string
}

interface UpdateDocumentParams {
  formData: Partial<DocumentType>
  documentEditData: DocumentType
  detailsData: any[]
  orderCalculations: any
}

export class DocumentService {
  constructor(private dispatch: AppDispatch) {}

  async createDocument({
    formData,
    detailsData,
    orderCalculations,
    selectedCustomerData,
    userPhotoURL,
  }: CreateDocumentParams) {
    const newDocumentUpdate: DocumentUpdateType = {
      noPedidoStr: '', // Server will generate
      nota: formData.nota || '',
      condicionPago: formData.condicionPago || '',
      descuento: orderCalculations.descuentoTotal,
      fecha: formData.fecha
        ? new Date(formData.fecha + 'T00:00:00').toISOString()
        : new Date().toISOString(),
      porcientoDescuento: 0,
      subTotal: orderCalculations.subtotal,
      impuesto: orderCalculations.impuestoTotal,
      total: orderCalculations.total,
      fechaVencimiento: new Date().toISOString(),
      detalle: detailsData.map((detail) => ({
        id: undefined, // Server will generate
        codigoProducto: detail.codigoProducto,
        cantidad: detail.cantidad,
        descripcion: detail.descripcion,
        precio: detail.precio,
        impuesto: detail.impuesto || 0,
        porcientoImpuesto: detail.porcientoImpuesto || 0,
        descuento: detail.descuento || 0,
        porcientoDescuento: detail.porcientoDescuento || 0,
        factor: detail.factor || 1,
        factorOriginal: detail.factorOriginal || 1,
        isc: detail.isc || 0,
        adv: detail.adv || 0,
        subTotal: detail.subTotal,
        productoRef: detail.productoRef || '',
        grupoId: detail.grupoId || '',
        area: detail.area || '',
        unidad: detail.unidad || '',
        tipoImpuesto: detail.tipoImpuesto || '',
        cantidadOriginal: detail.cantidadOriginal || detail.cantidad,
        existencia: 0,
        apartado: 0,
        promocion: detail.promocion || false,
      })),
      tipoDocumento: formData.tipoDocumento || TipoDocumentoEnum.ORDER,
      codigoCliente: formData.codigoCliente || '',
      codigoVendedor: formData.codigoVendedor || '',
      tipoPedido: formData.tipoPedido || '',
      nuevoCliente: formData.nuevoCliente || false,
      nombreCliente: selectedCustomerData?.nombreCliente || '',
      firebaseUserId: '', // will be set by the backend
      localidadId: formData.localidadId || 0,
      noOrden: '',
      avatarUrl: userPhotoURL,
      confirmado: formData.confirmado || false,
    }

    console.log('Creating new document:', newDocumentUpdate)

    try {
      const response = await this.dispatch(
        addNewDocument(newDocumentUpdate),
      ).unwrap()

      if (response.success) {
        return { success: true }
      } else {
        toast.error(response.message || 'Error creando el documento')
        return { success: false, error: response.message }
      }
    } catch (error) {
      console.error('Create error:', error)
      toast.error('Error inesperado al crear el documento')
      return { success: false, error: 'Error inesperado al crear el documento' }
    }
  }

  async updateDocument({
    formData,
    documentEditData,
    detailsData,
    orderCalculations,
  }: UpdateDocumentParams) {
    const documentUpdate: DocumentUpdateType = convertToDocumentUpdate(
      { ...documentEditData, ...formData } as DocumentType,
      detailsData,
      orderCalculations,
    )

    // Convert date back to ISO format if needed
    if (formData.fecha) {
      const dateObj = new Date(formData.fecha + 'T00:00:00')
      documentUpdate.fecha = dateObj.toISOString()
    }

    console.log('Updating existing document:', documentUpdate)

    try {
      const response = await this.dispatch(
        addUpdateDocument(documentUpdate),
      ).unwrap()

      if (response.success) {
        return { success: true }
      } else {
        toast.error(response.message || 'Error actualizando el documento')
        return { success: false, error: response.message }
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Error inesperado al actualizar el documento')
      return {
        success: false,
        error: 'Error inesperado al actualizar el documento',
      }
    }
  }
}
