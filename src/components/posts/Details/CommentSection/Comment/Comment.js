import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../../../../firebase";
import { getUserById } from "../../../../../services/userService";
import { Like } from "../../../Like/Like";
import styles from './Comment.module.css';

export const Comment = ({ comment, deleteCommentHandler }) => {
    const [user, setUser] = useState(null);
    const [deleteDiv, setDeleteDiv] = useState(false);
    const currentId = auth.currentUser.uid;

    useEffect(() => {
        getUserById(comment.userId)
            .then(userResult => {
                setUser(userResult);
            })
    }, [])


    const deleteConfirmation = () => {
        setDeleteDiv(!deleteDiv);
    }



    if (!user) {
        return <div></div>
    }
    return (
        <div className={`flex border ${styles.margin}`}>
            <div className={`flexStart`}>
                <Link to={`/${user.username}`}>
                    <img src={user.avatar} className={styles.avatar} alt="" />
                </Link>
                <div className={styles.textBox}>
                    <Link to={`/${user.username}`}>
                        <span className={styles.username}>{user.username}</span>
                    </Link>
                    <p className={styles.text}>{comment.text}</p>
                </div>
            </div>
            <div className="flex">
                <Like postId={comment._id} detailed={false} left={true} />
                <div className="flex">
                    {currentId === comment.userId && !deleteDiv && <button className={`${styles.btn} danger`} onClick={() => deleteConfirmation()}><i className={`${styles.icon} fas fa-times`}></i></button>}
                    {deleteDiv && <span className={styles.deleteText}>Are you sure you want to delete?
                        <button className={`${styles.btn} danger`} onClick={() => deleteCommentHandler(comment._id)}><i className={`${styles.icon} fas fa-check`}></i></button>
                        <button className={`${styles.btn} color-blue`} onClick={() => deleteConfirmation()}><i className={`${styles.icon} fas fa-times`}></i></button>
                    </span>}
                </div>
            </div>
        </div>
    );
}