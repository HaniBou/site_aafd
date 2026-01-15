'use client'

import Link from 'next/link'
import Image from 'next/image'

export function HeaderTop() {
  return (
    <div className="relative bg-white pt-6">
      <div className="relative mx-auto w-full px-6 lg:px-12 pb-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <Link href="/" className="relative group">
              <Image 
                src="/images/test-logo.webp" 
                alt="AAFD Logo" 
                width={140} 
                height={140}
                className="object-contain transition-transform group-hover:scale-105 drop-shadow-xl"
              />
            </Link>
          </div>

          {/* Boutons CTA en forme de blobs - Superposés */}
          <div className="hidden lg:flex items-center absolute top-0 right-12">
            {/* Bouton Devenir Bénévole - Blob Orange (derrière) */}
            <Link href="/nous-rejoindre" className="relative inline-block group z-10">
              {/* Blob Orange de fond (décalé) */}
              <div 
                className="absolute inset-0 bg-orange-300 opacity-40 transition-all duration-500 group-hover:rotate-6 group-hover:scale-105"
                style={{
                  borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                  transform: "translate(6px, 6px)"
                }}
              ></div>

              {/* Blob Orange principal (Bouton) */}
              <div 
                className="relative px-8 py-6 w-36 h-36 flex items-center justify-center text-white font-bold text-center text-sm uppercase tracking-wide leading-tight transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #fb923c, #f97316)",
                  borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                }}
              >
                Devenir<br />Bénévole
              </div>
            </Link>

            {/* Bouton Faire un Don - Blob Rose (devant, superposé) */}
            <a
              href="https://www.helloasso.com/associations/association-d-aide-aux-familles-en-difficulte-en-val-de-saone"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block group z-20 -ml-8"
            >
              {/* Blob Rose de fond (décalé) */}
              <div 
                className="absolute inset-0 bg-pink-300 opacity-40 transition-all duration-500 group-hover:rotate-6 group-hover:scale-105"
                style={{
                  borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                  transform: "translate(6px, 6px)"
                }}
              ></div>

              {/* Blob Rose principal (Bouton) */}
              <div 
                className="relative px-8 py-6 w-36 h-36 flex items-center justify-center text-white font-bold text-center text-sm uppercase tracking-wide leading-tight transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #ec4899, #db2777)",
                  borderRadius: "50% 50% 40% 60% / 50% 60% 40% 50%",
                }}
              >
                Faire un<br />Don
              </div>
            </a>
          </div>
        </div>

        {/* Barre décorative orange */}
        <div className="absolute top-1/2 left-0 w-full h-24 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 -z-20 transform -translate-y-1/2"></div>
      </div>
    </div>
  )
}
