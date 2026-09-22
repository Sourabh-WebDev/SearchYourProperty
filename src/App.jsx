import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PropertyProvider } from './context/PropertyContext'
import { AppLayout } from './components/layout/AppLayout'
import { PropertySearchPage } from './pages/PropertySearchPage'
import { PropertyDetailsPage } from './pages/PropertyDetailsPage'
import { PrintPreviewPage } from './pages/PrintPreviewPage'
import { ComparableSalesPage } from './pages/ComparableSalesPage'
import { ReportsPage } from './pages/ReportsPage'
import { HelpPage } from './pages/HelpPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <PropertyProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<PropertySearchPage />} />
            <Route path="property/:account/:year" element={<PropertyDetailsPage />} />
            <Route path="property/:account/:year/print" element={<PrintPreviewPage />} />
            <Route path="comparable-sales" element={<ComparableSalesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </PropertyProvider>
    </BrowserRouter>
  )
}

export default App
