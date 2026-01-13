import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

export default async function getReservations() {
  const q = query(collection(db, "reservations"), orderBy("dateReservation", "desc"));
  const querySnapshot = await getDocs(q);
  const reservations = [];
  
  querySnapshot.forEach((doc) => {
    reservations.push({
      id: doc.id,
      ...doc.data()
    });
  });
  
  return reservations;
}
