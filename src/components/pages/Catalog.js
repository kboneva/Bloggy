import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { getAllPosts, getPostsFromFollowing } from "../../services/postService";
import { allPostPreference, updatePostPreference } from "../../services/userService";
import { PostsList } from "../posts/PostsList";
import styles from './Catalog.module.css'

export const Catalog = () => {
    const [posts, setPosts] = useState([]);
    const [followingPosts, setFollowingPosts] = useState([]);
    const [displayFollowing, setDisplayFollowing] = useState(false);
    const currentId = !!auth.currentUser ? auth.currentUser.uid : '';

    useEffect(() => {
        allPostPreference(currentId)
            .then(result => {
                setDisplayFollowing(!result);
                if (result) {
                    getAllPosts()
                        .then(data => {
                            setPosts(data);
                        })
                }
                else {
                    getPostsFromFollowing(currentId)
                        .then(data => {
                            setFollowingPosts(data);
                        })
                    
                }
            })
        
    }, [])

    const postsToggle = () => {
        updatePostPreference(currentId)
            .then(result => {
                setDisplayFollowing(!result);
                if (result) {
                    getAllPosts()
                        .then(data => {
                            setPosts(data);
                        })
                }
                else {
                    getPostsFromFollowing(currentId)
                        .then(data => {
                            setFollowingPosts(data);
                        })
                    
                }
            })

    }

    return (
        <div className={styles.box}>
            <h1 className={styles.title}>Home</h1>
            {!!currentId && <button className={`${styles.btn} color-blue`} onClick={() => postsToggle()}>Show {displayFollowing ? "all posts" : "posts from people you follow"}</button>}
            {displayFollowing
                ? <PostsList posts={followingPosts} setPosts={setFollowingPosts} isMe={!!auth.currentUser} />
                : <PostsList posts={posts} setPosts={setPosts} isMe={!!auth.currentUser} />}

        </div>
    );
}