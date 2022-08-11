import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../firebase";
import { follow, getFollowers, unfollow } from "../../services/followService";
import { getPostsFrom } from "../../services/postService";
import { getUserByName } from "../../services/userService";
import { Spinner } from "../common/Spinner";
import { PostsList } from "../posts/PostsList";
import styles from './Profile.module.css';

export const Profile = () => {
    const { username } = useParams();
    const currentId = auth.currentUser.uid;
    const [user, setUser] = useState({
        current: null,
        loaded: false
    })
    const [followers, setFollowers] = useState({
        status: false,
        list: []
    });
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
                    getFollowers(currentId, currentUser._id)
                        .then(result => {
                            setFollowers(result);
                        })
                }
            });
    }, [])

    const followHandler = () => {
        follow(currentId, user.current._id)
            .then(() => {
                const newList = [...followers.list, { _id: currentId }];
                setFollowers({
                    status: true,
                    list: newList
                })
            });
    }

    const unFollowHandler = () => {
        unfollow(currentId, user.current._id)
            .then(() => {
                const newList = followers.list.filter(x => currentId !== x._id)
                setFollowers({
                    status: false,
                    list: newList
                })
            });
    }

    if (!user.loaded) {
        return <Spinner />;
    }
    return (
        !!user.current && <div>
            <div className="flexStart border">
                <img src={user.current.avatar} className={styles.avatar} alt="avatar" />
                <div>
                    <h1>{user.current.username} <small className={styles.followers}> - {followers.list.length || "0"} followers</small></h1>
                    {user.current._id !== currentId && <div>
                        {!followers.status
                            ? <button className={`${styles.btn} color-blue`} onClick={followHandler}>Follow</button>
                            : <button className={`${styles.btn} danger`} onClick={unFollowHandler}>Unfollow</button>
                        }
                    </div>
                    }
                </div>
            </div>
            <PostsList posts={posts} setPosts={setPosts} isMe={user.current._id === currentId} />
        </div>
    );
}