export function getCategoryStyles(category: string): string {
  switch (category) {
    case "Actualité":
      return "bg-blue-700 text-white";
    case "Vente":
      return "bg-orange-700 text-white";
    case "Événement":
      return "bg-emerald-700 text-white";
    case "Annonce":
      return "bg-gray-500 text-white";
    default:
      return "bg-blue-700 text-white";
  }
}
