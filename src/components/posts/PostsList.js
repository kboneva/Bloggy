import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../../contexts/PostContext";
import { addNewPost, deletePost } from "../../services/postService";
import { Post } from "./Post";
import { AddPost } from "./AddPost";

export const PostsList = ({ posts, setPosts, isMe }) => {
    const [addPostDiv, setAddPostDiv] = useState(false);
    const navigate = useNavigate();

    const addPostToggle = () => {
        setAddPostDiv(!addPostDiv)
    }

    const addPostHandler = (e) => {
        e.preventDefault();

        const { text } = Object.fromEntries(new FormData(e.target));

        addNewPost(text)
            .then(newPost => {
                setPosts(state => [
                    ...state,
                    newPost
                ])
                e.target.reset();
                setAddPostDiv(false);
            })
            .catch(() => {
                navigate('/not-found');
            })
    }

    const deleteHandler = (_id) => {
        deletePost(_id)
            .then(() => {
                setPosts(state => state.filter(x => x._id !== _id));
            });
    }

    return (
        <PostContext.Provider value={{ deleteHandler, addPostHandler, addPostToggle }}>
            <div>
                {posts.length > 0
                    ? <div >
                        {posts.sort((a, b) => b.createdAt - a.createdAt).map(post =>
                            <Post key={post._id} post={post} />
                        )}
                    </div>
                    : ""
                }
                {addPostDiv && <AddPost/>}
                {isMe && !addPostDiv ? <button className="post-btn big-btn primary-color-blue" onClick={() => addPostToggle()}>Post</button> : ""}
            </div>
        </PostContext.Provider>

    );
}