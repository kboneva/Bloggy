import { uuidv4 } from "@firebase/util"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase"


export const uploadAvatar = async (image) => {
    const avatarId = uuidv4();
    const result = await uploadBytes(ref(storage, "avatars/" + avatarId), image);
    return await getDownloadURL(ref(storage, "avatars/" + result.metadata.name));
}