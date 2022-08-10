import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getPostById } from "../../services/postService";
import { getUserById } from "../../services/userService";
import { Spinner } from "../common/Spinner";
import { Like } from "./Like";
import styles from './Details.module.css';

export const Details = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        getPostById(postId)
            .then(postResult => {
                setPost(postResult);
                getUserById(postResult.userId)
                    .then(user => {
                        setUser(user);
                    })

            })
    }, [])


    if (!post || !user) {
        return <Spinner />
    }
    return (
        <div className="border">
            <div className="flexStart">
                <Link to={`/${user.username}`}><img src={user.avatar} className={styles.avatar} alt="" /></Link>
                <div>
                    <Link to={`/${user.username}`}><span className={styles.username}>{user.username}</span></Link>
                    <p>{post.text}</p>
                </div>
            </div>
            <Like postId={postId} />
        </div>
    );
}