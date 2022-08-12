import { get, ref, remove, update } from "firebase/database"
import { db } from "../firebase"

export const getFollowers = async (currentId, userId) => {
    const snapshot = await get(ref(db, `follows/to/${userId}`))
    if (snapshot.exists()) {
        const list = Object.entries(snapshot.val()).map(([id, follow]) => {
            return {
                _id: id,
                ...follow
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

export const follow = async (currentId, id) => {
    await Promise.all([
        update(ref(db, `follows/to/${id}`), {[currentId]: true}),
        update(ref(db, `follows/from/${currentId}`), {[id]: true})
    ]);
}

export const unfollow = async (currentId, id) => {
    await Promise.all([
        remove(ref(db, `follows/to/${id}/${currentId}`)),
        remove(ref(db, `follows/from/${currentId}/${id}`))
    ])
}