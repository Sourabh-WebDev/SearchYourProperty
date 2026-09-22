import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass,
  faChevronDown,
  faList,
  faMap,
} from '@fortawesome/free-solid-svg-icons'
import { searchProperties } from '../api'
import { PropertyResultCard } from '../components/search/PropertyResultCard'
import { SearchResultsMap } from '../components/search/SearchResultsMap'
import { HeroImage } from '../components/search/HeroImage'

const CURRENT_YEAR = 2026
const EXAMPLE_SEARCHES = ['R0601732', '5851']
const SEARCH_FIELDS = [
  { key: 'all', label: 'All', enabled: true },
  { key: 'account', label: 'Account Number', enabled: true },
  { key: 'address', label: 'Address', enabled: true },
  { key: 'owner', label: 'Owner Name', enabled: false },
  { key: 'legal', label: 'Legal Description', enabled: false },
]

export function PropertySearchPage() {
  const [query, setQuery] = useState('')
  const [searchField, setSearchField] = useState('all')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('list') // list | map

  async function runSearch(rawQuery, searchYear, field) {
    if (!rawQuery.trim()) return
    setStatus('loading')
    setError(null)
    try {
      const matches = await searchProperties(rawQuery, field)
      setResults(matches.map((data) => ({ data, year: searchYear })))
      setStatus('success')
    } catch (err) {
      setResults([])
      setStatus('error')
      setError(
        err instanceof Error ? err.message : 'Something went wrong while searching.',
      )
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    runSearch(query, CURRENT_YEAR, searchField)
  }

  function handleExampleClick(term) {
    setQuery(term)
    runSearch(term, CURRENT_YEAR, searchField)
  }

  return (
    <div className="-m-4 sm:-m-6">
      <div className="relative overflow-hidden">
        <HeroImage />
        <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md sm:text-5xl">
            Property Search
          </h1>
          <p className="mt-3 text-base text-white/95 drop-shadow-sm">
            Find a property by address, account number, owner name, parcel
            ID, or legal description.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <div className="flex flex-1 items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
              <label className="relative flex-none">
                <span className="sr-only">Search by</span>
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="h-full cursor-pointer appearance-none border-r border-slate-200 bg-slate-50 py-3 pl-3 pr-7 text-sm font-medium text-slate-700 outline-none"
                >
                  {SEARCH_FIELDS.map((f) => (
                    <option key={f.key} value={f.key} disabled={!f.enabled}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500"
                />
              </label>
              <div className="relative flex-1">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter address, account number, owner name, or legal description..."
                  className="w-full py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-lg bg-teal-700 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'loading' ? 'Searching…' : 'Search'}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="font-medium text-white drop-shadow-sm">Try an example:</span>
            {EXAMPLE_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleExampleClick(term)}
                className="rounded-full bg-white px-3 py-1 font-medium text-slate-600 shadow-sm hover:bg-slate-50"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <AdvancedFiltersSidebar />

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Search Results
                {status === 'success' && (
                  <span className="ml-2 font-normal normal-case text-slate-500">
                    {results.length} {results.length === 1 ? 'property' : 'properties'} found
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2">
                <select
                  disabled
                  className="cursor-not-allowed rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-500"
                >
                  <option>Sort: Relevance</option>
                </select>
                <div className="flex overflow-hidden rounded-lg border border-slate-200 text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 transition ${
                      viewMode === 'list'
                        ? 'bg-teal-700 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faList} className="h-3 w-3" />
                    List
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 transition ${
                      viewMode === 'map'
                        ? 'bg-teal-700 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faMap} className="h-3 w-3" />
                    Map
                  </button>
                </div>
              </div>
            </div>

            {status === 'idle' && (
              <p className="py-10 text-center text-sm text-slate-600">
                Enter an address or account/parcel number above to search, or
                try one of the examples.
              </p>
            )}

            {status === 'loading' && (
              <p className="py-10 text-center text-sm text-slate-600">
                Searching…
              </p>
            )}

            {status === 'error' && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {status === 'success' && results.length === 0 && (
              <p className="py-10 text-center text-sm text-slate-600">
                No properties matched your search. This demo only includes a
                small set of sample properties.
              </p>
            )}

            {status === 'success' && results.length > 0 && viewMode === 'list' && (
              <div className="space-y-3">
                {results.map((r) => (
                  <PropertyResultCard key={r.data.accountNumber} data={r.data} year={r.year} />
                ))}
              </div>
            )}

            {status === 'success' && results.length > 0 && viewMode === 'map' && (
              <SearchResultsMap results={results} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AdvancedFiltersSidebar() {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Advanced Filters
        </h2>
      </div>

      <fieldset disabled className="cursor-not-allowed space-y-4 opacity-60">
        <FilterSelect label="Property Type" options={['Residential (SF)', 'Commercial', 'Vacant Land', 'Agricultural']} />
        <FilterSelect label="Property Status" options={['Active', 'Recently Sold', 'Vacant']} />
        <FilterSelect label="Neighborhood" options={['All Neighborhoods']} />
        <FilterSelect label="Tax District" options={['All Districts']} />
        <FilterRange label="Year Built" />
        <FilterRange label="Living Area (sq ft)" />
        <FilterRange label="Lot Size (Acres)" />
        <FilterRange label="Sale Price" />

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            className="flex-1 rounded-lg bg-slate-800 py-2 text-sm font-semibold text-white"
          >
            Apply Filters
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
          >
            Clear
          </button>
        </div>
      </fieldset>
    </aside>
  )
}

function FilterSelect({ label, options }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-600">{label}</p>
      <select className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-600">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}

function FilterRange({ label }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-600">{label}</p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Min"
          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
        />
        <span className="text-slate-500">–</span>
        <input
          type="text"
          placeholder="Max"
          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
        />
      </div>
    </div>
  )
}
