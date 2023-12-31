export const formatCurrency = (amount: number) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    //es-DO
    style: 'currency',
    currency: 'USD', //DOP
  }).format(amount)

  return formattedAmount
}
export default formatCurrency
