import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default async function getActualites() {
  const querySnapshot = await getDocs(collection(db, "actualites"));

  const result = [];
  querySnapshot.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() });
  });

  console.log(result);
}
