'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Marqueur de session, effacé à la fermeture de l'onglet. Il sert uniquement à
// distinguer « une visite » de « une page consultée » : aucune valeur
// identifiante n'y est écrite, et rien n'en sort vers le serveur hormis un
// booléen.
const CLE_SESSION = 'aafd_visite_comptee';

/**
 * Signale au serveur chaque page consultée, pour le compteur de fréquentation
 * affiché aux bénévoles dans l'espace d'administration.
 *
 * Sans cookie et sans donnée personnelle : la mesure reste agrégée, donc
 * exemptée de consentement. C'est ce qui permet au site de ne présenter aucune
 * bannière et de compter malgré tout 100 % des visiteurs.
 */
export function CompteurVisites() {
  const pathname = usePathname();
  const dernierChemin = useRef<string | null>(null);

  useEffect(() => {
    // Garde-fou contre le double appel des effets en mode strict, et contre les
    // rendus qui ne changent pas la route.
    if (dernierChemin.current === pathname) return;
    dernierChemin.current = pathname;

    let nouvelleVisite = false;
    try {
      nouvelleVisite = sessionStorage.getItem(CLE_SESSION) === null;
      if (nouvelleVisite) sessionStorage.setItem(CLE_SESSION, '1');
    } catch {
      // Navigation privée ou stockage bloqué : la page est comptée comme vue,
      // mais pas comme nouvelle visite. Sous-estimer vaut mieux que gonfler.
    }

    fetch('/api/stats/vue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chemin: pathname,
        nouvelleVisite,
        // Seul le nom de domaine sera conservé, et uniquement à l'entrée sur le
        // site : c'est ce qui permet de savoir si Instagram amène du monde.
        referent: nouvelleVisite ? document.referrer : '',
      }),
      keepalive: true,
    }).catch(() => {
      // Hors ligne ou requête bloquée : le compteur n'est pas critique.
    });
  }, [pathname]);

  return null;
}

export default CompteurVisites;
