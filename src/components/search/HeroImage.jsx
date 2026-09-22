import guamHero from '../../assets/guam-hero.jpg'

export function HeroImage() {
  return (
    <div className="absolute inset-0">
      <img
        src={guamHero}
        alt="Tumon Bay, Guam"
        className="h-full w-full object-cover"
      />
      {/* dark scrim so title/search text stays readable over any part of the photo */}
      <div className="absolute inset-0 bg-black/50" />
      <p className="absolute bottom-1.5 right-3 text-xs text-white/70">
        Photo: NJo / Wikimedia Commons, CC BY-SA 3.0
      </p>
    </div>
  )
}
