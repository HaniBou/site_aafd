import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.js";

/**
 * Upload un temoignage dans Firestore
 */
export default async function uploadTemoignage(temoignage) {
  try {
    const finalData = {
      nom: temoignage.nom,
      contenu: temoignage.contenu,
      type: temoignage.type,
      role: temoignage.role || "",
      image: temoignage.image || "none",
      date: temoignage.date || new Date().toISOString(),
      uploadedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "temoignages"), finalData);
    return docRef.id;
  } catch (error) {
    console.error("Erreur uploadTemoignage :", error);
    throw error;
  }
}
