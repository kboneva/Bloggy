
import { auth } from "../firebase";
import { addNewUser, updateAvatar, updateUsername } from "./userService";
import { createUserWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, updateProfile } from "firebase/auth"


export const login = async (email, password) =>
    await signInWithEmailAndPassword(auth, email, password)

export const register = async (username, email, password) =>
    await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const avatarUrl = "https://firebasestorage.googleapis.com/v0/b/webforum-7c715.appspot.com/o/avatars%2FAvatar.jpg?alt=media&token=d628093d-6b1f-4bf8-92c7-761cbe7b82bd";
            await Promise.all([updateProfile(user, { displayName: username, photoURL: avatarUrl }), addNewUser(user.uid, username)]);
        })

export const logout = async () =>
    await signOut(auth)


export const changeUsername = async (username) => {
    const currentUser = auth.currentUser;
    await Promise.all([
        updateProfile(currentUser, { displayName: username }),
        updateUsername(currentUser.uid, username)
    ])
}

export const changeAvatar = async (avatar) => {
    const currentUser = auth.currentUser;
    await Promise.all([
        updateProfile(currentUser, { photoURL: avatar }),
        updateAvatar(currentUser.uid, avatar)
    ])
}

export const changeEmail = async (oldEmail, password, newEmail) => {
    await reauthenticate(oldEmail, password);
    await updateEmail(auth.currentUser, newEmail);
}

export const changePassword = async (oldPassword, email, newPassword) => {
    await reauthenticate(email, oldPassword);
    await updatePassword(auth.currentUser, newPassword);
}


export const reauthenticate = async (email, password) => {
    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
}