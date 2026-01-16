'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export function HeroWithHeader() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      
      {/* Header partie haute avec logo et boutons */}
      <div className="relative pt-6 pb-8">
        <div className="mx-auto max-w-[1920px] w-full px-6 lg:px-12">
          <div className="flex items-center justify-between max-w-full">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start flex-shrink-0">
              <Link href="/" className="relative group">
                {/* Cercle blanc en fond */}
                <div className="absolute inset-0 -inset-4 bg-white rounded-full opacity-90 shadow-lg transition-transform group-hover:scale-105"></div>
                <Image 
                  src="/images/test-logo.webp" 
                  alt="AAFD Logo" 
                  width={140} 
                  height={140}
                  className="relative z-10 object-contain transition-transform group-hover:scale-105 drop-shadow-xl"
                />
              </Link>
            </div>

            {/* Boutons CTA en forme de blobs - Superposés */}
            <div className="hidden lg:flex items-center flex-shrink-0 ml-auto">
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
                className={`inline-block group transition-all duration-500 ${
                  isScrolled 
                    ? 'fixed bottom-8 right-8 z-50' 
                    : 'relative z-20 -ml-8'
                }`}
              >
                {/* Blob Rose de fond (décalé) */}
                <div 
                  className={`absolute inset-0 bg-pink-300 opacity-40 transition-all duration-900 group-hover:rotate-6 group-hover:scale-105`}
                  style={{
                    borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                    transform: "translate(6px, 6px)"
                  }}
                ></div>

                {/* Blob Rose principal (Bouton) */}
                <div 
                  className={`relative flex items-center justify-center text-white font-bold text-center uppercase tracking-wide leading-tight transition-all duration-900 hover:-translate-y-1 active:scale-95 shadow-2xl ${
                    isScrolled 
                      ? 'w-28 h-28 text-sm px-5 py-5' 
                      : 'w-36 h-36 text-sm px-8 py-6'
                  }`}
                  style={{
                    background: "linear-gradient(135deg, #ec4899, #db2777)",
                    borderRadius: "50% 50% 40% 60% / 50% 60% 40% 50%",
                  }}
                >
                  {isScrolled ? (
                    'Faire un Don'
                  ) : (
                    <>
                      Faire un<br />Don
                    </>
                  )}
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Hero - Titre et texte */}
      <div className="relative pb-12 md:pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Association d&apos;Aide aux Familles en Difficulté Val de Saône
            </h1>
            <p className="mb-8 text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Depuis 17 ans, nous accompagnons des familles réfugiées et des jeunes isolés
              sur le Val de Saône dans leurs difficultés matérielles et administratives.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
