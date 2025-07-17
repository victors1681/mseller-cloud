export interface EditDocumentDialogProps {
  open: boolean
}

export interface NewDetailForm {
  codigoProducto: string
  cantidad: number
  precio: number
  unidad: string
  descripcion: string
  porcientoDescuento: number
  porcientoImpuesto: number
}

export interface SelectedCustomerData {
  nombreCliente?: string
  vendedor?: {
    nombre?: string
    codigo?: string
    email?: string
    status?: string
    localidad?: number
  }
}
