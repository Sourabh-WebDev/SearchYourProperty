import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileLines,
  faCity,
  faFileInvoiceDollar,
  faClockRotateLeft,
  faMap,
  faSliders,
} from '@fortawesome/free-solid-svg-icons'
import { useLastProperty } from '../context/PropertyContext'
import { ReportPreviewThumbnail } from '../components/reports/ReportPreviewThumbnail'
import { PrintableReport } from '../components/reports/PrintableReport'

const REPORT_TYPES = [
  {
    key: 'property-detail',
    icon: faFileLines,
    title: 'Property Detail Report',
    description:
      'Includes property characteristics, ownership, assessment values, and sales history.',
    enabled: true,
  },
  {
    key: 'comparable-sales',
    icon: faCity,
    title: 'Comparable Sales Report',
    description: 'Side-by-side comparison of selected comparable properties.',
    enabled: false,
  },
  {
    key: 'assessment',
    icon: faFileInvoiceDollar,
    title: 'Assessment Report',
    description: 'Assessed and school-assessed values by tax year.',
    enabled: false,
  },
  {
    key: 'sales-history',
    icon: faClockRotateLeft,
    title: 'Sales History Report',
    description: 'Recorded deed history for a parcel.',
    enabled: false,
  },
  {
    key: 'map',
    icon: faMap,
    title: 'Map Report',
    description: 'Parcel location with a static map export.',
    enabled: false,
  },
  {
    key: 'custom',
    icon: faSliders,
    title: 'Custom Report',
    description: 'Choose exactly which sections to include.',
    enabled: false,
  },
]

const FORMATS = [
  { key: 'pdf', label: 'PDF (Recommended)', enabled: true },
  { key: 'excel', label: 'Excel', enabled: false },
  { key: 'word', label: 'Word', enabled: false },
]

export function ReportsPage() {
  const { lastProperty } = useLastProperty()
  const [selectedKey, setSelectedKey] = useState('property-detail')
  const [format, setFormat] = useState('pdf')

  const selected = REPORT_TYPES.find((r) => r.key === selectedKey)
  const canGenerate =
    selected.enabled && format === 'pdf' && Boolean(lastProperty)

  function handleGenerate() {
    if (!canGenerate) return
    window.print()
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr_260px]">
      <aside className="h-fit space-y-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        {REPORT_TYPES.map((report) => (
          <button
            key={report.key}
            type="button"
            onClick={() => setSelectedKey(report.key)}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
              selectedKey === report.key
                ? 'bg-teal-50 text-teal-800'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FontAwesomeIcon icon={report.icon} className="h-4 w-4 flex-none" />
            {report.title}
          </button>
        ))}
      </aside>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Generate Reports</h1>
        <p className="mb-6 text-sm text-slate-600">
          Create and download property reports.
        </p>

        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-teal-50 text-teal-700">
            <FontAwesomeIcon icon={selected.icon} className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{selected.title}</p>
            <p className="text-sm text-slate-600">{selected.description}</p>
          </div>
          {!selected.enabled && (
            <span className="ml-auto flex-none rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-semibold uppercase tracking-wide text-amber-700">
              Coming Soon
            </span>
          )}
        </div>

        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-600">
          Report Format
        </p>
        <div className="mb-6 flex flex-wrap gap-4">
          {FORMATS.map((f) => (
            <label
              key={f.key}
              className={`flex items-center gap-2 text-sm ${
                f.enabled ? 'text-slate-700' : 'cursor-not-allowed text-slate-500'
              }`}
            >
              <input
                type="radio"
                name="format"
                value={f.key}
                checked={format === f.key}
                disabled={!f.enabled}
                onChange={() => setFormat(f.key)}
                className="accent-teal-700"
              />
              {f.label}
            </label>
          ))}
        </div>

        {!lastProperty && (
          <p className="mb-4 text-sm text-slate-600">
            <Link to="/" className="font-medium text-teal-700 hover:underline">
              Search for a property
            </Link>{' '}
            first to generate a report for it.
          </p>
        )}

        <button
          type="button"
          disabled={!canGenerate}
          onClick={handleGenerate}
          className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white sm:w-auto sm:px-8 ${
            canGenerate
              ? 'bg-teal-700 hover:bg-teal-800'
              : 'cursor-not-allowed bg-slate-300'
          }`}
        >
          Generate Report
        </button>
      </div>

      <div className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
          Preview
        </p>
        <ReportPreviewThumbnail />
      </div>

      {lastProperty && (
        <PrintableReport data={lastProperty.data} year={lastProperty.year} />
      )}
    </div>
  )
}
