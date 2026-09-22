import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFilePdf,
  faDownload,
  faUpload,
} from '@fortawesome/free-solid-svg-icons'
import { fetchPropertyDocuments } from '../../api'
import { formatDate } from '../../format'

export function DocumentsPanel({ accountNumber }) {
  const [status, setStatus] = useState('loading') // loading | success | error
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    fetchPropertyDocuments(accountNumber)
      .then((docs) => {
        if (cancelled) return
        setDocuments(docs)
        setStatus('success')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [accountNumber])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Property Documents
          </h2>
          <p className="text-sm text-slate-600">
            Sample document records for this property.
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Uploads aren't supported yet"
          className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
        >
          <FontAwesomeIcon icon={faUpload} className="h-3.5 w-3.5" />
          Upload Document
        </button>
      </div>

      {status === 'loading' && (
        <p className="py-10 text-center text-sm text-slate-600">
          Loading documents…
        </p>
      )}

      {status === 'error' && (
        <p className="py-10 text-center text-sm text-red-600">
          Couldn't load documents for this parcel. Please try again.
        </p>
      )}

      {status === 'success' && documents.length === 0 && (
        <p className="py-10 text-center text-sm text-slate-600">
          No documents on file for this parcel.
        </p>
      )}

      {status === 'success' && documents.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-sm font-medium uppercase tracking-wide text-slate-600">
                <th className="py-2 pr-4">Document Name</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Size</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => (
                <tr
                  key={`${doc.name}-${idx}`}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-2 pr-4">
                    <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                      <FontAwesomeIcon
                        icon={faFilePdf}
                        className="h-4 w-4 flex-none text-red-500"
                      />
                      {doc.name}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-slate-600">{doc.category}</td>
                  <td className="py-2 pr-4 text-slate-600">
                    {formatDate(doc.lastModified)}
                  </td>
                  <td className="py-2 pr-4 text-slate-600">
                    {doc.sizeWithUnits}
                  </td>
                  <td className="py-2 pr-4">
                    {doc.downloadUrl ? (
                      <a
                        href={doc.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-teal-700 hover:underline"
                      >
                        <FontAwesomeIcon
                          icon={faDownload}
                          className="h-3.5 w-3.5"
                        />
                        Download
                      </a>
                    ) : (
                      <span
                        title="Sample document — download not available in this demo"
                        className="inline-flex cursor-not-allowed items-center gap-1.5 font-medium text-slate-500"
                      >
                        <FontAwesomeIcon
                          icon={faDownload}
                          className="h-3.5 w-3.5"
                        />
                        Download
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
