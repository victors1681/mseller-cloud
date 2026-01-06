// Tipo Cliente Options for ECF Secuencias
export const tipoClienteOptions = [
  // Comprobantes Fiscales Electrónicos (E-CF)
  {
    value: '31',
    label: 'Factura de Crédito Fiscal Electrónica',
    encabezado: 'E31',
  },
  { value: '32', label: 'Factura de Consumo Electrónica', encabezado: 'E32' },
  { value: '33', label: 'Nota de Débito Electrónica', encabezado: 'E33' },
  { value: '34', label: 'Nota de Crédito Electrónica', encabezado: 'E34' },
  {
    value: '41',
    label: 'Comprobante Electrónico de Compras',
    encabezado: 'E41',
  },
  {
    value: '42',
    label: 'Comprobante Electrónico de Registro Único de Ingresos',
    encabezado: 'E42',
  },
  {
    value: '43',
    label: 'Comprobante Electrónico para Gastos Menores',
    encabezado: 'E43',
  },
  {
    value: '44',
    label: 'Comprobante Electrónico para Regímenes Especiales',
    encabezado: 'E44',
  },
  {
    value: '45',
    label: 'Comprobante Electrónico Gubernamental',
    encabezado: 'E45',
  },
  {
    value: '46',
    label: 'Comprobante Electrónico para Exportaciones',
    encabezado: 'E46',
  },
  {
    value: '47',
    label: 'Comprobante Electrónico para Pagos al Exterior',
    encabezado: 'E47',
  },

  // Comprobantes Fiscales (CF) - No Electrónicos
  { value: '01', label: 'Factura de Crédito Fiscal', encabezado: 'B01' },
  { value: '02', label: 'Factura de Consumo', encabezado: 'B02' },
  { value: '03', label: 'Nota de Débito', encabezado: 'B03' },
  { value: '04', label: 'Nota de Crédito', encabezado: 'B04' },
  { value: '11', label: 'Comprobante de Compras', encabezado: 'B11' },
  {
    value: '12',
    label: 'Comprobante de Registro Único de Ingresos',
    encabezado: 'B12',
  },
  { value: '13', label: 'Comprobante para Gastos Menores', encabezado: 'B13' },
  {
    value: '14',
    label: 'Comprobante para Regímenes Especiales',
    encabezado: 'B14',
  },
  { value: '15', label: 'Comprobante Gubernamental', encabezado: 'B15' },
  { value: '16', label: 'Comprobante para Exportaciones', encabezado: 'B16' },
  {
    value: '17',
    label: 'Comprobante para Pagos al Exterior',
    encabezado: 'B17',
  },
]

// Export JSON string
export const tipoClienteOptionsJSON = JSON.stringify(
  tipoClienteOptions,
  null,
  2,
)

// Function to get label by value
export const getTipoClienteLabel = (tipoCliente: string) => {
  const option = tipoClienteOptions.find((opt) => opt.value === tipoCliente)
  return option ? option.label : tipoCliente
}

// Function to get value by label
export const getTipoClienteValue = (label: string) => {
  const option = tipoClienteOptions.find((opt) => opt.label === label)
  return option ? option.value : label
}
