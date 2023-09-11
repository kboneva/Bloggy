import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../../../contexts/PostContext";
import { addNewPost, deletePost, updatePost } from "../../../services/postService";
import { Post } from "./Post/Post";
import { PostForm } from "./PostForm/PostForm";
import styles from './PostsList.module.css'

export const PostsList = ({ posts, setPosts, setMaxCount, isMe }) => {
    const [addPostDiv, setAddPostDiv] = useState(false);
    const navigate = useNavigate();

    const addPostToggle = () => {
        setAddPostDiv(!addPostDiv)
    }

    const addPostHandler = (e, image) => {
        e.preventDefault();

        const { text } = Object.fromEntries(new FormData(e.target));

        addNewPost(text, image)
            .then(newPost => {
                setPosts(state => [
                    newPost,
                    ...state
                ])
                setMaxCount(state => state + 1)
                e.target.reset();
                setAddPostDiv(false);
            })
            .catch(() => {
                navigate('/not-found');
            })
    }

    const editPostHandler = (e, _id, isRemovingImage) => {
        e.preventDefault();

        const { text } = Object.fromEntries(new FormData(e.target));

        if (isRemovingImage) {
            if (text.length > 0) {
                setPosts(state => {
                    return state.map(x => {
                        if (x._id === _id) {
                            x.image = null;
                        }
                        return x;
                    })
                })
            }
            else {
                deleteHandler(_id, null);
            }
        }

        updatePost(_id, text)
            .then(() => {
                setPosts(state =>
                    state.map(x => {
                        if (x._id === _id) {
                            x.text = text;
                        }
                        return x;
                    }))
            })
            .catch(() => {
                navigate('/not-found');
            })

        e.target.reset();
    }

    const deleteHandler = (_id, image) => {
        deletePost(_id, image)
            .then(() => {
                setPosts(state => state.filter(x => x._id !== _id));
                setMaxCount(state => state - 1)
            });
    }

    return (
        <PostContext.Provider value={{ deleteHandler, addPostHandler, addPostToggle, editPostHandler }}>
            <div>
                {addPostDiv && <PostForm action="addPost" editPostToggle='' post={null} />}
                {isMe && !addPostDiv ? <button className={`${styles.post} primary-color-blue`} onClick={() => addPostToggle()}>Post</button> : ""}
                {posts.length > 0
                    ? <div >
                        {posts.map(post =>
                            <Post key={post._id} post={post} />
                        )}
                    </div>
                    : <div className={styles.noposts}>
                        <h3>There's nothing here yet.</h3>
                    </div>
                }
            </div>
        </PostContext.Provider>

    );
}