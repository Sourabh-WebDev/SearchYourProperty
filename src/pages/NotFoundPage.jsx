import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h1 className="text-lg font-semibold text-slate-900">Page not found</h1>
      <p className="mt-1 text-sm text-slate-600">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
      >
        Back to Property Search
      </Link>
    </div>
  )
}
