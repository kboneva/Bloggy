import { push, ref, remove, set } from "firebase/database";
import { auth, db } from "../firebase";

export const addNewComment = async (postId, text) => {
    const newCommentRef = await push(ref(db, "posts/" + postId + "/comments/"), text);
    const date = Date.now().toString();
    await set(newCommentRef, {
        userId: auth.currentUser.uid,
        text: text,
        createdAt: date
    })
    return {
        _id: newCommentRef.key,
        userId: auth.currentUser.uid,
        text: text,
        createdAt: date
    }
}

export const deleteComment = async (postId, commentId) =>
    await Promise.all([
        remove(ref(db, "posts/" + postId + "/comments/" + commentId)),
        remove(ref(db, "likes/" + commentId))
    ])
