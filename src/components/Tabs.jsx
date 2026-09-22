import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTableColumns,
  faListUl,
  faChevronDown,
  faAnglesDown,
  faAnglesUp,
} from '@fortawesome/free-solid-svg-icons'

export function Tabs({ items, initialActiveKey }) {
  const startKey = initialActiveKey ?? items[0]?.key
  const [active, setActive] = useState(startKey)
  const [layout, setLayout] = useState('accordion') // tabs | accordion
  const [openKeys, setOpenKeys] = useState(() => new Set([startKey]))
  const activeItem = items.find((i) => i.key === active) ?? items[0]

  function toggleOpen(key, isOpen) {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (isOpen) {
        next.add(key)
        setActive(key)
      } else {
        next.delete(key)
      }
      return next
    })
  }

  function expandAll() {
    setOpenKeys(new Set(items.map((i) => i.key)))
  }

  function collapseAll() {
    setOpenKeys(new Set())
  }

  useEffect(() => {
    function expandForPrint() {
      setLayout('accordion')
      setOpenKeys(new Set(items.map((i) => i.key)))
    }
    window.addEventListener('beforeprint', expandForPrint)
    return () => window.removeEventListener('beforeprint', expandForPrint)
  }, [items])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 print:hidden">
        {layout === 'tabs' ? (
          <div className="flex flex-wrap gap-1">
            {items.map((item) => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition ${
                  activeItem?.key === item.key
                    ? 'border-teal-700 bg-teal-50 font-semibold text-teal-800'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-1 flex gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <FontAwesomeIcon icon={faAnglesDown} className="h-3 w-3" />
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <FontAwesomeIcon icon={faAnglesUp} className="h-3 w-3" />
              Collapse All
            </button>
          </div>
        )}

        <div className="mb-1 ml-auto flex flex-none overflow-hidden rounded-lg border border-slate-200 text-sm font-medium">
          <button
            type="button"
            onClick={() => setLayout('tabs')}
            title="Tab view"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 transition ${
              layout === 'tabs'
                ? 'bg-teal-700 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FontAwesomeIcon icon={faTableColumns} className="h-3 w-3" />
            Tabs
          </button>
          <button
            type="button"
            onClick={() => setLayout('accordion')}
            title="Accordion view"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 transition ${
              layout === 'accordion'
                ? 'bg-teal-700 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FontAwesomeIcon icon={faListUl} className="h-3 w-3" />
            Accordion
          </button>
        </div>
      </div>

      {layout === 'tabs' ? (
        <div className="pt-5">{activeItem?.content}</div>
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item) => {
            const isOpen = openKeys.has(item.key)
            return (
              <details
                key={item.key}
                open={isOpen}
                onToggle={(e) => toggleOpen(item.key, e.target.open)}
                className="group rounded-xl border border-slate-200 bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center gap-2.5 px-4 py-3 text-sm font-semibold text-slate-800">
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="h-3 w-3 flex-none text-slate-500 transition group-open:rotate-180"
                  />
                  {item.label}
                </summary>
                {isOpen && (
                  <div className="border-t border-slate-100 p-4">
                    {item.content}
                  </div>
                )}
              </details>
            )
          })}
        </div>
      )}
    </div>
  )
}
