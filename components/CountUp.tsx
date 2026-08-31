'use client';

import { useEffect, useRef } from 'react';

type Props = {
  value: number;
  suffix?: string;
  durationMs?: number;
};

/**
 * Compte de 0 jusqu'à `value` quand le chiffre entre dans le viewport.
 *
 * La valeur finale est rendue côté serveur : sans JavaScript, ou en
 * `prefers-reduced-motion`, le chiffre s'affiche simplement, sans animation.
 */
export function CountUp({ value, suffix = '', durationMs = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') return;

    let frame = 0;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];

        if (!entry.isIntersecting) {
          // Encore hors écran : on repart de zéro pour que l'animation se voie.
          el.textContent = `0${suffix}`;
          return;
        }

        observer.disconnect();
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ralentit à l'arrivée
          el.textContent = `${Math.round(value * eased)}${suffix}`;
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, suffix, durationMs]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
