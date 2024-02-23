export const formattedNumber = (number: number) => {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    //es-DO
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)

  return formattedNumber
}
export default formattedNumber
