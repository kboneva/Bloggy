import { get, ref, remove, update } from "firebase/database"
import { db } from "../firebase"

export const getFollowers = async (id) => {
    const snapshot = await get(ref(db, `follow/to/${id}`))
    if (snapshot.exists()) {
        return Object.entries(snapshot.val()).map(([id, follow]) => {
            return {
                _id: id,
                ...follow
            }
        })
    }
    else {
        return null;
    }
}

export const isFollowing = async (currentId, id) => {
    const snapshot = await get(ref(db, `follow/from/${currentId}/${id}`));
    if (snapshot.exists()) {
        return snapshot.val();
    }
    else return false;
}

export const follow = async (currentId, id) => {
    await Promise.all([
        update(ref(db, `follow/from/${currentId}`), {[id]: true}),
        update(ref(db, `follow/to/${id}`), {[currentId]: true})
    ])
}

export const unfollow = async (currentId, id) => {
    await Promise.all([
        remove(ref(db, `follow/from/${currentId}/${id}`)),
        remove(ref(db, `follow/to/${id}/${currentId}`))
    ])
}