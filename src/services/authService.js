
import { auth } from "../firebase";
import { addNewUser } from "./userService";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"


export const login = async (email, password) =>
    await signInWithEmailAndPassword(auth, email, password)

export const register = async (username, email, password) =>
    await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const avatarUrl = '/avatar.jpg';
            await Promise.all([updateProfile(user, { displayName: username, photoURL: avatarUrl }), addNewUser(user.uid, username)]);
        })

export const logout = async () =>
    await signOut(auth)