import Image from 'next/image'

interface PageHeroProps {
  title: string
  description: string
  imageSrc: string
  imageAlt?: string
  accentText?: string
}

export function PageHero({
  title,
  description,
  imageSrc,
  imageAlt,
  accentText,
}: PageHeroProps) {
  return (
    <section className="relative h-[320px] md:h-[380px] flex items-center justify-center overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#152a45]/95 via-[#1e3a5f]/85 to-[#1e3a5f]/70" />
      </div>

      {/* Subtle pattern */}
      <div className="absolute inset-0 z-[1] opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {accentText && (
          <p className="text-[#e67e22] font-semibold text-sm uppercase tracking-widest mb-4 animate-fadeIn">
            {accentText}
          </p>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          {title}
        </h1>
        <p className="text-lg text-white/85 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {description}
        </p>
      </div>
    </section>
  )
}
