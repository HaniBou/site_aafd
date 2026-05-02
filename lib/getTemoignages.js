import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

export default async function getTemoignages() {
  const querySnapshot = await getDocs(collection(db, "temoignages"));

  const result = [];
  querySnapshot.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() });
  });

  return result;
}
