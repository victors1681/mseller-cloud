export enum RemoveDataType {
  Cobros = 'Cobros',
  Pedidos = 'Pedidos',
  Clientes = 'Clientes',
  Vendedores = 'Vendedores',
  CondicionesPago = 'CondicionesPago',
  Localidades = 'Localidades',
  Facturas = 'Facturas',
  Productos = 'Productos',
  Transportes = 'Transportes',
  Distribuidores = 'Distribuidores',
  RNCs = 'RNCs',
  Historial = 'Historial',
}

export interface RemoveDataCount {
  action: RemoveDataType
  count: number
}

export interface RemoveDataOptions {
  label: string
  value: RemoveDataType
}
