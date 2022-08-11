import { useContext, useState } from "react";
import { PostContext } from "../../contexts/PostContext";
import styles from './AddPost.module.css'

export const AddPost = () => {
    const { addPostHandler, addPostToggle } = useContext(PostContext);
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
        <form id="post" onSubmit={addPostHandler}>
            <div className="border">
                <textarea id="text" className={styles.text} 
                name="text" rows={4} cols={60} placeholder="What's on your mind?"
                onBlur={validator}
                onChange={onChange} ></textarea>
                {error.empty && <p className={styles.error}>Post can't be empty!</p>}
                {error.tooLong && <p className={styles.error}>Post should be under 400 characters long!</p>}

                <input type="submit" className={`${styles.post} primary-color-blue`} value="Post" />
                <button type="button" disabled={formValid} onClick={() => addPostToggle()} className={styles.cancel}>Cancel</button>
            </div>
        </form>
    );
}