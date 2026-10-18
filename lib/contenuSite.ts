import { ASSOCIATION_FOUNDING_YEAR } from '@/lib/siteConfig';

// Textes et photos du site modifiables depuis l'admin (« Pages du site »),
// ranges par page puis par section, dans l'ordre ou ils apparaissent.
// Chaque champ garde sa valeur d'origine tant que l'admin ne l'a pas changee.
//
// Stockage Firestore : photos dans config/photosSite, textes dans
// config/textesSite. Seules les valeurs modifiees y sont enregistrees.
//
// Pour rendre un nouvel element modifiable : ajouter un champ ici, puis lire
// contenu.<cle> dans la page concernee.
//
// Mise en forme des textes (voir components/TexteMisEnForme.tsx) :
// - 'paragraphes' : une ligne vide separe deux paragraphes, **mot** = gras ;
// - 'texte' : une seule ligne ; dans un titre, **mot** = partie en couleur.

type DefChamp<Cle extends string = string> =
  | {
      cle: Cle;
      type: 'photo';
      nom: string;
      aide?: string;
      format: 'paysage' | 'portrait' | 'bandeau';
      defaut: string;
    }
  | {
      cle: Cle;
      type: 'texte' | 'paragraphes';
      nom: string;
      aide?: string;
      defaut: string;
    };

type DefPage<Cle extends string = string> = {
  id: string;
  nom: string;
  chemin: string;
  description: string;
  sections: readonly { titre: string; champs: readonly DefChamp<Cle>[] }[];
};

const AIDE_BANDEAU =
  'Bandeau très large en haut de la page : choisissez une photo en largeur, le haut et le bas seront rognés.';

const DEFINITIONS = [
  {
    id: 'accueil',
    nom: 'Accueil',
    chemin: '/',
    description: 'La page d’arrivée du site',
    sections: [
      {
        titre: 'En haut de la page',
        champs: [
          {
            cle: 'accueil_accroche',
            type: 'texte',
            nom: 'Phrase d’accroche',
            aide: 'Sous le nom de l’association. Entourez de ** la partie à faire ressortir.',
            defaut: `Accompagner, soutenir et créer du lien avec les **familles réfugiées** depuis ${ASSOCIATION_FOUNDING_YEAR}.`,
          },
          {
            cle: 'accueil_hero',
            type: 'photo',
            format: 'paysage',
            nom: 'Grande photo',
            aide: 'La première image que voient les visiteurs. Sur ordinateur elle est en hauteur, sur téléphone en largeur : gardez le sujet bien au centre.',
            defaut: '/images/hero_accueil.webp',
          },
        ],
      },
      {
        titre: 'Qui sommes-nous ?',
        champs: [
          {
            cle: 'accueil_qui_texte',
            type: 'paragraphes',
            nom: 'Texte',
            aide: 'Le lien « En savoir plus sur notre association » reste affiché en dessous.',
            defaut:
              `Nous accompagnons des **familles réfugiées** originaires d'Albanie, du Kosovo, de Bosnie, d'Arménie, d'Algérie, de Guinée, de République Démocratique du Congo et d'autres pays.\n\n` +
              `Nous soutenons également des **jeunes isolés** localisés sur le Val de Saône dans les difficultés matérielles ou administratives qu'ils rencontrent.\n\n` +
              `Les jeunes et les familles sont **associés et participent** activement à nos événements.`,
          },
          {
            cle: 'accueil_qui_sommes_nous',
            type: 'photo',
            format: 'paysage',
            nom: 'Photo',
            aide: 'À côté du texte de présentation de l’association.',
            defaut: '/images/v4.webp',
          },
        ],
      },
      {
        titre: 'Ce qui nous anime',
        champs: [
          { cle: 'accueil_anime_intro', type: 'texte', nom: 'Phrase sous le titre', defaut: 'Accompagner, soutenir et créer du lien avec les familles réfugiées' },
          { cle: 'accueil_anime1_titre', type: 'texte', nom: '1re carte — titre', defaut: 'Sensibiliser' },
          { cle: 'accueil_anime1_texte', type: 'texte', nom: '1re carte — texte', defaut: "Sensibiliser sur la question de l'immigration et comprendre les raisons de l'exil" },
          { cle: 'accueil_sensibiliser', type: 'photo', format: 'paysage', nom: '1re carte — photo', defaut: '/images/help.webp' },
          { cle: 'accueil_anime2_titre', type: 'texte', nom: '2e carte — titre', defaut: 'Créer du lien' },
          { cle: 'accueil_anime2_texte', type: 'texte', nom: '2e carte — texte', defaut: 'Créer des liens amicaux et festifs entre la population locale et les familles réfugiées' },
          { cle: 'accueil_creer_du_lien', type: 'photo', format: 'paysage', nom: '2e carte — photo', defaut: '/images/v5.webp' },
          { cle: 'accueil_anime3_titre', type: 'texte', nom: '3e carte — titre', defaut: 'Récolter des fonds' },
          { cle: 'accueil_anime3_texte', type: 'texte', nom: '3e carte — texte', defaut: "Développer l'aide matérielle : transports, assurances, avocats, hébergement..." },
          { cle: 'accueil_recolter_des_fonds', type: 'photo', format: 'paysage', nom: '3e carte — photo', defaut: '/images/donate.webp' },
        ],
      },
      {
        titre: "L'AAFD en chiffres",
        champs: [
          { cle: 'accueil_chiffre2_valeur', type: 'texte', nom: '2e chiffre — nombre', aide: 'Un nombre, éventuellement suivi d’un signe (ex. 10+, 150, 100%). Il s’anime en comptant depuis 0. Le 1er chiffre (année de création) ne change pas.', defaut: '10+' },
          { cle: 'accueil_chiffre2_libelle', type: 'texte', nom: '2e chiffre — légende', defaut: 'nationalités accompagnées' },
          { cle: 'accueil_chiffre3_valeur', type: 'texte', nom: '3e chiffre — nombre', defaut: '100%' },
          { cle: 'accueil_chiffre3_libelle', type: 'texte', nom: '3e chiffre — légende', defaut: 'bénévoles' },
        ],
      },
      {
        titre: 'Instagram',
        champs: [
          {
            cle: 'accueil_instagram_texte',
            type: 'paragraphes',
            nom: 'Texte de présentation',
            aide: 'Au-dessus des photos de la galerie Instagram.',
            defaut:
              "Les coulisses des ventes de plats, les sorties avec les familles, les appels à bénévoles : on y raconte le quotidien de l'association, en photos. Abonnez-vous et faites-nous connaître autour de vous.",
          },
        ],
      },
      {
        titre: 'Bandeau de fin de page',
        champs: [
          { cle: 'accueil_cta_titre', type: 'texte', nom: 'Titre', defaut: 'Rejoignez notre communauté' },
          { cle: 'accueil_cta_texte', type: 'texte', nom: 'Texte', aide: 'Les boutons « Devenir bénévole » et « Faire un don » restent affichés.', defaut: 'Que vous souhaitiez devenir bénévole, faire un don ou simplement en savoir plus, nous serions ravis de vous accueillir.' },
        ],
      },
    ],
  },
  {
    id: 'notre-association',
    nom: 'Notre association',
    chemin: '/notre-association',
    description: 'Histoire, mot de la présidente, actions et valeurs',
    sections: [
      {
        titre: 'En haut de la page',
        champs: [
          { cle: 'bandeau_notre_association', type: 'photo', format: 'bandeau', nom: 'Bandeau', aide: AIDE_BANDEAU, defaut: '/images/hero_nous_connaitre.webp' },
        ],
      },
      {
        titre: 'Notre histoire',
        champs: [
          {
            cle: 'asso_histoire_texte',
            type: 'paragraphes',
            nom: 'Texte',
            defaut:
              `Depuis **${ASSOCIATION_FOUNDING_YEAR}**, l'Association d'Aide aux Familles en Difficulté œuvre sur le territoire du Val de Saône pour accompagner les personnes en situation de précarité.\n\n` +
              `Nous aidons des familles originaires d'**Albanie, du Kosovo, de Bosnie, d'Arménie, d'Algérie, de Guinée, de République Démocratique du Congo** et d'autres pays.\n\n` +
              `Nos bénévoles accompagnent également des **jeunes isolés** localisés sur le Val de Saône dans les difficultés matérielles ou administratives qu'ils rencontrent au quotidien.`,
          },
          { cle: 'asso_histoire_photo', type: 'photo', format: 'paysage', nom: 'Photo', defaut: '/images/distribution.webp' },
        ],
      },
      {
        titre: 'Le mot de la présidente',
        champs: [
          { cle: 'asso_edito_photo', type: 'photo', format: 'portrait', nom: 'Portrait', aide: 'Photo en hauteur, le visage bien centré. Elle s’affiche en noir et blanc et reprend ses couleurs au survol.', defaut: '/images/hero_actu.webp' },
          { cle: 'asso_edito_nom', type: 'texte', nom: 'Prénom et nom', defaut: '[Prénom Nom]' },
          { cle: 'asso_edito_fonction', type: 'texte', nom: 'Fonction', aide: 'Affichée sous le nom.', defaut: "Présidente de l'AAFD" },
          { cle: 'asso_edito_rubrique', type: 'texte', nom: 'Petit titre de la rubrique', aide: 'Le petit texte bleu en majuscules au-dessus de la citation.', defaut: "L'édito de la présidente" },
          { cle: 'asso_edito_titre', type: 'texte', nom: 'Citation', aide: 'Les guillemets « » sont ajoutés automatiquement. Entourez de ** la partie à mettre en bleu.', defaut: "Au cœur de notre engagement, **l'humain avant tout.**" },
          {
            cle: 'asso_edito_texte',
            type: 'paragraphes',
            nom: 'Texte',
            aide: 'Affiché en italique.',
            defaut:
              `Depuis ${ASSOCIATION_FOUNDING_YEAR}, l'AAFD n'est pas seulement une structure d'aide, c'est un trait d'union. Nous ne nous contentons pas d'accompagner, nous tissons des liens de fraternité qui dépassent les frontières et les parcours de vie.\n\n` +
              `Chaque rencontre est une leçon de courage, chaque projet une pierre ajoutée à notre édifice commun du Val de Saône. Nous vous invitons à partager cette aventure humaine avec nous.`,
          },
        ],
      },
      {
        titre: 'Nos actions — 1. Ventes de plats',
        champs: [
          { cle: 'asso_action1_surtitre', type: 'texte', nom: 'Petit titre (en orange)', defaut: 'Environ tous les 2 mois' },
          { cle: 'asso_action1_titre', type: 'texte', nom: 'Titre', defaut: 'Ventes de plats traditionnels' },
          {
            cle: 'asso_action1_texte',
            type: 'paragraphes',
            nom: 'Texte',
            aide: 'Le bouton « Commander nos plats » reste affiché en dessous.',
            defaut:
              `Environ tous les deux mois, nous organisons des **ventes de plats traditionnels** cuisinés par les familles que nous accompagnons.\n\n` +
              `Une occasion de découvrir les saveurs d'**Albanie, du Kosovo, de Bosnie, d'Arménie, d'Algérie, de Guinée** et d'autres pays, tout en soutenant concrètement nos actions.`,
          },
          { cle: 'asso_action1_photo', type: 'photo', format: 'paysage', nom: 'Photo', defaut: '/images/plats.webp' },
        ],
      },
      {
        titre: 'Nos actions — 2. Événements',
        champs: [
          { cle: 'asso_action2_surtitre', type: 'texte', nom: 'Petit titre (en bleu)', defaut: "Tout au long de l'année" },
          { cle: 'asso_action2_titre', type: 'texte', nom: 'Titre', defaut: 'Événements festifs et sportifs' },
          {
            cle: 'asso_action2_texte',
            type: 'paragraphes',
            nom: 'Texte',
            defaut:
              `Tout au long de l'année, nous organisons des **événements conviviaux** qui rassemblent habitants du Val de Saône, familles réfugiées et sympathisants.\n\n` +
              `Ces moments festifs permettent de créer du lien et de sensibiliser le grand public à la question de l'immigration dans une ambiance chaleureuse.\n\n` +
              `Les fonds récoltés sont intégralement reversés pour financer l'aide matérielle aux familles : transports, assurances, frais d'avocats, hébergement...`,
          },
          { cle: 'asso_action2_photo', type: 'photo', format: 'paysage', nom: 'Photo', defaut: '/images/evenement.webp' },
        ],
      },
      {
        titre: 'Nos actions — 3. Nettoyage',
        champs: [
          { cle: 'asso_action3_surtitre', type: 'texte', nom: 'Petit titre (en vert)', defaut: 'Engagement territorial' },
          { cle: 'asso_action3_titre', type: 'texte', nom: 'Titre', defaut: 'Nettoyons notre Val de Saône' },
          {
            cle: 'asso_action3_texte',
            type: 'paragraphes',
            nom: 'Texte',
            defaut:
              `Au-delà de l'aide aux familles, nous sommes engagés pour notre territoire à travers des **actions de nettoyage** participatives.\n\n` +
              `Ces journées citoyennes permettent de rassembler habitants et familles autour d'un projet commun : **préserver notre cadre de vie**.\n\n` +
              `C'est aussi une occasion de montrer que les familles réfugiées sont actrices du territoire et souhaitent contribuer positivement à la vie locale.`,
          },
          { cle: 'asso_action3_photo', type: 'photo', format: 'paysage', nom: 'Photo', defaut: '/images/nettoyons_1.webp' },
        ],
      },
      {
        titre: 'Accompagnement au quotidien',
        champs: [
          { cle: 'asso_accomp1_titre', type: 'texte', nom: '1er point — titre', defaut: 'Aide aux tâches administratives' },
          { cle: 'asso_accomp1_texte', type: 'texte', nom: '1er point — description', defaut: 'Aide aux démarches administratives de nos familles et accompagnement aux rendez-vous officiels.' },
          { cle: 'asso_accomp2_titre', type: 'texte', nom: '2e point — titre', defaut: 'Logements' },
          { cle: 'asso_accomp2_texte', type: 'texte', nom: '2e point — description', defaut: 'Recherche de logements et aide au financement des cautions et des loyers.' },
          { cle: 'asso_accomp3_titre', type: 'texte', nom: '3e point — titre', defaut: 'Scolarité des enfants' },
          { cle: 'asso_accomp3_texte', type: 'texte', nom: '3e point — description', defaut: 'Suivi de la scolarité des enfants et lien avec les établissements du Val de Saône.' },
        ],
      },
      {
        titre: 'Nos valeurs',
        champs: [
          { cle: 'asso_valeurs_photo', type: 'photo', format: 'paysage', nom: 'Photo', defaut: '/images/ensemble.webp' },
          { cle: 'asso_valeur1_titre', type: 'texte', nom: '1re valeur — nom', defaut: 'Solidarité' },
          { cle: 'asso_valeur1_texte', type: 'texte', nom: '1re valeur — description', defaut: "Nous croyons en l'importance de l'entraide et du soutien mutuel pour construire une société plus juste." },
          { cle: 'asso_valeur2_titre', type: 'texte', nom: '2e valeur — nom', defaut: 'Respect' },
          { cle: 'asso_valeur2_texte', type: 'texte', nom: '2e valeur — description', defaut: "Chaque personne est unique et mérite d'être traitée avec dignité, quelles que soient ses origines." },
          { cle: 'asso_valeur3_titre', type: 'texte', nom: '3e valeur — nom', defaut: 'Participation' },
          { cle: 'asso_valeur3_texte', type: 'texte', nom: '3e valeur — description', defaut: "Les jeunes et les familles sont associés et participent activement aux événements de l'association." },
        ],
      },
    ],
  },
  {
    id: 'actualites',
    nom: 'Actualités',
    chemin: '/actualites',
    description: 'Le bandeau est aussi affiché en haut de chaque article',
    sections: [
      {
        titre: 'En haut de la page',
        champs: [
          { cle: 'bandeau_actualites', type: 'photo', format: 'bandeau', nom: 'Bandeau', aide: AIDE_BANDEAU, defaut: '/images/hero_actu.webp' },
        ],
      },
    ],
  },
  {
    id: 'vente-plats',
    nom: 'Nos plats',
    chemin: '/vente-plats',
    description: 'Page des ventes de plats',
    sections: [
      {
        titre: 'En haut de la page',
        champs: [
          { cle: 'bandeau_vente_plats', type: 'photo', format: 'bandeau', nom: 'Bandeau', aide: AIDE_BANDEAU, defaut: '/images/hero_plats.webp' },
        ],
      },
    ],
  },
  {
    id: 'temoignages',
    nom: 'Témoignages',
    chemin: '/temoignages',
    description: 'Témoignages et galerie de photos',
    sections: [
      {
        titre: 'En haut de la page',
        champs: [
          { cle: 'bandeau_temoignages', type: 'photo', format: 'bandeau', nom: 'Bandeau', aide: AIDE_BANDEAU, defaut: '/images/hero_temoignages.webp' },
        ],
      },
    ],
  },
  {
    id: 'nous-rejoindre',
    nom: 'Nous rejoindre',
    chemin: '/nous-rejoindre',
    description: 'Devenir bénévole',
    sections: [
      {
        titre: 'En haut de la page',
        champs: [
          { cle: 'bandeau_nous_rejoindre', type: 'photo', format: 'bandeau', nom: 'Bandeau', aide: AIDE_BANDEAU, defaut: '/images/hero_nous_rejoindre.webp' },
        ],
      },
    ],
  },
  {
    id: 'contact',
    nom: 'Contact',
    chemin: '/contact',
    description: 'Coordonnées et formulaire',
    sections: [
      {
        titre: 'En haut de la page',
        champs: [
          { cle: 'bandeau_contact', type: 'photo', format: 'bandeau', nom: 'Bandeau', aide: AIDE_BANDEAU, defaut: '/images/hero_contact.webp' },
        ],
      },
    ],
  },
] as const satisfies readonly DefPage[];

// Les cles exactes sont deduites des definitions : une faute de frappe dans
// contenu.<cle> est signalee par TypeScript.
export type CleContenu =
  (typeof DEFINITIONS)[number]['sections'][number]['champs'][number]['cle'];
export type ContenuSite = Record<CleContenu, string>;
export type PageSite = DefPage<CleContenu>;
export type ChampContenu = DefChamp<CleContenu>;

export const PAGES_SITE: readonly PageSite[] = DEFINITIONS;

export const TEXTE_MAX = 5000;

export function champsDePage(page: PageSite): readonly ChampContenu[] {
  return page.sections.flatMap(section => section.champs);
}

const TOUS_LES_CHAMPS: readonly ChampContenu[] = PAGES_SITE.flatMap(champsDePage);

export function trouverPage(id: string): PageSite | undefined {
  return PAGES_SITE.find(page => page.id === id);
}

// Garde uniquement les valeurs modifiees valides d'un document Firestore brut.
export function lireContenuPersonnalise(
  data: Record<string, unknown> | undefined,
): Partial<ContenuSite> {
  const out: Partial<ContenuSite> = {};
  for (const { cle } of TOUS_LES_CHAMPS) {
    const valeur = data?.[cle];
    if (typeof valeur === 'string' && valeur) out[cle] = valeur;
  }
  return out;
}

export function completerContenu(personnalise: Partial<ContenuSite>): ContenuSite {
  const contenu = {} as ContenuSite;
  for (const { cle, defaut } of TOUS_LES_CHAMPS) {
    contenu[cle] = personnalise[cle] ?? defaut;
  }
  return contenu;
}
