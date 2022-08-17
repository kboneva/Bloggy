import { ref, get, query, set, orderByChild, equalTo, child, update, onValue } from "firebase/database"
import { auth, db, defaultAvatar } from "../firebase"

const usersRef = ref(db, 'users');

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


export const searchUsers = async (query) => {
    const snapshot = await get(ref(db, "users/"));
    if (snapshot.exists()) {
        const list = Object.entries(snapshot.val()).map(([id, user]) => {
            return {
                _id: id,
                ...user
            }
        }).filter(x => x.username.toLowerCase().includes(query.toLowerCase()))
        return list;
    }
    else {
        return []
    }
}


export const addNewUser = async (_id, username) => {
    const newUserRef = ref(db, "users/" + _id);
    await set(newUserRef, {
        username: username,
        avatar: defaultAvatar,
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
    if (currentId === '') {
        return true;
    }
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