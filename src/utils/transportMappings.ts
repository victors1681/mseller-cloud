export enum TransportStatusEnum {
  Pendiente = 1,
  Sincronizado = 2,
  Recibido = 3,
  Procesado = 4,
  Integrado = 5,
  Cancelado = 6,
  Error = 7,
  Entregado = 8,
  NoEntregado = 9,
  EntDespues = 10,
  Integrado2 = 11,
  Elaborando = 12,
  ERP = 13,
  Parcial = 14,
  ecf_procesando = 15,
}

export const transportStatusLabels: Record<
  TransportStatusEnum | number,
  string
> = {
  [TransportStatusEnum.Pendiente]: 'Pendiente',
  [TransportStatusEnum.Sincronizado]: 'Sincronizado',
  [TransportStatusEnum.Recibido]: 'Recibido',
  [TransportStatusEnum.Procesado]: 'Procesado',
  [TransportStatusEnum.Integrado]: 'Integrado',
  [TransportStatusEnum.Cancelado]: 'Cancelado',
  [TransportStatusEnum.Error]: 'Error',
  [TransportStatusEnum.Integrado2]: 'Integrado',
  [TransportStatusEnum.Elaborando]: 'Elaborando',
  [TransportStatusEnum.ERP]: 'ERP',
  [TransportStatusEnum.Parcial]: 'Parcial',
  [TransportStatusEnum.ecf_procesando]: 'ecf Procesando',
}

export const transportDocStatusLabels: Record<
  TransportStatusEnum | number,
  string
> = {
  [TransportStatusEnum.Pendiente]: 'Pendiente',
  [TransportStatusEnum.Sincronizado]: 'Sincronizado',
  [TransportStatusEnum.Recibido]: 'Recibido',
  [TransportStatusEnum.Procesado]: 'Procesado',
  [TransportStatusEnum.Integrado]: 'Integrado',
  [TransportStatusEnum.Cancelado]: 'Cancelado',
  [TransportStatusEnum.Error]: 'Error',
  [TransportStatusEnum.Entregado]: 'Entregado',
  [TransportStatusEnum.NoEntregado]: 'No Entregado',
  [TransportStatusEnum.EntDespues]: 'Ent.Después',
  [TransportStatusEnum.Integrado2]: 'Integrado',
}

export const transportStatusObj = {
  '1': 'warning',
  '13': 'success',
  '5': 'success',
  '11': 'success',
  '8': 'success',
  '4': 'success',
  '0': 'warning',
  '3': 'primary',
  '6': 'secondary',
  '9': 'secondary',
  '10': 'secondary',
  '14': 'info',
  '2': 'info',
  '7': 'error',
} as any
