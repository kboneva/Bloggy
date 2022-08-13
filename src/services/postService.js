import { ref, push, set, orderByChild, equalTo, get, query, remove, child, update, limitToFirst, limitToLast } from "firebase/database"
import { auth, db } from "../firebase"

const postsRef = ref(db, 'posts');

export const getAllPosts = async () => {
    const allPosts = await getPostsCount();
    const snapshot = await get(query(postsRef, orderByChild("createdAt"), limitToLast(5)));
    if (snapshot.exists()) {
        const list = Object.entries(snapshot.val()).map(([id, post]) => {
            return {
                _id: id,
                ...post
            }
        })
        .sort((a, b) => b.createdAt - a.createdAt);
        return {list: list, maxCount: allPosts};
    }
    else {
        return {list: [], maxCount: 0};
    }
}

export const getPostsFromFollowing = async (currentId) => {
    const snapshot = await get(ref(db, `follows/from/${currentId}`))
    let listOfIds = [currentId];
    const listOfPosts = [];
    if (snapshot.exists()) {
        listOfIds = [
            ...Object.keys(snapshot.val()),
            currentId
        ];
    }
    for (let i = 0; i < listOfIds.length; i++) {
        const result = await getPostsFrom(listOfIds[i]);
        listOfPosts.push(...result);
    }
    const list = listOfPosts.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
    return {list: list, maxCount: listOfPosts.length};
}

export const getPostsFrom = async (_id) => {
    const snapshot = await get(query(postsRef, orderByChild('userId'), equalTo(_id)));
    if (snapshot.exists()) {
        return Object.entries(snapshot.val()).map(([id, post]) => {
            return {
                _id: id,
                ...post
            }
        })
        .sort((a, b) => b.createdAt - a.createdAt);
    }
    else {
        return [];
    }
}


export const loadMorePostsAll = async (lastLen) => {
    const snapshot = await get(query(postsRef, orderByChild("createdAt"), limitToLast(4 + lastLen)));
    if (snapshot.exists()) {
        return  Object.entries(snapshot.val()).map(([id, post]) => {
            return {
                _id: id,
                ...post
            }
        })
        .sort((a, b) => b.createdAt - a.createdAt)
    }
    else {
        return [];
    }
}

export const loadMorePostsFollowing = async (currentId, lastLen) => {
    const snapshot = await get(ref(db, `follows/from/${currentId}`))
    let listOfIds = [currentId];
    const listOfPosts = [];
    if (snapshot.exists()) {
        listOfIds = [
            ...Object.keys(snapshot.val()),
            currentId
        ];
    }
    for (let i = 0; i < listOfIds.length; i++) {
        const result = await getPostsFrom(listOfIds[i]);
        listOfPosts.push(...result);
    }
    return listOfPosts.sort((a, b) => b.createdAt - a.createdAt).slice(0, 4 + lastLen);
}

export const loadMorePostsFrom = async (currentId, lastLen) => {

}


export const getPostsCount = async () => {
    const result = await fetch("https://webforum-7c715-default-rtdb.europe-west1.firebasedatabase.app/posts.json?shallow=true")
        .then(res => res.json());
    return Object.keys(result).length;
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