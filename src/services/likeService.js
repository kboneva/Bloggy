import { get, ref, remove, update } from "firebase/database"
import { db } from "../firebase"

export const getLikes = async (currentId, postId) => {
    const snapshot = await get(ref(db, `like/to/${postId}`))
    if (snapshot.exists()) {
        const list = Object.entries(snapshot.val()).map(([id, like]) => {
            return {
                _id: id,
                ...like
            }
        })
        const status = list.some(x => x._id === currentId);
        return { status, list }
    }
    else {
        const list = [];
        const status = false;
        return { status, list }
    }
}

export const like = async (currentId, postId) => {
    await Promise.all([
        update(ref(db, `like/from/${currentId}`), { [postId]: true }),
        update(ref(db, `like/to/${postId}`), { [currentId]: true })
    ])
}

export const dislike = async (currentId, postId) => {
    await Promise.all([
        remove(ref(db, `like/from/${currentId}/${postId}`)),
        remove(ref(db, `like/to/${postId}/${currentId}`))
    ])
}