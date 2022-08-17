import { useContext, useState } from "react";
import { PostContext } from "../../../../contexts/PostContext";
import { removeImageFromPost } from "../../../../services/postService";
import { ResponsiveContext } from "../../../../contexts/ResponsiveContext";
import styles from './PostForm.module.css'

export const PostForm = ({ action, editPostToggle, post }) => {
    const { isMobile } = useContext(ResponsiveContext);
    const { addPostHandler, addPostToggle, editPostHandler } = useContext(PostContext);
    const [input, setInput] = useState(action === "addPost" ? '' : post.text);
    const [image, setImage] = useState(null);
    const [isRemovingImage, setIsRemovingImage] = useState(false);
    const [error, setError] = useState({
        empty: false,
        tooLong: false,
        invalidImage: false
    });
    const [formValid, setFormValid] = useState(false);


    const onSubmit = (e) => {
        if (action === "addPost") {
            addPostHandler(e, image)
        }
        else {
            editPostHandler(e, post._id, isRemovingImage);
            removeImageFromPost(post._id, post.image);
            editPostToggle();
        }
    }

    const onImageUpload = (e) => {
        const imageSelected = e.target.files[0];
        if (imageSelected.type !== "image/png" && imageSelected.type !== "image/jpeg") {
            setError(state => ({
                ...state,
                invalidImage: true
            }))
            setTimeout(() => {
                setError(state => ({
                    ...state,
                    invalidImage: false
                }))
            }, 3000);
        }
        else {
            setImage(imageSelected);
            setError(false, false, false);
            setFormValid(input.length <= 400);
        }
    }

    const onChange = (e) => {
        setInput(e.target.value);
        setError(false, false, false);
        setFormValid(((action === "addPost" && (e.target.value.length > 0 || !!image))
            || (action === "editPost" && (e.target.value.length > 0 || !post.image)))
            && (e.target.value.length <= 400));
    }

    const validator = (e) => {
        setError(() => ({
            empty: (action === "addPost" && e.target.value.length === 0 && image === null)
                || (action === "editPost" && e.target.value.length === 0 && !post.image),
            tooLong: e.target.value.length > 400
        }))
    }

    const editImageOut = () => {
        setIsRemovingImage(true);
    }

    return (
        <form id="post" onSubmit={onSubmit}>
            <div className={`${styles.margin} border`}>
                <textarea id="text" className={styles.text}
                    value={input}
                    name="text" rows={5} placeholder="What's on your mind?"
                    onBlur={validator}
                    onChange={onChange} ></textarea>
                {error.empty && <p className={styles.error}>Post can't be empty!</p>}
                {error.invalidImage && <p className={styles.error}>Not a valid type of image!</p>}
                {error.tooLong && <p className={styles.error}>Post should be under 400 characters long!</p>}

                <div className="flex">
                    <div className="flex">
                        {action === "addPost" &&
                            <div className={`${styles.upload} color-blue`}>
                                <label>
                                    <input type="file" className="disabled" onChange={onImageUpload} />
                                    <i className="fas fa-image"></i>
                                </label>
                            </div>
                        }
                        {action === "addPost" && !!image
                            && <div className={styles.addContainer}>
                                <button className={`${styles.removeImage} danger`} onClick={() => setImage(null)}><i className={`${styles.icon} fas fa-times`}></i></button>
                                <img className={styles.preview} src={URL.createObjectURL(image)} alt=""></img>
                            </div>}
                        {action === "editPost" && !!post.image && !isRemovingImage
                            && <div className={styles.editContainer}>
                                <button className={`${styles.removeImage} danger`} onClick={() => editImageOut()}><i className={`${styles.icon} fas fa-times`}></i></button>
                                <img className={styles.image} src={post.image} alt=""></img>
                            </div>}
                        {action === "editPost" && isRemovingImage && input === '' && <p className="primary-danger-text">Empty posts with no text or image will be deleted!</p>}
                    </div>

                    <div className={styles.buttons}>
                        <input type="submit" disabled={!formValid}
                            className={`${styles.post} ${action === "editPost" && isRemovingImage && input === '' ? "primary-danger" : "primary-color-blue"}`}
                            value={action === "addPost" ? "Post" : isRemovingImage && input === '' ? "Delete" : "Edit"} />
                        <button type="button"
                            onClick={() => action === "addPost" ? addPostToggle() : editPostToggle()}
                            className={`${styles.cancel} ${action === "editPost" && isRemovingImage ? "color-blue" : "danger"}`}>{isMobile ? <i className={`${styles.cancelIcon} fas fa-times`}></i> : "Cancel"}</button>
                    </div>
                </div>
            </div>
        </form>
    );
}
