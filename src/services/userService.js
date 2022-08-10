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
        avatar: '/avatar.jpg',
        darkTheme: false,
        theme: "blue"
    })
}

export const isDarkTheme = async (_id) => {
    const snapshot = await get(ref(db, "users/" + _id + "/darkTheme"));
    if (snapshot.exists()) {
        return snapshot.val();
    }
    else return false;
}

export const updateThemePreference = async (_id) => {
    const currentValue = await isDarkTheme(_id);
    update(ref(db, "users/" + _id), {
        darkTheme: !currentValue
    })
}