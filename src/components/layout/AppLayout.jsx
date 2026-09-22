import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopNav />
      <main className="px-4 py-6 sm:px-6 lg:px-10">
        <Outlet />
      </main>
      <footer className="px-4 py-6 text-center text-sm text-slate-500 sm:px-6 lg:px-10">
        Sample property data for demonstration purposes only. Not an
        official government record.
      </footer>
    </div>
  )
}
