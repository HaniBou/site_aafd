import type { LigneCommande } from '@/types';

// Nombre maximum de portions d'un meme plat dans une commande.
export const MAX_PAR_PLAT = 4;

// Garde-fou contre les envois abusifs : nombre de plats differents par commande.
export const MAX_LIGNES = 30;

// Lignes d'un document de commande Firestore brut. Les reservations creees
// avant le panier (un seul plat : platId, platNom, quantite a la racine)
// deviennent une commande d'une ligne.
export function lignesDeCommande(data: Record<string, unknown>): LigneCommande[] {
  if (Array.isArray(data.lignes)) {
    return (data.lignes as Record<string, unknown>[]).map(ligne => ({
      platId: String(ligne.platId ?? ''),
      platNom: String(ligne.platNom ?? ''),
      quantite: Number(ligne.quantite) || 0,
      ...(typeof ligne.prixUnitaire === 'number' && { prixUnitaire: ligne.prixUnitaire }),
    }));
  }
  return [{
    platId: String(data.platId ?? ''),
    platNom: String(data.platNom ?? ''),
    quantite: Number(data.quantite) || 0,
  }];
}

export function nombrePortions(lignes: LigneCommande[]): number {
  return lignes.reduce((somme, ligne) => somme + ligne.quantite, 0);
}

// « 2 × Börek, 1 × Baklava »
export function resumeLignes(lignes: LigneCommande[]): string {
  return lignes.map(ligne => `${ligne.quantite} × ${ligne.platNom}`).join(', ');
}

export function formatPrix(montant: number): string {
  return `${montant.toFixed(2).replace('.', ',')} €`;
}
