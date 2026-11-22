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

// Pour les textes longs (mentions legales), en plus de Paragraphes :
// - un bloc dont toutes les lignes commencent par « - » devient une liste ;
// - un bloc entierement entre ** devient un sous-titre.
const MOTIF_SOUS_TITRE = /^\*\*([^*\n]+)\*\*$/
const MOTIF_PUCE = /^-\s+/

export function TexteStructure({ texte }: { texte: string }) {
  return (
    <>
      {texte
        .split(/\n\s*\n/)
        .map(bloc => bloc.trim())
        .filter(Boolean)
        .map((bloc, i) => {
          const sousTitre = bloc.match(MOTIF_SOUS_TITRE)
          if (sousTitre) {
            return <h3 key={i} className="text-lg font-semibold text-gray-900 mt-6 mb-2">{sousTitre[1]}</h3>
          }
          const lignes = bloc.split('\n').map(ligne => ligne.trim())
          if (lignes.every(ligne => MOTIF_PUCE.test(ligne))) {
            return (
              <ul key={i} className="list-disc pl-6 mt-2 space-y-1">
                {lignes.map((ligne, j) => (
                  <li key={j}><EnLigne texte={ligne.replace(MOTIF_PUCE, '')} /></li>
                ))}
              </ul>
            )
          }
          return <p key={i} className="mt-3 first:mt-0"><EnLigne texte={bloc} /></p>
        })}
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
