import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";
import { auth } from "../../firebase";
import { follow, isFollowing, unfollow } from "../../services/followService";
import { getPostsFrom } from "../../services/postService";
import { getUserByName } from "../../services/userService";
import { Spinner } from "../common/Spinner";
import { PostsList } from "../posts/PostsList";
import styles from './Profile.module.css';

export const Profile = () => {
    const { username } = useParams();
    const currentId = auth.currentUser.uid;
    const { darkTheme } = useContext(ThemeContext);
    const [user, setUser] = useState({
        current: null,
        loaded: false
    })
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

    if (!user.loaded) {
        return <Spinner />;
    }
    return (
        !!user.current && <div>
            <div className="flexStart border">
                <img src={user.current.avatar} className={styles.avatar} alt="avatar" />
                <div>
                    <h1>{user.current.username}</h1> {/* TODO write followers*/}
                    {user.current._id !== currentId && <div>
                        {!following
                            ? <button className={`${styles.btn} ${darkTheme ? "dark" : "white"}-color-blue`} onClick={followHandler}>Follow</button>
                            : <button className={`${styles.btn} ${darkTheme ? "dark" : "white"}-danger`} onClick={unFollowHandler}>Unfollow</button>
                        }
                    </div>
                    }
                </div>
            </div>
            <PostsList posts={posts} setPosts={setPosts} isMe={user.current._id === currentId} />
        </div>
    );
}