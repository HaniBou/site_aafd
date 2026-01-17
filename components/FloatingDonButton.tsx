'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function FloatingDonButton() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isAdminPage = pathname?.startsWith('/admin')

  // Ne pas afficher sur les pages admin
  if (isAdminPage) {
    return null
  }

  useEffect(() => {
    // Sur la page d'accueil, apparaît après scroll
    // Sur les autres pages, toujours visible
    if (!isHomePage) {
      setIsVisible(true)
      return
    }

    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 300)
          ticking = false
        })
        ticking = true
      }
    }
    
    handleScroll() // Check initial position
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  return (
    <a
      href="https://www.helloasso.com/associations/association-d-aide-aux-familles-en-difficulte-en-val-de-saone"
      target="_blank"
      rel="noopener noreferrer"
      style={{ willChange: isVisible ? 'auto' : 'transform, opacity' }}
      className={`fixed bottom-14 right-6 md:bottom-18 md:right-8 z-[50] group transition-all duration-500 ease-out ${
        isVisible 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
      }`}>
    
      {/* Blob Rose de fond (décalé) */}
      <div 
        className="absolute inset-0 bg-pink-300 opacity-40 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105"
        style={{
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          transform: "translate(6px, 6px)",
          width: '112px',
          height: '112px',
          willChange: 'transform'
        }}
      ></div>

      {/* Blob Rose principal (Bouton) */}
      <div 
        className="relative w-28 h-28 flex flex-col items-center justify-center text-white font-bold text-center text-sm uppercase tracking-wide leading-tight transition-transform duration-300 hover:-translate-y-1 active:scale-95 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #ec4899, #db2777)",
          borderRadius: "50% 50% 40% 60% / 50% 60% 40% 50%",
          willChange: 'transform'
        }}
      >
        Faire un<br />Don
        <svg className="w-5 h-5 mt-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      </div>
    </a>
  )
}
