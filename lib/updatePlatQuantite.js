import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export default async function updatePlatQuantite(platId, quantiteReservee) {
  try {
    const platRef = doc(db, "plats", platId);
    
    // Vérifier la quantité disponible avant de décrémenter
    const platDoc = await getDoc(platRef);
    if (!platDoc.exists()) {
      throw new Error("Plat introuvable");
    }
    
    const currentQuantite = platDoc.data().quantite || 0;
    if (currentQuantite < quantiteReservee) {
      throw new Error("Quantité insuffisante");
    }
    
    // Décrémenter la quantité
    await updateDoc(platRef, {
      quantite: increment(-quantiteReservee)
    });
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la quantité:", error);
    throw error;
  }
}
