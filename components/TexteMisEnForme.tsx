import { Fragment } from 'react'
import { TexteAvecLiens } from '@/components/TexteAvecLiens'

// Mise en forme des textes saisis dans l'admin (« Pages du site ») :
// une ligne vide separe deux paragraphes, **mot** met en valeur, et les liens
// ecrits en clair deviennent cliquables. Aucun HTML n'est interprete.

const MOTIF_VALEUR = /\*\*(.+?)\*\*/g

function EnLigne({ texte }: { texte: string }) {
  // split avec un groupe capturant : les indices impairs sont en gras.
  return (
    <>
      {texte.split(MOTIF_VALEUR).map((morceau, i) =>
        i % 2 === 1 ? (
          <strong key={i}><TexteAvecLiens texte={morceau} /></strong>
        ) : (
          <Fragment key={i}>
            {morceau.split('\n').map((ligne, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                <TexteAvecLiens texte={ligne} />
              </Fragment>
            ))}
          </Fragment>
        ),
      )}
    </>
  )
}

export function Paragraphes({ texte, className }: { texte: string; className?: string }) {
  return (
    <>
      {texte
        .split(/\n\s*\n/)
        .map(paragraphe => paragraphe.trim())
        .filter(Boolean)
        .map((paragraphe, i) => (
          <p key={i} className={className}><EnLigne texte={paragraphe} /></p>
        ))}
    </>
  )
}

// Pour les titres : **partie** est affichee avec classeValeur (une couleur).
export function TitreMisEnValeur({ texte, classeValeur }: { texte: string; classeValeur: string }) {
  return (
    <>
      {texte.split(MOTIF_VALEUR).map((morceau, i) =>
        i % 2 === 1 ? (
          <span key={i} className={classeValeur}>{morceau}</span>
        ) : (
          <Fragment key={i}>{morceau}</Fragment>
        ),
      )}
    </>
  )
}
