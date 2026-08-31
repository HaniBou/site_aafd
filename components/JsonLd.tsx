/**
 * Données structurées schema.org.
 *
 * `<` est échappé en < : sans ça, un titre d'article contenant « </script> »
 * fermerait la balise et injecterait du HTML dans la page.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
