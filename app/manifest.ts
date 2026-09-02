import type { MetadataRoute } from 'next';

/**
 * Rend le site installable ("Ajouter à l'écran d'accueil" sur mobile, "Installer"
 * dans Chrome sur ordinateur). Le raccourci « Espace bénévoles » ouvre directement
 * l'administration : une icône à cliquer, aucune adresse à taper.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AAFD Val de Saône - Association d'Aide aux Familles en Difficulté",
    short_name: 'AAFD',
    description:
      "L'AAFD accompagne les familles réfugiées sur le Val de Saône : actualités, vente de plats et événements.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1f2937',
    lang: 'fr',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name: 'Espace bénévoles',
        short_name: 'Bénévoles',
        description: "Gérer le contenu du site (réservé aux bénévoles)",
        url: '/admin',
        icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],
  };
}
