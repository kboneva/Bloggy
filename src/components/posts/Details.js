import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { deletePost, getPostById, updatePost } from "../../services/postService";
import { getUserById } from "../../services/userService";
import { Spinner } from "../common/Spinner";
import { Like } from "./Like";
import styles from './Details.module.css';
import { auth } from "../../firebase";

export const Details = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);
    const currentId = auth.currentUser.uid;
    const [editPostDiv, setEditPostDiv] = useState(false);
    const [deleteDiv, setDeleteDiv] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState({
        empty: false,
        tooLong: false
    });
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        getPostById(postId)
            .then(postResult => {
                setPost(postResult);
                getUserById(postResult.userId)
                    .then(user => {
                        setUser(user);
                    })

            })
    }, [])

    const editPostToggle = () => {
        setEditPostDiv(!editPostDiv)
    }

    const editPostHandler = (e, _id) => {
        e.preventDefault();

        const { text } = Object.fromEntries(new FormData(e.target));

        updatePost(_id, text)
            .then(() => {
                setPost(state => ({ ...state, text: text }))
            })
            .catch(() => {
                navigate('/not-found');
            })

        e.target.reset();
    }

    const deleteConfirmation = () => {
        setDeleteDiv(!deleteDiv);
    }

    const deleteHandler = () => {
        deletePost(postId)
            .then(() => {
                navigate('/');
            });
    }

    const onChange = (e) => {
        setFormValid(e.target.value > 0 && e.target.value.length <= 400)
    }

    const validator = (e) => {
        setError(() => ({
            empty: e.target.value.length === 0,
            tooLong: e.target.value.length > 400
        }))
    }

    if (!post || !user) {
        return <Spinner />
    }
    return (
        <div>
            <div className={`border ${editPostDiv ? "disabled" : ""}`}>
                <div className="flexStart">
                    <Link to={`/${user.username}`}><img src={user.avatar} className={styles.avatar} alt="" /></Link>
                    <div>
                        <Link to={`/${user.username}`}><span className={styles.username}>{user.username}</span></Link>
                        <p className={`${styles.date}`}>Posted on: {new Date(parseInt(post.createdAt)).toLocaleDateString()}</p>
                        <p className={styles.text}>{post.text}</p>
                    </div>
                </div>
                <hr />
                <div className={`${styles.buttons} flex`}>
                    <Like postId={postId} />
                    <div className="flex">
                        {currentId === post.userId && !deleteDiv && <span>Delete <button className={`${styles.btn} danger`} onClick={() => deleteConfirmation()}><i className={`${styles.icon} fas fa-times`}></i></button></span>}
                        {deleteDiv && <span className={styles.deleteText}>Are you sure you want to delete?
                            <button className={`${styles.btn} danger`} onClick={() => deleteHandler()}>
                                <i className={`${styles.icon} fas fa-check`}></i>
                            </button>
                            <button className={`${styles.btn} color-blue`} onClick={() => deleteConfirmation()}>
                                <i className={`${styles.icon} fas fa-times`}></i>
                            </button>
                        </span>}
                        {currentId === post.userId &&
                            <span>Edit
                                <button className={`${styles.btn} color-blue`} onClick={() => editPostToggle()}>
                                    <i className={`${styles.icon} fas fa-edit`}></i>
                                </button>
                            </span>}
                    </div>
                </div>
            </div>
            
            {editPostDiv &&
                <form id="post" onSubmit={(e) => { editPostHandler(e, postId); editPostToggle(); }}>
                    <div className="border">
                        <textarea id="text" className={styles.textarea}
                            defaultValue={post.text}
                            name="text" rows={5} cols={60} placeholder="What's on your mind?"
                            onBlur={validator}
                            onChange={onChange} ></textarea>
                        {error.empty && <p className={styles.error}>Post can't be empty!</p>}
                        {error.tooLong && <p className={styles.error}>Post should be under 400 characters long!</p>}

                        <input type="submit" className={`${styles.post} primary-color-blue`} value="Edit" />
                        <button type="button" disabled={formValid} onClick={() => editPostToggle()} className={styles.cancel}>Cancel</button>
                    </div>
                </form>}
        </div>
    );
}