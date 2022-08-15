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
    const [input, setInput] = useState('');
    const [isRemovingImage, setIsRemovingImage] = useState(false);
    const [deleteDiv, setDeleteDiv] = useState(false);
    const [imageExpandDiv, setImageExpandDiv] = useState(false);
    const body = document.querySelector("body");
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
                setInput(postResult.text);
            })
    }, [])

    const editPostToggle = () => {
        setEditPostDiv(!editPostDiv)
        setIsRemovingImage(false);

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
        setInput(e.target.value)
        setFormValid(e.target.value.length > 0 && e.target.value.length <= 400)
    }

    const validator = (e) => {
        setError(() => ({
            empty: e.target.value.length === 0 && !post.image,
            tooLong: e.target.value.length > 400
        }))
    }

    const editImageOut = () => {
        setIsRemovingImage(true);
    }


    const expandImage = (x) => {
        setImageExpandDiv(x);
        if (x) {
            body.style.overflow = "hidden";
        }
        else {
            body.style.overflow = "auto";
        }
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

                        {!!post.image
                            && <div>
                                <img src={post.image} onClick={() => expandImage(true)} className={styles.image} alt=""></img>
                                {imageExpandDiv
                                    && <div className={styles.background} onClick={() => expandImage(false)}>
                                        <img src={post.image} className={styles.expandedImage} alt=""></img>
                                    </div>}
                            </div>}

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
                            value={input}
                            name="text" rows={5} cols={60} placeholder="What's on your mind?"
                            onBlur={validator}
                            onChange={onChange} ></textarea>
                        {error.empty && <p className={styles.error}>Post can't be empty!</p>}
                        {error.tooLong && <p className={styles.error}>Post should be under 400 characters long!</p>}

                        <div>
                            {!!post.image && !isRemovingImage
                                && <div className={styles.editContainer}>
                                    <button className={`${styles.removeImage} danger`} onClick={() => editImageOut()}><i className={`${styles.icon} fas fa-times`}></i></button>
                                    <img className={styles.editImage} src={post.image} alt=""></img>
                                </div>}
                            {isRemovingImage && input === '' && <p className="primary-danger-text">Empty posts with no text or image will be deleted!</p>}
                        </div>

                        <div className={styles.buttons}>
                            <input type="submit" className={`${styles.post} primary-color-blue`} value="Edit" />
                            <button type="button" disabled={formValid} onClick={() => editPostToggle()} className={styles.cancel}>Cancel</button>
                        </div>
                    </div>
                </form>}
        </div>
    );
}