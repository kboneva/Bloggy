import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { getPosts } from "../../services/postService";
import { Post } from "../posts/Post";

export const Profile = () => {
    const [posts, setPosts] = useState([]);
    const user = auth.currentUser;

    useEffect(() => {
        getPosts(user.uid)
            .then(data => {
                setPosts(data);
            })
    }, [])

    return (
        <div>
            <img src={user.photoURL} alt="avatar" />
            <h1>{user.displayName}</h1>
            <p>{user.email}</p>
            <br />
            <div>
                {posts.length > 0
                    ? <div >
                        {posts.map(post =>
                            <Post key={post._id} post={post} />
                        )}
                    </div>
                    : ""
                }
            </div>
        </div>
    );
}