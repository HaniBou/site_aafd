export function getCategoryStyles(category: string): string {
  switch (category) {
    case "Actualité":
      return "bg-blue-500 text-white";
    case "Vente":
      return "bg-orange-500 text-white";
    case "Événement":
      return "bg-green-500 text-white";
    case "Annonce":
      return "bg-gray-500 text-white";
    default:
      return "bg-blue-500 text-white";
  }
}
