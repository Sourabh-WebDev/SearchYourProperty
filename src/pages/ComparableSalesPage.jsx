import { Navigate } from 'react-router-dom'
import { useLastProperty } from '../context/PropertyContext'
import { ComingSoon } from '../components/common/ComingSoon'
import { faCity } from '@fortawesome/free-solid-svg-icons'

export function ComparableSalesPage() {
  const { lastProperty } = useLastProperty()

  if (lastProperty) {
    return (
      <Navigate
        to={`/property/${lastProperty.account}/${lastProperty.year}?tab=comparable-sales`}
        replace
      />
    )
  }

  return (
    <ComingSoon
      icon={faCity}
      title="Comparable Sales"
      description="Search for a property, then come back here to see recent nearby comparable sales side by side."
    />
  )
}
