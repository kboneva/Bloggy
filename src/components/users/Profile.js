import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostContext } from "../../contexts/PostContext";
import { auth } from "../../firebase";
import { follow, isFollowing, unfollow } from "../../services/followService";
import { deletePost, getPostsFrom } from "../../services/postService";
import { getUserByName } from "../../services/userService";
import { Spinner } from "../common/Spinner";
import { PostsList } from "../posts/PostsList";

export const Profile = () => {
    const { username } = useParams();
    const [user, setUser] = useState({
        current: null,
        loaded: false
    })
    const currentId = auth.currentUser.uid;
    const [following, setFollowing] = useState(false);
    const [posts, setPosts] = useState([]);
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
                    getPostsFrom(currentUser._id)
                        .then(data => {
                            setPosts(data);
                        })
                    isFollowing(currentId, currentUser._id)
                        .then(result => {
                            setFollowing(result);
                        })
                }
            });
    }, [])

    const followHandler = () => {
        follow(currentId, user.current._id)
            .then(() => {
                setFollowing(true)
            });
    }

    const unFollowHandler = () => {
        unfollow(currentId, user.current._id)
            .then(() => {
                setFollowing(false)
            });
    }

    const AddPostNavigate = () => {
        navigate('/add');
    }

    const deleteHandler = (_id) => {
        deletePost(_id)
        .then(() => {
            setPosts(state => state.filter(x => x._id != _id));
        });
    }

    if (!user.loaded) {
        return <Spinner />;
    }
    return (
        !!user.current && <div>
            <div className="flex-wrapper flex-left profile-box">
                <img src={user.current.avatar} className="avatar-l" alt="avatar" />
                <h1>{user.current.username}</h1>
                {user.current._id !== currentId && <div>
                    {!following
                        ? <button className="big-btn white-btn white-normal-btn" onClick={followHandler}>Follow</button>
                        : <button className="big-btn white-btn white-danger-btn" onClick={unFollowHandler}>Unfollow</button>
                    }
                </div>
                }
            </div>
            <PostContext.Provider value={{deleteHandler}}>
                <PostsList posts={posts} />
            </PostContext.Provider>
            {user.current._id === currentId ? <button className="big-btn theme-btn" onClick={AddPostNavigate}>Post</button> : ""}
        </div>
    );
}