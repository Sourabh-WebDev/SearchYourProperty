const STYLES = {
  'High Match': 'bg-emerald-100 text-emerald-700',
  'Good Match': 'bg-sky-100 text-sky-700',
  'Fair Match': 'bg-slate-100 text-slate-600',
}

export function MatchBadge({ label }) {
  return (
    <span
      className={`inline-flex flex-none items-center rounded-full px-2.5 py-1 text-sm font-semibold ${STYLES[label] ?? STYLES['Fair Match']}`}
    >
      {label}
    </span>
  )
}
