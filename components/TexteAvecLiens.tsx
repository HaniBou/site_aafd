import { Fragment } from 'react'

// Rend cliquables les liens ecrits en texte brut dans un contenu saisi par
// l'admin : https://..., www.... et adresses e-mail. Le reste du texte est
// affiche tel quel (React l'echappe, aucun HTML n'est interprete).
const MOTIF_LIEN =
  /(https?:\/\/[^\s<>"]+|www\.[^\s<>"]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g

// La ponctuation collee a la fin d'un lien ("voir www.site.fr.") n'en fait
// pas partie. Une parenthese fermante n'est gardee que si le lien l'a ouverte.
function compter(texte: string, car: string): number {
  return texte.split(car).length - 1
}

function separerPonctuationFinale(lien: string): [string, string] {
  let fin = lien.length
  while (fin > 0) {
    const car = lien[fin - 1]
    const debut = lien.slice(0, fin)
    if ('.,;:!?\'"»'.includes(car)) {
      fin--
    } else if (car === ')' && compter(debut, ')') > compter(debut, '(')) {
      fin--
    } else {
      break
    }
  }
  return [lien.slice(0, fin), lien.slice(fin)]
}

function hrefPour(lien: string): string {
  if (lien.includes('@') && !lien.includes('/')) return `mailto:${lien}`
  if (lien.startsWith('www.')) return `https://${lien}`
  return lien
}

export function TexteAvecLiens({ texte }: { texte: string }) {
  const morceaux = texte.split(MOTIF_LIEN)

  return (
    <>
      {morceaux.map((morceau, i) => {
        // split avec un groupe capturant : les indices impairs sont les liens.
        if (i % 2 === 0) return <Fragment key={i}>{morceau}</Fragment>

        const [lien, reste] = separerPonctuationFinale(morceau)
        const href = hrefPour(lien)
        const externe = !href.startsWith('mailto:')

        return (
          <Fragment key={i}>
            <a
              href={href}
              {...(externe ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="text-blue-700 underline underline-offset-2 hover:text-blue-900 [overflow-wrap:anywhere]"
            >
              {lien}
            </a>
            {reste}
          </Fragment>
        )
      })}
    </>
  )
}
