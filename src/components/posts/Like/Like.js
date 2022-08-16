import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { dislike, getLikes, like } from "../../../services/likeService";
import styles from './Like.module.css';

export const Like = ({postId, detailed, left}) => {
    const currentId = !!auth.currentUser ? auth.currentUser.uid : '';
    const [likes, setLikes] = useState({
        status: false,
        list: []
    });

    useEffect(() => {
        getLikes(currentId, postId)
            .then(likeResult => {
                setLikes(likeResult);
            })
    }, [])

    const likeHandler = () => {
        like(currentId, postId)
            .then(() => {
                const newList = [...likes.list, { _id: currentId }];
                setLikes({
                    status: true,
                    list: newList
                })
            });
    }

    const dislikeHandler = () => {
        dislike(currentId, postId)
            .then(() => {
                const newList = likes.list.filter(x => currentId !== x._id)
                setLikes({
                    status: false,
                    list: newList
                })
            });
    }

    return (
        !!likes.list && <div className={styles.likes}>
            { left && <span className={styles.text}>{likes.list.length || "0"}{detailed ? " Likes" : ""}</span>}
            {!likes.status
                ? <button className={`${styles.btn} color-blue`} onClick={likeHandler}><i className="far fa-heart"></i></button>
                : <button className={`${styles.btn} danger`} onClick={dislikeHandler}><i className="fas fa-heart"></i></button>
            }
            { !left && <span className={styles.text}>{likes.list.length || "0"}{detailed ? " Likes" : ""}</span>}
        </div>
    );
}