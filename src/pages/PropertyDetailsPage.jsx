import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPrint } from '@fortawesome/free-solid-svg-icons'
import { fetchPropertyDetail, PropertyNotFoundError } from '../api'
import { useLastProperty } from '../context/PropertyContext'
import { Tabs } from '../components/Tabs'
import { PropertySummaryBar } from '../components/property/PropertySummaryBar'
import { OverviewPanel } from '../components/property/OverviewPanel'
import { PropertyDetailsPanel } from '../components/property/PropertyDetailsPanel'
import { OwnershipPanel } from '../components/property/OwnershipPanel'
import { SalesTab } from '../components/SalesTab'
import { MapPanel } from '../components/property/MapPanel'
import { ComparableSalesPanel } from '../components/property/ComparableSalesPanel'
import { DocumentsPanel } from '../components/property/DocumentsPanel'

export function PropertyDetailsPage() {
  const { account, year } = useParams()
  const [searchParams] = useSearchParams()
  const { setLastProperty } = useLastProperty()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setData(null)

    fetchPropertyDetail(account, Number(year))
      .then((result) => {
        if (cancelled) return
        setData(result)
        setLastProperty({ account, year: Number(year), data: result })
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof PropertyNotFoundError) {
          setError(err.message)
        } else {
          setError(
            err instanceof Error
              ? err.message
              : 'Something went wrong while looking up this property.',
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [account, year, setLastProperty])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-slate-600">
        Loading property details…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}{' '}
        <Link to="/" className="font-medium underline">
          Try another search
        </Link>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
          New Search
        </Link>

        <Link
          to={`/property/${account}/${year}/print`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
        >
          <FontAwesomeIcon icon={faPrint} className="h-3.5 w-3.5" />
          Print
        </Link>
      </div>

      <div id="printable-report" className="space-y-6">
        <PropertySummaryBar data={data} year={year} />

        {data.notifications.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <ul className="list-decimal space-y-1 pl-5 text-sm text-amber-900">
              {data.notifications.map((n) => (
                <li key={n.id}>{n.note}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Tabs
            initialActiveKey={searchParams.get('tab') ?? undefined}
            items={[
              { key: 'overview', label: 'Overview', content: <OverviewPanel data={data} /> },
              {
                key: 'property-details',
                label: 'Property Details',
                content: <PropertyDetailsPanel data={data} />,
              },
              {
                key: 'ownership',
                label: 'Ownership',
                content: <OwnershipPanel data={data} />,
              },
              {
                key: 'sales-history',
                label: 'Sales History',
                content: <SalesTab data={data} />,
              },
              {
                key: 'comparable-sales',
                label: 'Comparable Sales',
                content: <ComparableSalesPanel data={data} />,
              },
              { key: 'map', label: 'Map', content: <MapPanel data={data} /> },
              {
                key: 'documents',
                label: 'Documents',
                content: <DocumentsPanel accountNumber={data.accountNumber} />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
