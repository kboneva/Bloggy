import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Post } from "../posts/Post";
import { useEffect, useState } from "react";
import { getAllPosts } from "../../services/postService";

export const Home = () => {
    const [posts, setPosts] = useState([]);
    const user = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
        getAllPosts()
            .then(data => {
                setPosts(data);
            })
    }, [])


    const AddPostNavigate = () => {
        navigate('/add');
    }

    return (
        <div>
            {posts.length > 0
                ? <div >
                    {posts.map(post =>
                        <Post key={post._id} post={post} />
                    )}
                </div>
                : ""
            }
            {!!user ? <button className="btn add-post" onClick={AddPostNavigate}>Post</button> : ""}
        </div>
    );
}