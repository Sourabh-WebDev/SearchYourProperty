import houseSample from '../../assets/house-sample.jpg'

export function HouseThumbnail({ className = 'h-24 w-32' }) {
  return (
    <div
      className={`flex-none overflow-hidden rounded-lg border border-slate-200 ${className}`}
    >
      <img
        src={houseSample}
        alt="Example property photo"
        className="h-full w-full object-cover"
      />
    </div>
  )
}
