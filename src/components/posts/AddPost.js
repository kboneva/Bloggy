import { useContext } from "react";
import { PostContext } from "../../contexts/PostContext";
import styles from './AddPost.module.css'

export const AddPost = () => {
    const { addPostHandler, addPostToggle } = useContext(PostContext);

    return (
        <form id="post" onSubmit={addPostHandler}>
            <div className="border">
                <textarea id="text" className={styles.text} name="text" rows={4} cols={60} placeholder="What's on your mind?" ></textarea>

                <input type="submit" className={`${styles.post} primary-color-blue`} value="Post" />
                <button type="button" onClick={() => addPostToggle()} className={styles.cancel}>Cancel</button>
            </div>
        </form>
    );
}