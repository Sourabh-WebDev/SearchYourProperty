export class PropertyNotFoundError extends Error {}

const propertyModules = import.meta.glob('./data/properties/*.json', {
  eager: true,
})
const documentModules = import.meta.glob('./data/documents/*.json', {
  eager: true,
})

function keyFromPath(path) {
  return path.split('/').pop().replace('.json', '').toUpperCase()
}

const propertiesByAccount = Object.fromEntries(
  Object.entries(propertyModules).map(([path, mod]) => [
    keyFromPath(path),
    mod.default,
  ]),
)

const documentsByAccount = Object.fromEntries(
  Object.entries(documentModules).map(([path, mod]) => [
    keyFromPath(path),
    mod.default,
  ]),
)

export async function fetchPropertyDetail(accountNumber, _taxYear) {
  const account = accountNumber.trim().toUpperCase()
  const data = propertiesByAccount[account]

  if (!data) {
    throw new PropertyNotFoundError(
      `No property found for account "${account}". This demo only includes a small set of sample properties.`,
    )
  }

  return data
}

function addressText(property) {
  const situs = property.addresses.find((a) => a.isPrimary) ?? property.addresses[0]
  if (!situs) return ''
  return `${situs.street} ${situs.city} ${situs.zipCode}`.toLowerCase()
}

export async function searchProperties(rawQuery, field = 'all') {
  const query = rawQuery.trim().toLowerCase()
  if (!query) return []

  const matches = Object.values(propertiesByAccount).filter((property) => {
    const matchesAccount = property.accountNumber.toLowerCase().includes(query)
    const matchesAddress = addressText(property).includes(query)
    if (field === 'account') return matchesAccount
    if (field === 'address') return matchesAddress
    return matchesAccount || matchesAddress
  })

  return matches.sort((a, b) => {
    const aExact = a.accountNumber.toLowerCase() === query
    const bExact = b.accountNumber.toLowerCase() === query
    if (aExact !== bExact) return aExact ? -1 : 1
    return addressText(a).localeCompare(addressText(b))
  })
}

function flattenDocumentTree(node, trail = []) {
  const files = (node.files ?? []).map((file) => ({
    name: file.name,
    category: trail[trail.length - 1] ?? node.name,
    downloadUrl: file.downloadUrl,
    sizeWithUnits: file.sizeWithUnits,
    lastModified: file.lastModified,
  }))
  const nested = (node.directories ?? []).flatMap((dir) =>
    flattenDocumentTree(dir, [...trail, dir.name]),
  )
  return [...files, ...nested]
}

export async function fetchPropertyDocuments(accountNumber) {
  const account = accountNumber.trim().toUpperCase()
  const root = documentsByAccount[account]
  if (!root) return []

  return flattenDocumentTree(root).sort(
    (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
  )
}
