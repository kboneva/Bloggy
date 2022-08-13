import { ref, get, query, set, orderByChild, equalTo, child, update } from "firebase/database"
import { db } from "../firebase"

const usersRef = ref(db, 'users');

// export const getAllUsers = async () => {
//     const snapshot = await get(child(usersRef));
//     if (snapshot.exists()) {
//         return Object.entries(snapshot.val()).map(([id, user]) => {
//             return {
//                 _id: id,
//                 ...user
//             }
//         })
//     }
//     else {
//         console.log("No data available");
//     }
// }

export const getUserByName = async (username) => {
    const snapshot = await get(query(usersRef, orderByChild('username'), equalTo(username)));
    if (snapshot.exists()) {
        return Object.entries(snapshot.val()).map(([id, user]) => {
            return {
                _id: id,
                ...user
            }
        })[0]
    }
    else {
        return null;
    }
}

export const getUserById = async (_id) => {
    const snapshot = await get(child(usersRef, _id));
    if (snapshot.exists()) {
        return snapshot.val()
    }
    else {
        return null;
    }
}

export const addNewUser = async (_id, username) => {
    const newUserRef = ref(db, "users/" + _id);
    await set(newUserRef, {
        username: username,
        avatar: "https://firebasestorage.googleapis.com/v0/b/webforum-7c715.appspot.com/o/avatars%2FAvatar.jpg?alt=media&token=d628093d-6b1f-4bf8-92c7-761cbe7b82bd",
        darkTheme: false,
        theme: "blue",
        allPostPreference: true
    })
}

export const isDarkTheme = async (currentId) => {
    const snapshot = await get(ref(db, "users/" + currentId + "/darkTheme"));
    return snapshot.exists() ? snapshot.val() : false;
}

export const updateThemePreference = async (currentId) => {
    const currentValue = await isDarkTheme(currentId)
    await update(ref(db, "users/" + currentId), {
        darkTheme: !currentValue
    })
}

export const isUsernameUnique = async (username) => {
    const snapshot = await get(query(usersRef, orderByChild('username'), equalTo(username)));
    if (snapshot.exists()) {
        return false;
    }
    else {
        return true;
    }
}

export const allPostPreference = async (currentId) => {
    const snapshot = await get(ref(db, "users/" + currentId + "/allPostPreference"));
    return snapshot.exists() ? snapshot.val() : false;
}

export const updatePostPreference = async (currentId) => {
    const currentValue = await allPostPreference(currentId);
    await update(ref(db, "users/" + currentId), {
        allPostPreference: !currentValue
    })
    return !currentValue;
}

export const updateUsername = async (currentId, username) => {
    const userRef = ref(db, "users/" + currentId);
    update(userRef, {username: username});
}

export const updateAvatar = async (currentId, avatar) => {
    const userRef = ref(db, "users/" + currentId);
    update(userRef, {avatar: avatar});
}