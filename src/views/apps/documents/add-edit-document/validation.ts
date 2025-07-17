import * as yup from 'yup'
import { TipoDocumentoEnum } from 'src/types/apps/documentTypes'

export const documentFormSchema = yup.object().shape({
  codigoCliente: yup
    .string()
    .max(50, 'El código del cliente no debe exceder 50 caracteres')
    .required('Código del cliente es requerido'),

  codigoVendedor: yup
    .string()
    .max(50, 'El código del vendedor no debe exceder 50 caracteres')
    .required('Código del vendedor es requerido'),

  nota: yup.string().max(500, 'La nota no debe exceder 500 caracteres'),

  condicionPago: yup.string().required('Condición de pago es requerida'),

  tipoPedido: yup
    .string()
    .max(50, 'El tipo de pedido no debe exceder 50 caracteres'),

  fecha: yup.string().required('La fecha es requerida'),

  tipoDocumento: yup
    .string()
    .oneOf(
      Object.values(TipoDocumentoEnum),
      'Debe seleccionar un tipo de documento válido',
    )
    .required('Tipo de documento es requerido'),

  localidadId: yup
    .number()
    .positive('Debe seleccionar una localidad válida')
    .required('La localidad es requerida'),

  confirmado: yup.boolean(),
  nuevoCliente: yup.boolean(),
})

export const detailFormSchema = yup.object().shape({
  codigoProducto: yup.string().required('Código del producto es requerido'),
  cantidad: yup
    .number()
    .min(1, 'La cantidad debe ser mayor a 0')
    .required('La cantidad es requerida'),
  precio: yup
    .number()
    .min(0, 'El precio no puede ser negativo')
    .required('El precio es requerido'),
  porcientoDescuento: yup
    .number()
    .min(0, 'El porcentaje de descuento no puede ser negativo')
    .max(100, 'El porcentaje de descuento no puede ser mayor a 100'),
})
