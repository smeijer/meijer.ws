export function date(dateString: string | number | Date) {
  const isDate = dateString instanceof Date || typeof dateString === 'number' || (typeof dateString === 'string' && !isNaN(Date.parse(dateString)))
  if (isDate) {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }

  if (typeof dateString === 'string') {
    return dateString
  }

  throw new Error(`Invalid date: ${dateString}`);
}
