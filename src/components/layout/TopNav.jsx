import { NavLink, useLocation } from 'react-router-dom'

// Nav menu hidden for now — flip back to true to restore it.
const SHOW_NAV_MENU = false

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Property Search',
    end: true,
    isAlsoActive: (pathname) => pathname.startsWith('/property/'),
  },
  { to: '/comparable-sales', label: 'Comparable Sales' },
  { to: '/reports', label: 'Reports' },
  { to: '/help', label: 'Help & Support' },
]

export function TopNav() {
  const { pathname } = useLocation()

  return (
    <header className="border-b-2 border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <NavLink to="/" className="flex flex-none items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-700 text-base font-bold text-white shadow-sm">
            SP
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-extrabold leading-tight text-slate-900">
              SearchYourProperty
            </p>
            <p className="text-sm leading-tight text-slate-600">
              Property Records Lookup
            </p>
          </div>
        </NavLink>

        {SHOW_NAV_MENU && (
          <nav className="flex flex-1 justify-start gap-1 overflow-x-auto xl:justify-center">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.to || Boolean(item.isAlsoActive?.(pathname))
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-base font-semibold transition ${
                    active
                      ? 'bg-teal-100 text-teal-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        )}

        <span className="hidden flex-none rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 md:inline-block">
          Sample data
        </span>
      </div>
    </header>
  )
}
