interface Stat {
  number: string
  label: string
  icon?: string
}

interface StatsProps {
  title?: string
  stats: Stat[]
  className?: string
}

export function Stats({ title, stats, className = '' }: StatsProps) {
  return (
    <section className={`py-16 md:py-24 bg-blue-900 text-white ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
        )}

        <div
          className={`grid gap-8 ${
            stats.length <= 3
              ? 'md:grid-cols-3'
              : stats.length === 4
              ? 'md:grid-cols-4'
              : 'md:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="mb-4 text-5xl font-bold text-orange-400">
                {stat.number}
              </div>
              <div className="text-lg text-white/90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
