'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function FloatingDonButton() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    // Sur la page d'accueil, apparaît après scroll
    // Sur les autres pages, toujours visible
    if (!isHomePage) {
      setIsVisible(true)
      return
    }

    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }
    handleScroll() // Check initial position
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  if (!isVisible) return null

  return (
    <a
      href="https://www.helloasso.com/associations/association-d-aide-aux-familles-en-difficulte-en-val-de-saone"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[50] group">
    
      {/* Blob Rose de fond (décalé) */}
      <div 
        className="absolute inset-0 bg-pink-300 opacity-40 transition-all duration-500 group-hover:rotate-6 group-hover:scale-105"
        style={{
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          transform: "translate(6px, 6px)",
          width: '112px',
          height: '112px'
        }}
      ></div>

      {/* Blob Rose principal (Bouton) */}
      <div 
        className="relative w-28 h-28 flex items-center justify-center text-white font-bold text-center text-sm uppercase tracking-wide leading-tight transition-all duration-500 hover:-translate-y-1 active:scale-95 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #ec4899, #db2777)",
          borderRadius: "50% 50% 40% 60% / 50% 60% 40% 50%",
        }}
      >
        Faire un<br />Don
      </div>
    </a>
  )
}
