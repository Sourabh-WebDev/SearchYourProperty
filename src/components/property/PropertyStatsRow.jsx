import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBed,
  faBath,
  faRulerCombined,
  faDrawPolygon,
} from '@fortawesome/free-solid-svg-icons'

function StatIcon({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5 text-slate-500" />
      {children}
    </span>
  )
}

export function PropertyStatsRow({ primaryBuilding, style, landSegment, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-slate-600 ${className}`}>
      {primaryBuilding && (
        <StatIcon icon={faRulerCombined}>
          {primaryBuilding.squareFeet.toLocaleString()} SF
        </StatIcon>
      )}
      {style?.bedroomCount != null && (
        <StatIcon icon={faBed}>{style.bedroomCount} Beds</StatIcon>
      )}
      {style?.bathroomCount != null && (
        <StatIcon icon={faBath}>{style.bathroomCount} Baths</StatIcon>
      )}
      {landSegment && (
        <StatIcon icon={faDrawPolygon}>
          {landSegment.acres.toFixed(2)} Acres
        </StatIcon>
      )}
    </div>
  )
}
