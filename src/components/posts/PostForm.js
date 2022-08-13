import { useContext, useState } from "react";
import { PostContext } from "../../contexts/PostContext";
import styles from './PostForm.module.css'

export const PostForm = ({ action, editPostToggle, post }) => {
    const { addPostHandler, addPostToggle, editPostHandler } = useContext(PostContext);
    const [error, setError] = useState({
        empty: false,
        tooLong: false
    });
    const [formValid, setFormValid] = useState(false);

    const onChange = (e) => {
        setFormValid(e.target.value > 0 && e.target.value.length <= 400)
    }

    const validator = (e) => {
        setError(() => ({
            empty: e.target.value.length === 0,
            tooLong: e.target.value.length > 400
        }))
    }

    return (
        <form id="post" onSubmit={action == "addPost" ? addPostHandler : (e) => { editPostHandler(e, post._id); editPostToggle(); }}>
            <div className={`${styles.margin} border`}>
                <textarea id="text" className={styles.text}
                    defaultValue={action === "editPost" ? post.text : ''}
                    name="text" rows={5} cols={60} placeholder="What's on your mind?"
                    onBlur={validator}
                    onChange={onChange} ></textarea>
                {error.empty && <p className={styles.error}>Post can't be empty!</p>}
                {error.tooLong && <p className={styles.error}>Post should be under 400 characters long!</p>}

                <input type="submit" className={`${styles.post} primary-color-blue`} value={action == "addPost" ? "Post" : "Edit"} />
                <button type="button" disabled={formValid} onClick={() => action == "addPost" ? addPostToggle() : editPostToggle()} className={styles.cancel}>Cancel</button>
            </div>
        </form>
    );
}