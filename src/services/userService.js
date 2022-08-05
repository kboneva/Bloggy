import { ref, child, get, push, set } from "firebase/database"
import { db } from "../firebase"

const usersRef = ref(db, 'users');

export const getAll = async () => {
    const snapshot = await get(child(usersRef));
    if (snapshot.exists()) {
        return snapshot.val();
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

export const addNewUser = async (username, email, password) => {
    const newUserRef = push(usersRef);
    await set(newUserRef, {
        username: username,
        email: email,
        password: password
    })
}