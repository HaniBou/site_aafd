import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase.js";

/**
 * Upload une actualité dans Firestore
 * @param {Object} actualite - Les données de l'actualité à ajouter
 * @param {string} actualite.title - Le titre de l'actualité
 * @param {string} actualite.content - Le contenu de l'actualité
 * @param {string} [actualite.category] - La catégorie de l'actualité
 * @param {string} [actualite.image] - L'URL de l'image associée (optionnel)
 * @param {string} [actualite.slug] - Le slug pour l'URL (optionnel, généré automatiquement si absent)
 * @returns {Promise<string>} - L'ID du document ajouté
 */
export default async function uploadActualite(actualite) {
  try {
    // Générer un slug automatiquement si non fourni
    const slug = actualite.slug || actualite.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Retirer les accents
      .replace(/[^a-z0-9\s-]/g, "") // Retirer les caractères spéciaux
      .trim()
      .replace(/\s+/g, "-"); // Remplacer les espaces par des tirets

    const actualiteWithDate = {
      ...actualite,
      slug,
      date: new Date().toISOString(), // Ajout de la date actuelle
      category: actualite.category || "Actualité", // Catégorie par défaut
    };
    const docRef = await addDoc(collection(db, "actualites"), actualiteWithDate);
    console.log("Actualité ajoutée avec l'ID :", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'actualité :", error);
    throw error;
  }
}