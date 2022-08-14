import { uuidv4 } from "@firebase/util"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase"


export const uploadAvatar = async (image) => {
    const avatarId = uuidv4();
    const result = await uploadBytes(ref(storage, "avatars/" + avatarId), image);
    return await getDownloadURL(ref(storage, "avatars/" + result.metadata.name));
}

export const uploadImageInPost = async (image) => {
    const avatarId = uuidv4();
    const result = await uploadBytes(ref(storage, "postImages/" + avatarId), image);
    return await getDownloadURL(ref(storage, "postImages/" + result.metadata.name));
}

export const deleteImage = async (url) => {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
}