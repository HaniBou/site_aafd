'use client';

import { useEffect, useRef } from 'react';

type Props = {
  children: React.ReactNode;
  /** Décalage en ms, pour faire apparaître une grille en cascade. */
  delay?: number;
  className?: string;
};

/**
 * Fait apparaître son contenu quand il entre dans le viewport.
 *
 * Le contenu est bien présent dans le HTML servi (seule l'opacité change),
 * donc aucun impact SEO. On manipule la classe directement plutôt que de
 * passer par un state React : pas de re-rendu, et pas de setState dans un effet.
 */
export function Reveal({ children, delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Filet de sécurité : sans IntersectionObserver, on affiche tout de suite
    // plutôt que de laisser le contenu invisible.
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('reveal-in');
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('reveal-in');
            observer.disconnect();
          }
        }
      },
      // -8% en bas : l'animation se déclenche quand l'élément est franchement
      // entré dans l'écran, pas dès que son premier pixel affleure.
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
