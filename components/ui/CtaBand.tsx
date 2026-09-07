import type { ReactNode } from 'react'

type Props = {
  title: ReactNode
  description?: ReactNode
  /** Les boutons de l'appel à l'action, en général un `primary` et un `onDark`. */
  children: ReactNode
}

/**
 * Bandeau d'appel à l'action de fin de page.
 *
 * Le fond, le rythme vertical, la largeur du conteneur et l'échelle
 * typographique sont fixés ici : ce bandeau était recopié sur sept pages et
 * avait dérivé (un fond en dégradé au lieu d'un aplat, quatre hauteurs
 * différentes). La classe `on-dark` fait passer l'anneau de focus en blanc.
 */
export function CtaBand({ title, description, children }: Props) {
  return (
    <section className="on-dark bg-blue-900 py-16 md:py-20 text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2>{title}</h2>
        {description && (
          <p className="mb-8 text-body-large text-blue-100">{description}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {children}
        </div>
      </div>
    </section>
  )
}

export default CtaBand
