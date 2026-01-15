import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase.js";

/**
 * Upload un plat dans Firestore
 * @param {Object} plat - Les données du plat à ajouter
 * @param {string} plat.nom - Le nom du plat
 * @param {string} plat.description - La description du plat
 * @param {number} plat.quantite - La quantité disponible
 * @param {number} plat.prix - Le prix du plat
 * @param {string} [plat.image] - L'URL de l'image associée (optionnel)
 * @returns {Promise<string>} - L'ID du document ajouté
 */
export default async function uploadPlat(plat) {
  try {
    const platWithDate = {
      ...plat,
      dateAjout: new Date().toISOString(), // Ajout de la date de création
    };
    const docRef = await addDoc(collection(db, "plats"), platWithDate);
    console.log("Plat ajouté avec l'ID :", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout du plat :", error);
    throw error;
  }
}
