import { useContext, useState } from "react";
import { PostContext } from "../../contexts/PostContext";
import styles from './PostForm.module.css'

export const PostForm = ({ action, editPostToggle, post }) => {
    const { addPostHandler, addPostToggle, editPostHandler } = useContext(PostContext);
    const [input, setInput] = useState(action === "addPost" ? '' : post.text);
    const [image, setImage] = useState(null);
    const [error, setError] = useState({
        empty: false,
        tooLong: false
    });
    const [formValid, setFormValid] = useState(false);

    const onChange = (e) => {
        setInput(e.target.value);
        setFormValid(e.target.value > 0 && e.target.value.length <= 400)
    }

    const validator = (e) => {
        setError(() => ({
            empty: e.target.value.length === 0 && image === null,
            tooLong: e.target.value.length > 400
        }))
    }

    return (
        <form id="post" onSubmit={action == "addPost" ? (e) => { addPostHandler(e, image) } : (e) => { editPostHandler(e, post._id); editPostToggle(); }}>
            <div className={`${styles.margin} border`}>
                <textarea id="text" className={styles.text}
                    value={input}
                    name="text" rows={5} cols={60} placeholder="What's on your mind?"
                    onBlur={validator}
                    onChange={onChange} ></textarea>
                {error.empty && <p className={styles.error}>Post can't be empty!</p>}
                {error.tooLong && <p className={styles.error}>Post should be under 400 characters long!</p>}

                <div className="flex">
                    {action === "addPost" &&
                        <div className={`${styles.upload} color-blue`}>
                            <label>
                                <input type="file" className="disabled" onChange={e => setImage(e.target.files[0])} />
                                <i className="fas fa-image"></i>
                            </label>
                        </div>
                    }
                    {action === "addPost" && !!image && <img className={styles.preview} src={URL.createObjectURL(image)} alt="image"></img>}
                    <div className={styles.buttons}>
                        <input type="submit" className={`${styles.post} primary-color-blue`} value={action == "addPost" ? "Post" : "Edit"} />
                        <button type="button" disabled={formValid} onClick={() => action == "addPost" ? addPostToggle() : editPostToggle()} className={`${styles.cancel} danger`}>Cancel</button>
                    </div>
                </div>
            </div>
        </form>
    );
}