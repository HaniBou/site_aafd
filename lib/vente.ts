import type { Vente } from '@/types';

const FUSEAU = 'Europe/Paris';

export type EtatVente = 'brouillon' | 'ouverte' | 'commandes-closes' | 'fermee';

export type VenteAvecEtat = Vente & { etat: EtatVente };

export type VenteResume = Vente & {
  etat: EtatVente;
  nbPlats: number;
  nbCommandes: number;
};

export const ETAT_VENTE_LABEL: Record<EtatVente, string> = {
  brouillon: 'Brouillon',
  ouverte: 'Commandes ouvertes',
  'commandes-closes': 'Commandes closes',
  fermee: 'Clôturée',
};

function toDate(iso?: string | null): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function limiteCommandeDepassee(vente: Vente, now: Date = new Date()): boolean {
  const limite = toDate(vente.dateLimiteCommande);
  return limite !== null && limite.getTime() <= now.getTime();
}

export function venteEstOuverte(
  vente: Vente | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!vente || vente.statut !== 'ouverte') return false;
  return !limiteCommandeDepassee(vente, now);
}

export function etatVente(vente: Vente, now: Date = new Date()): EtatVente {
  if (vente.statut === 'brouillon') return 'brouillon';
  if (vente.statut === 'fermee') return 'fermee';
  return limiteCommandeDepassee(vente, now) ? 'commandes-closes' : 'ouverte';
}

export function retraitAVenir(vente: Vente, now: Date = new Date()): boolean {
  const retrait = toDate(vente.dateRetrait);
  return retrait !== null && retrait.getTime() > now.getTime();
}

export function formatDateHeure(iso?: string): string {
  const date = toDate(iso);
  if (!date) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: FUSEAU,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateCompacte(iso?: string): string {
  const date = toDate(iso);
  if (!date) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: FUSEAU,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateJour(iso?: string): string {
  const date = toDate(iso);
  if (!date) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: FUSEAU,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function toDateTimeLocalValue(iso?: string): string {
  const date = toDate(iso);
  if (!date) return '';
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: FUSEAU,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find(part => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

export function fromDateTimeLocalValue(value: string): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}
