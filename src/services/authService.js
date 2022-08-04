
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"


export const login = (email, password) => 
    signInWithEmailAndPassword(auth, email, password)

export const register = (username, email, password) => 
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        const avatarUrl = '../../public/avatar.jpg';
        updateProfile(user, {displayName: username, photoURL: avatarUrl});
    })
    
export const logout = () => 
    signOut(auth)