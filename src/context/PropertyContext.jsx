import { createContext, useContext, useMemo, useState } from 'react'

const PropertyContext = createContext(null)

export function PropertyProvider({ children }) {
  const [lastProperty, setLastProperty] = useState(null)

  const value = useMemo(() => ({ lastProperty, setLastProperty }), [lastProperty])

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  )
}

export function useLastProperty() {
  const ctx = useContext(PropertyContext)
  if (!ctx) {
    throw new Error('useLastProperty must be used within a PropertyProvider')
  }
  return ctx
}
