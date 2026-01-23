import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.js";

/**
 * Upload une actualité dans Firestore
 */
export default async function uploadActualite(actualite) {
  try {
    // 1. Génération propre du slug
    const slug = actualite.slug || actualite.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^a-z0-9\s-]/g, "") 
      .trim()
      .replace(/\s+/g, "-");

    // 2. Construction de l'objet final
    // On s'assure que les valeurs par défaut sont appliquées
    const finalData = {
      title: actualite.title,
      content: actualite.content,
      category: actualite.category || "Actualité",
      image: actualite.image || "none",
      date: actualite.date || new Date().toISOString(),
      slug: slug,
      aLaUne: Boolean(actualite.aLaUne), // Force en true/false
      uploadedAt: serverTimestamp(), // Utilise l'heure du serveur Firebase (plus fiable)
    };

    const docRef = await addDoc(collection(db, "actualites"), finalData);
    console.log("Actualité enregistrée avec ID :", docRef.id);
    return docRef.id;
    
  } catch (error) {
    console.error("Erreur uploadActualite :", error);
    throw error;
  }
}