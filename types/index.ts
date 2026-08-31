export type Plat = {
  id: string;
  nom: string;
  typeMenu?: string;
  cuisiniers?: string;
  description: string;
  items?: string[];
  quantite: number;
  prix: number;
  image?: string;
  dateAjout?: string;
  /** Vente terminée : le plat n'est plus proposé sur le site public. */
  cloture?: boolean;
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

export type Reservation = {
  id: string;
  platNom: string;
  platId: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  quantite: number;
  message?: string;
  dateReservation: string;
  emailEnvoye?: boolean;
  emailErreur?: string | null;
};

/** Photo de la galerie « Moments partagés » (page Témoignages). */
export type Moment = {
  id: string;
  titre: string;
  image: string;
  date: string;
  uploadedAt?: string;
};
