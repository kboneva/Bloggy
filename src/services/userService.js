import { ref, child, get } from "firebase/database"
import { db } from "../firebase"

const dbRef = ref(db);

export const getAll = async () => {
    const snapshot = await get(child(dbRef, "users/"));
    if (snapshot.exists()) {
        return snapshot.val();
    }
    else {
        console.log("No data available");
    }
}

export const getUserById = async ({_id}) => {
    const snapshot = await get(child(dbRef, "users/" + _id));
    if (snapshot.exists()) {
        return snapshot.val();
    }
    else {
        console.log("No data available");
    }
}