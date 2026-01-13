import { doc, deleteDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

export default async function annulerReservation(reservationId) {
  try {
    // 1. Récupérer les infos de la réservation
    const reservationDoc = await getDoc(doc(db, "reservations", reservationId));
    if (!reservationDoc.exists()) {
      throw new Error("Réservation introuvable");
    }
    
    const reservationData = reservationDoc.data();
    
    // 2. Remettre la quantité dans le stock du plat
    const platRef = doc(db, "plats", reservationData.platId);
    await updateDoc(platRef, {
      quantite: increment(reservationData.quantite)
    });
    
    // 3. Supprimer la réservation
    await deleteDoc(doc(db, "reservations", reservationId));
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'annulation:", error);
    throw error;
  }
}
