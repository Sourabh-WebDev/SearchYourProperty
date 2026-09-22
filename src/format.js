export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function formatCurrencyPrecise(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  })
}

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return value.toLocaleString('en-US')
}

export function formatMillLevy(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return value.toFixed(3)
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return `${(value * 100).toFixed(2)}%`
}

export function formatZip(value) {
  if (!value) return '—'
  return value.slice(0, 5)
}

export function titleCase(value) {
  if (!value) return '—'
  return value
}

export function getNeighborhoodLabel(data) {
  const neighborhood = data.neighborhoods[0]
  if (!neighborhood) return '—'
  return `${neighborhood.code}${
    neighborhood.extension ? `-${neighborhood.extension}` : ''
  }`
}
