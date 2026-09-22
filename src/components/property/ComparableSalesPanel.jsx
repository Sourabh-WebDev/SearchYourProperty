import { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlask } from '@fortawesome/free-solid-svg-icons'
import { generateMockComparableSales } from '../../data/mockComparableSales'
import { ComparableListCard } from './comparable/ComparableListCard'
import { ComparableSalesMap } from './comparable/ComparableSalesMap'

const MAX_COMPARE = 3
const SORT_OPTIONS = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'sqft-desc', label: 'Square Feet' },
  { key: 'date-desc', label: 'Sale Date' },
]

function sortComps(comps, sortKey) {
  const sorted = [...comps]
  switch (sortKey) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'sqft-desc':
      return sorted.sort((a, b) => b.sqft - a.sqft)
    case 'date-desc':
      return sorted.sort(
        (a, b) => new Date(b.soldDate).getTime() - new Date(a.soldDate).getTime(),
      )
    default:
      return sorted
  }
}

export function ComparableSalesPanel({ data }) {
  const comps = useMemo(() => generateMockComparableSales(data), [data])
  const [sortKey, setSortKey] = useState('relevance')
  const [selectedIds, setSelectedIds] = useState([])

  const sortedComps = useMemo(
    () => sortComps(comps, sortKey),
    [comps, sortKey],
  )

  function toggleSelected(id) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, id]
    })
  }

  if (data.latitude == null || data.longitude == null) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
        No location on file for this parcel, so nearby comparable sales can't
        be plotted.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <FontAwesomeIcon icon={faFlask} className="mt-0.5 h-4 w-4 flex-none" />
        <p>
          <span className="font-semibold">Sample data for layout preview.</span>{' '}
          These comparable sales are generated for demonstration only — they
          are not real transactions.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900">
          {comps.length} Comparable Sales
        </h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600" htmlFor="comp-sort">
            Sort by
          </label>
          <select
            id="comp-sort"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-700"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {sortedComps.map((comp) => (
            <ComparableListCard
              key={comp.id}
              comp={comp}
              selected={selectedIds.includes(comp.id)}
              disabled={selectedIds.length >= MAX_COMPARE}
              onToggle={toggleSelected}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-8rem)]">
          <ComparableSalesMap
            subjectLatitude={data.latitude}
            subjectLongitude={data.longitude}
            comps={sortedComps}
            selectedIds={selectedIds}
            onToggle={toggleSelected}
          />
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="sticky bottom-4 flex items-center justify-between rounded-xl border border-teal-200 bg-white px-4 py-3 shadow-lg">
          <p className="text-sm font-medium text-slate-700">
            {selectedIds.length} of {MAX_COMPARE} properties selected
          </p>
          <button
            type="button"
            disabled
            title="Comparison view is coming soon"
            className="cursor-not-allowed rounded-lg bg-slate-300 px-4 py-2 text-sm font-semibold text-white"
          >
            Compare Selected
          </button>
        </div>
      )}
    </div>
  )
}
