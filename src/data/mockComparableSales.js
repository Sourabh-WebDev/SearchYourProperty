const STREET_NAMES = [
  'Walden Ct',
  'Summer Dr',
  'Pendleton Dr',
  'Hidden Oaks Way',
  'Ponderosa Dr',
  'Majestic Oak Ln',
  'Regal Oak Ln',
]

function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function hashSeed(text) {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100000
  }
  return hash || 1
}

export function generateMockComparableSales(subjectData) {
  const primaryBuilding =
    subjectData.buildings.find((b) => b.isPrimary) ?? subjectData.buildings[0]
  const baseSqft = primaryBuilding?.squareFeet ?? 2000
  const baseBeds = primaryBuilding?.styles?.[0]?.bedroomCount ?? 3
  const baseBaths = primaryBuilding?.styles?.[0]?.bathroomCount ?? 2
  const baseLat = subjectData.latitude
  const baseLng = subjectData.longitude
  const situs =
    subjectData.addresses.find((a) => a.isPrimary) ?? subjectData.addresses[0]

  const rand = seededRandom(hashSeed(subjectData.accountNumber))

  return STREET_NAMES.map((street, idx) => {
    const sqftDelta = (rand() - 0.5) * 0.22
    const sqft = Math.round((baseSqft * (1 + sqftDelta)) / 10) * 10
    const pricePerSf = 320 + Math.round(rand() * 140)
    const price = Math.round((sqft * pricePerSf) / 500) * 500
    const bedDelta = rand() > 0.7 ? (rand() > 0.5 ? 1 : -1) : 0
    const bathDelta = rand() > 0.7 ? (rand() > 0.5 ? 1 : -1) : 0
    const daysAgo = 20 + Math.round(rand() * 340)
    const soldDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    const acres = (0.25 + rand() * 0.6).toFixed(2)

    const sqftSimilarity = 1 - Math.abs(sqftDelta)
    const matchLabel =
      sqftSimilarity > 0.93
        ? 'High Match'
        : sqftSimilarity > 0.85
          ? 'Good Match'
          : 'Fair Match'

    const latOffset = (rand() - 0.5) * 0.012
    const lngOffset = (rand() - 0.5) * 0.012

    return {
      id: `mock-comp-${idx}`,
      streetNumber: 700 + idx * 70 + Math.round(rand() * 60),
      street,
      city: situs?.city ?? subjectData.addresses[0]?.city ?? '',
      zipCode: situs?.zipCode ?? '',
      price,
      pricePerSf,
      sqft,
      beds: Math.max(1, baseBeds + bedDelta),
      baths: Math.max(1, baseBaths + bathDelta),
      acres: Number(acres),
      soldDate: soldDate.toISOString(),
      matchLabel,
      latitude: baseLat != null ? baseLat + latOffset : null,
      longitude: baseLng != null ? baseLng + lngOffset : null,
    }
  }).sort((a, b) => {
    const rank = { 'High Match': 0, 'Good Match': 1, 'Fair Match': 2 }
    return rank[a.matchLabel] - rank[b.matchLabel]
  })
}
