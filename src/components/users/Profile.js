import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPosts } from "../../services/postService";
import { getUserByName } from "../../services/userService";
import { Post } from "../posts/Post";
import { Spinner } from "../common/Spinner";

export const Profile = () => {
    const { username } = useParams();
    const [user, setUser] = useState({
        current: null,
        loaded: false
    })
    const [posts, setPosts] = useState({
        list: [],
        loaded: false
    });
    const navigate = useNavigate();

    useEffect(() => {
        getUserByName(username)
            .then(currentUser => {
                if (!currentUser) {
                    navigate('/not-found', { replace: true });
                    return;
                }
                else {
                    setUser({
                        current: currentUser,
                        loaded: true
                    })
                    getPosts(currentUser._id)
                        .then(data => {
                            setPosts({
                                list: data,
                                loaded: true
                            });
                        })
                }
            })
    }, [])

    if (!user.loaded) {
        return <Spinner />;
    }
    return (
        !!user.current && <div>
            <img src={user.current.avatar} alt="avatar" />
            <h1>{user.current.username}</h1>
            <br />
            <div>
                {posts.loaded && posts.list.length > 0
                    ? <div >
                        {posts.list.map(post =>
                            <Post key={post._id} post={post} />
                        )}
                    </div>
                    : ""
                }
            </div>
        </div>
    );
}