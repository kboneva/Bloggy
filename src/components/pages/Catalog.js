import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { getAllPosts, getPostsFromFollowing, loadMorePostsAll, loadMorePostsFollowing } from "../../services/postService";
import { allPostPreference, updatePostPreference } from "../../services/userService";
import { PostsList } from "../posts/PostsList";
import styles from './Catalog.module.css'

export const Catalog = () => {
    const [posts, setPosts] = useState([]);
    const [maxCount, setMaxCount] = useState(0);
    const [displayFollowing, setDisplayFollowing] = useState(false);
    const currentId = !!auth.currentUser ? auth.currentUser.uid : '';
    const [reachedMax, setReachedMax] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


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
        if (posts.length != 0 && maxCount > posts.length && posts.length <= 4) {
            console.log("too little posts");
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
            {!!currentId && <button className={`${styles.btn} color-blue`} onClick={() => postsToggle()}>Show {displayFollowing ? "all posts" : "posts from people you follow"}</button>}
            <PostsList posts={posts} setPosts={setPosts} setMaxCount={setMaxCount} isMe={!!auth.currentUser} />
            {isLoading && <div>...</div>}
        </div>
    );
}