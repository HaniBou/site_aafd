import getActualites from "../lib/getActualites.js";

(async () => {
  try {
    const actualites = await getActualites();
    console.log("Actualités récupérées :", actualites);
  } catch (error) {
    console.error("Erreur lors de la récupération des actualités :", error);
  }
})();