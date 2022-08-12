import { ref, push, set, orderByChild, equalTo, get, query, remove, child, update } from "firebase/database"
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
        return [];
    }
}

export const getPostsFromFollowing = async (currentId) => {
    const snapshot = await get(ref(db, `follows/from/${currentId}`))
    if (snapshot.exists()) {
        const listOfPosts = [];
        const listOfIds = [
            ...Object.keys(snapshot.val()),
            currentId
        ];
        for (let i = 0; i < listOfIds.length; i++) {
            const result = await getPostsFrom(listOfIds[i]);
            listOfPosts.push(...result);
        }
        return listOfPosts
    }
    else {
        return false;
    }
}

export const getPostsFrom = async (_id) => {
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
        return [];
    }
}

export const getPostById = async (_id) => {
    const snapshot = await get(child(postsRef, _id));
    if (snapshot.exists()) {
        return snapshot.val()
    }
    else {
        return null;
    }
}

export const addNewPost = async (text) => {
    const newPostRef = await push(postsRef, text)
    const date = Date.now().toString();
    await set(newPostRef, {
        userId: auth.currentUser.uid,
        text: text,
        createdAt: date
    })
    return {
        _id: newPostRef.key,
        userId: auth.currentUser.uid,
        text: text,
        createdAt: date
    }
}

export const updatePost = async (_id, text) => {
    await update(ref(db, "posts/" + _id), {
        text: text
    })
}

export const deletePost = async (_id) =>
    await Promise.all([
        remove(ref(db, "posts/" + _id)),
        remove(ref(db, "likes/" + _id))
    ])