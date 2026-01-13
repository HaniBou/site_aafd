import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export default async function createReservation(reservationData) {
  try {
    const docRef = await addDoc(collection(db, "reservations"), {
      ...reservationData,
      dateReservation: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    throw error;
  }
}
