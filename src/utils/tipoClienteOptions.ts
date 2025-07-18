// Tipo Cliente Options for ECF Secuencias
export const tipoClienteOptions = [
  { value: '31', label: 'Factura de Crédito Fiscal Electrónica' },
  { value: '32', label: 'Factura de Consumo Electrónica' },
  { value: '33', label: 'Nota de Débito Electrónica' },
  { value: '34', label: 'Nota de Crédito Electrónica' },
  { value: '41', label: 'Comprobante Electrónico de Compras' },
  { value: '43', label: 'Comprobante Electrónico para Gastos Menores' },
  { value: '44', label: 'Comprobante Electrónico para Regímenes Especiales' },
  { value: '45', label: 'Comprobante Electrónico Gubernamental' },
  { value: '46', label: 'Comprobante Electrónico para Exportaciones' },
  { value: '47', label: 'Comprobante Electrónico para Pagos al Exterior' },
  //   { value: '01', label: 'Factura de Crédito Fiscal' },
  //   { value: '02', label: 'Factura de Consumo' },
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
