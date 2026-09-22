import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons'

export function ComingSoon({ icon = faScrewdriverWrench, title, description, children }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
        <FontAwesomeIcon icon={icon} className="h-6 w-6 text-teal-600" />
      </div>
      <span className="mb-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-semibold uppercase tracking-wide text-amber-700">
        Coming Soon
      </span>
      <h2 className="mt-2 text-lg font-semibold text-slate-900">{title}</h2>
      {description && (
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
          {description}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
