import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PostContext } from "../../contexts/PostContext";
import { auth } from "../../firebase";
import { getUserById } from "../../services/userService";
import { Like } from "./Like";
import styles from './Post.module.css'
import { PostForm } from "./PostForm";

export const Post = ({ post }) => {
    const [user, setUser] = useState(null);
    const currentId = auth.currentUser.uid;
    const [editPostDiv, setEditPostDiv] = useState(false);
    const [deleteDiv, setDeleteDiv] = useState(false);
    const { deleteHandler } = useContext(PostContext);

    useEffect(() => {
        getUserById(post.userId)
            .then(user => {
                setUser(user);
            })
    }, [])

    const editPostToggle = () => {
        setEditPostDiv(!editPostDiv)
    }

    const deleteConfirmation = () => {
        setDeleteDiv(!deleteDiv);
    }

    if (!user) {
        return '';
    }
    return (
        <div>
            <div className={`${styles.margin} border ${editPostDiv ? "disabled" : ""}`}>
                <Link to={`/post/${post._id}`}>
                    <div className="flexStart">
                        <object><Link to={`/${user.username}`}><img src={user.avatar} className={styles.avatar} alt="" /></Link></object>
                        <div className={styles.textBox}>
                            <object><Link to={`/${user.username}`}><span className={styles.username}>{user.username}</span></Link></object>
                            <div className={styles.text}>{post.text}</div>
                        </div>
                    </div>
                </Link>
                <hr />
                <div className={`${styles.buttons} flex`}>
                    <Like postId={post._id} />
                    <div className="flex">
                        {currentId === post.userId && !deleteDiv && <button className={`${styles.btn} danger`} onClick={() => deleteConfirmation()}><i className={`${styles.icon} fas fa-times`}></i></button>}
                        {deleteDiv && <span className={styles.deleteText}>Are you sure you want to delete?
                            <button className={`${styles.btn} danger`} onClick={() => deleteHandler(post._id)}><i className={`${styles.icon} fas fa-check`}></i></button>
                            <button className={`${styles.btn} color-blue`} onClick={() => deleteConfirmation()}><i className={`${styles.icon} fas fa-times`}></i></button>
                        </span>}
                        {currentId === post.userId && <button className={`${styles.btn} color-blue`} onClick={() => editPostToggle()}><i className={`${styles.icon} fas fa-edit`}></i></button>}
                    </div>
                </div>
            </div>
            {editPostDiv && <PostForm action="editPost" editPostToggle={editPostToggle} post={post} />}
        </div>
    );
}