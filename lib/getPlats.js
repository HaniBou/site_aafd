import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

export default async function getPlats() {
  const querySnapshot = await getDocs(collection(db, "plats"));

  const result = [];
  querySnapshot.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() });
  });

  return result;
}
