import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContext } from "../../../contexts/ResponsiveContext";
import { auth } from "../../../firebase";
import { getAllPosts, getPostsFromFollowing, loadMorePostsAll, loadMorePostsFollowing } from "../../../services/postService";
import { allPostPreference, updatePostPreference } from "../../../services/userService";
import { PostsList } from "../../posts/PostsList/PostsList";
import styles from './Catalog.module.css'

export const Catalog = () => {
    const { isMobile } = useContext(ResponsiveContext);
    const [posts, setPosts] = useState([]);
    const [maxCount, setMaxCount] = useState(0);
    const [displayFollowing, setDisplayFollowing] = useState(false);
    const currentId = !!auth.currentUser ? auth.currentUser.uid : '';
    const [reachedMax, setReachedMax] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        allPostPreference(currentId)
            .then(result => {
                setDisplayFollowing(!result);
                if (result) {
                    getAllPosts()
                        .then(data => {
                            setPosts(data.list);
                            setMaxCount(data.maxCount);
                        })
                }
                else {
                    getPostsFromFollowing(currentId)
                        .then(data => {
                            setPosts(data.list);
                            setMaxCount(data.maxCount);
                        })
                }
            })
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])


    useEffect(() => {
        if (posts.length !== 0 && maxCount > posts.length && posts.length <= 4) {
            if (displayFollowing) {
                getPostsFromFollowing(currentId)
                    .then(data => {
                        setPosts(data.list);
                    })
            }
            else {
                getAllPosts()
                    .then(data => {
                        setPosts(data.list);
                    })
            }
        }
    }, [posts.length])


    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if (reachedMax) return;
        if (currentId === '') return;
        setLoadMore(true);
    }

    useEffect(() => {
        if (!loadMore) return;
        if (posts.length >= maxCount) {
            setReachedMax(true);
            setLoadMore(false);
            return;
        }
        setIsLoading(true);
        loadMorePosts();
    }, [loadMore]);


    const loadMorePosts = () => {
        if (!displayFollowing) {
            loadMorePostsAll(posts.length)
                .then(data => {
                    setPosts(data);
                })
        }
        else {
            loadMorePostsFollowing(currentId, posts.length)
                .then(data => {
                    setPosts(data);
                })

        }
        setLoadMore(false);
        setIsLoading(false);
    }


    const postsToggle = () => {
        setReachedMax(false);
        updatePostPreference(currentId)
            .then(result => {
                setDisplayFollowing(!result);
                if (result) {
                    getAllPosts()
                        .then(data => {
                            setPosts(data.list);
                            setMaxCount(data.maxCount);
                        })
                }
                else {
                    getPostsFromFollowing(currentId)
                        .then(data => {
                            setPosts(data.list);
                            setMaxCount(data.maxCount);
                        })
                }
            })
    }

    return (
        <div className={styles.box}>
            <h1 className={styles.title}>Home</h1>
            {!!currentId ? <button className={`${styles.btn} color-blue`} onClick={() => postsToggle()}>{!isMobile && "Show "}{displayFollowing
                ? (isMobile ? <i className={`${styles.icon} fas fa-user-friends`}></i> : "all posts")
                : (isMobile ? <i className={`${styles.icon} fas fa-user-check`}></i> : "posts from people you follow")}</button>
            : <div><br /><br /></div>}
            <PostsList posts={posts} setPosts={setPosts} setMaxCount={setMaxCount} isMe={auth.currentUser} />
            {isLoading && <div>...</div>}
            {currentId === '' && <div className={styles.signup}>
                <h2>You need to sign in to continue!</h2>
                <button onClick={() => navigate('/register')} className={`${styles.signBtn} primary-color-blue`} >Sign up</button>
                <button onClick={() => navigate('/login')} className={`${styles.signBtn} `}>Sign in</button>
            </div>}
        </div>
    );
}