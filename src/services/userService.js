import { ref, child, get, set } from "firebase/database"
import { db } from "../firebase"

const usersRef = ref(db, 'users');

export const getAll = async () => {
    const snapshot = await get(child(usersRef));
    if (snapshot.exists()) {
        return Object.entries(snapshot.val()).map(([id, user]) => {
            return {
                _id: id,
                ...user
            }
        })
    }
    else {
        console.log("No data available");
    }
}

export const getUserById = async (_id) => {
    const snapshot = await get(child(usersRef, _id));
    if (snapshot.exists()) {
        return snapshot.val();
    }
    else {
        console.log("No data available");
    }
}

export const addNewUser = async (_id, username) => {
    const newUserRef = ref(db, "users/" + _id);
    await set(newUserRef, {
        username: username
    })
}