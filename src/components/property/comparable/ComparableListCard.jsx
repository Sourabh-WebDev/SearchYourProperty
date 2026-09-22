import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRulerCombined,
  faBed,
  faBath,
  faPlus,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'
import { formatCurrency, formatDate } from '../../../format'
import { HouseThumbnail } from '../../common/HouseThumbnail'
import { MatchBadge } from './MatchBadge'

export function ComparableListCard({ comp, selected, disabled, onToggle }) {
  return (
    <div
      className={`flex gap-3 rounded-xl border p-3 transition ${
        selected
          ? 'border-teal-400 bg-teal-50/60 shadow-sm'
          : 'border-slate-200 bg-white hover:border-teal-200 hover:shadow-sm'
      }`}
    >
      <HouseThumbnail className="h-16 w-20" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">
              {comp.streetNumber} {comp.street}
            </p>
            <p className="truncate text-sm text-slate-600">
              {comp.city}, CO {comp.zipCode}
            </p>
          </div>
          <MatchBadge label={comp.matchLabel} />
        </div>

        <p className="mt-1 text-base font-bold text-emerald-700">
          {formatCurrency(comp.price)}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faRulerCombined} className="h-3 w-3" />
            {comp.sqft.toLocaleString()} SF
          </span>
          <span className="inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faBed} className="h-3 w-3" />
            {comp.beds} bd
          </span>
          <span className="inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faBath} className="h-3 w-3" />
            {comp.baths} ba
          </span>
          <span>Sold {formatDate(comp.soldDate)}</span>
          <span>${comp.pricePerSf}/SF</span>
        </div>
      </div>

      <button
        type="button"
        disabled={!selected && disabled}
        onClick={() => onToggle(comp.id)}
        title={
          !selected && disabled ? 'You can compare up to 3 properties' : undefined
        }
        className={`flex h-8 flex-none items-center gap-1.5 self-start rounded-lg px-3 text-sm font-semibold transition ${
          selected
            ? 'bg-teal-700 text-white'
            : disabled
              ? 'cursor-not-allowed bg-slate-100 text-slate-500'
              : 'border border-teal-700 text-teal-700 hover:bg-teal-50'
        }`}
      >
        <FontAwesomeIcon icon={selected ? faCheck : faPlus} className="h-3 w-3" />
        {selected ? 'Added' : 'Add'}
      </button>
    </div>
  )
}
