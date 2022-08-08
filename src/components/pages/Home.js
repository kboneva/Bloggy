import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../../contexts/PostContext";
import { auth } from "../../firebase";
import { deletePost, getAllPosts } from "../../services/postService";
import { PostsList } from "../posts/PostsList";

export const Home = () => {
    const [posts, setPosts] = useState([]);
    const user = auth.currentUser;
    const navigate = useNavigate();

    const AddPostNavigate = () => {
        navigate('/add');
    }

    useEffect(() => {
        getAllPosts()
            .then(data => {
                setPosts(data);
            })
    }, [])

    const deleteHandler = (_id) => {
        deletePost(_id)
        .then(() => {
            setPosts(state => state.filter(x => x._id != _id));
        });
    }

    return (
        <div>
            <PostContext.Provider value={{deleteHandler}}>
                <PostsList posts={posts} />
            </PostContext.Provider>
            {!!user ? <button className="big-btn theme-btn" onClick={AddPostNavigate}>Post</button> : ""}
        </div>
    );
}