import { HouseThumbnail } from '../common/HouseThumbnail'

export function ReportPreviewThumbnail() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b-2 border-teal-700 bg-teal-700 px-3 py-2">
        <p className="text-[11px] font-bold text-white">SearchYourProperty</p>
        <p className="text-[9px] text-teal-100">Property Detail Report</p>
      </div>
      <div className="space-y-2 p-3">
        <div className="space-y-1">
          <div className="h-2 w-3/4 rounded-full bg-slate-800" />
          <div className="h-1.5 w-1/2 rounded-full bg-slate-300" />
        </div>

        <HouseThumbnail className="h-16 w-full" />

        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-1 w-2/3 rounded-full bg-slate-200" />
              <div className="h-1.5 w-4/5 rounded-full bg-slate-400" />
            </div>
          ))}
        </div>

        <div className="h-14 rounded-md bg-slate-100" />
      </div>
    </div>
  )
}
