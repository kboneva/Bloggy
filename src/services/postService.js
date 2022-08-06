import { ref, push, set, orderByChild, equalTo, get, query } from "firebase/database"
import { auth, db } from "../firebase"

const postsRef = ref(db, 'posts');

export const getAllPosts = async () => {
    const snapshot = await get(postsRef);  // TODO filter by those you follow
    if (snapshot.exists()) {
        return Object.entries(snapshot.val()).map(([id, post]) => {
            return {
                _id: id,
                ...post
            }
        })
    }
    else {
        console.log("No data available");
    }
}

export const getPosts = async (_id) => {
    const snapshot = await get(query(postsRef, orderByChild('userId'), equalTo(_id)))
    if (snapshot.exists()) {
        return Object.entries(snapshot.val()).map(([id, post]) => {
            return {
                _id: id,
                ...post
            }
        })
    }
    else {
        console.log("No data available");
    }
}

export const addNewPost = async (text) => {
    const newPostRef = await push(postsRef, text)
    await set(newPostRef, {
        comments: [],
        likes: [],
        userId: auth.currentUser.uid,
        text: text
    })
}