import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import {  getAllPosts } from "../../services/postService";
import { PostsList } from "../posts/PostsList";
import styles from './Catalog.module.css'

export const Catalog = () => {
    const [posts, setPosts] = useState([]);
    const currentId = auth.currentUser.uid;

    useEffect(() => {
        getAllPosts(currentId)
            .then(data => {
                setPosts(data);
            })
    }, [])

    return (
        <div>
            <h1 className={styles.title}>Home</h1>
            <PostsList posts={posts} setPosts={setPosts} isMe={true}/>
        </div>
    );
}