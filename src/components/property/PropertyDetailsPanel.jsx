import { BuildingTab } from '../BuildingTab'
import { LandTab } from '../LandTab'
import { ValueTab } from '../ValueTab'
import { TaxAuthoritiesTab } from '../TaxAuthoritiesTab'

export function PropertyDetailsPanel({ data }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Building
        </h2>
        <BuildingTab data={data} />
      </div>
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Land
        </h2>
        <LandTab data={data} />
      </div>
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Valuation History
        </h2>
        <ValueTab data={data} />
      </div>
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Taxing Authorities
        </h2>
        <TaxAuthoritiesTab data={data} />
      </div>
    </div>
  )
}
