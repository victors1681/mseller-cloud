export const getDateParam = (dates?: Date[]) => {
  if (!dates || dates.length === 0) {
    return {}
  }
  const start = dates[0].toISOString()
  const end = dates[1].toISOString()
  return { dates: [start, end].join(',') }
}
