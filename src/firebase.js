import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBLmdvuEpz0gf4go4D-1C-ZCLohunzdDyY",
    authDomain: "webforum-7c715.firebaseapp.com",
    databaseURL: "https://webforum-7c715-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "webforum-7c715",
    storageBucket: "webforum-7c715.appspot.com",
    messagingSenderId: "403074147791",
    appId: "1:403074147791:web:ba966c6d94319660e91eba"
};


const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const defaultAvatar = "https://firebasestorage.googleapis.com/v0/b/webforum-7c715.appspot.com/o/avatars%2FAvatar.jpg?alt=media&token=d628093d-6b1f-4bf8-92c7-761cbe7b82bd";