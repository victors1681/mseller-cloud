import { CollectionEnum } from 'src/types/apps/collectionType'

export const collectionStatusLabels: Record<CollectionEnum | number, string> = {
  [CollectionEnum.pendiente]: 'Pendiente',
  [CollectionEnum.errorIntegracion]: 'Error Integracion',
  [CollectionEnum.listoIntegrar]: 'Listo Integrar',
  [CollectionEnum.enviadoErp]: 'Enviado ERP',
}

export const collectionStatusObj = {
  '0': 'warning',
  '1': 'success',
  '8': 'error',
  '9': 'info',
  '10': 'success',
} as any
