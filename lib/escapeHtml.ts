// Les champs saisis par les visiteurs sont interpolés dans le HTML des emails :
// sans échappement, un visiteur peut y injecter des balises ou des liens.
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
