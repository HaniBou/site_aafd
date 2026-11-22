export type StatutVente = 'brouillon' | 'ouverte' | 'fermee';

export type Vente = {
  id: string;
  titre: string;
  statut: StatutVente;
  dateLimiteCommande?: string;
  dateRetrait?: string;
  lieuRetrait?: string;
  message?: string;
  createdAt?: string;
};

export type Plat = {
  id: string;
  venteId?: string;
  nom: string;
  typeMenu?: string;
  cuisiniers?: string;
  description: string;
  items?: string[];
  quantite: number;
  prix: number;
  image?: string;
  dateAjout?: string;
};

export type Actualite = {
  id: string;
  title: string;
  date: string;
  content: string;
  category: string;
  slug?: string;
  image?: string;
  aLaUne?: boolean;
  uploadedAt?: string;
};

export type Temoignage = {
  id: string;
  nom: string;
  role?: string;
  type: 'Famille accompagnee' | 'Benevole';
  contenu: string;
  image?: string;
  date: string;
};

export type LigneCommande = {
  platId: string;
  platNom: string;
  quantite: number;
  prixUnitaire?: number;
};

// Une commande (document de la collection « reservations ») peut contenir
// plusieurs plats. Les anciennes reservations a un seul plat sont converties
// en une ligne a la lecture (voir lignesDeCommande dans lib/commande.ts).
export type Reservation = {
  id: string;
  venteId?: string;
  venteTitre?: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  lignes: LigneCommande[];
  total?: number;
  message?: string;
  dateReservation: string;
  emailEnvoye?: boolean;
  emailErreur?: string | null;
};

export type Moment = {
  id: string;
  titre: string;
  image: string;
  date: string;
  uploadedAt?: string;
};
