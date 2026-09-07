import { ImageResponse } from 'next/og'
import { ASSOCIATION_FOUNDING_YEAR } from '@/lib/siteConfig'

export const alt = "AAFD Val de Saône - Association d'Aide aux Familles en Difficulté"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1e3a5f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '8px',
            height: '100%',
            background: '#f97316',
          }}
        />

        <div
          style={{
            background: '#f97316',
            color: 'white',
            padding: '10px 28px',
            borderRadius: '999px',
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '36px',
            display: 'flex',
          }}
        >
          Association loi 1901 · Val de Saône
        </div>

        <h1
          style={{
            color: 'white',
            fontSize: '68px',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.15,
            margin: '0 0 24px',
            display: 'flex',
          }}
        >
          AAFD Val de Saône
        </h1>

        <p
          style={{
            color: '#93c5fd',
            fontSize: '26px',
            textAlign: 'center',
            lineHeight: 1.5,
            margin: '0 0 48px',
            display: 'flex',
          }}
        >
          Accompagner les familles réfugiées depuis {ASSOCIATION_FOUNDING_YEAR}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '48px',
          }}
        >
          {[
            { value: String(ASSOCIATION_FOUNDING_YEAR), label: 'depuis' },
            { value: '10+', label: 'nationalités' },
            { value: '100%', label: 'bénévoles' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  color: '#f97316',
                  fontSize: '36px',
                  fontWeight: 800,
                }}
              >
                {stat.value}
              </span>
              <span style={{ color: '#bfdbfe', fontSize: '16px' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
