import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PostContext } from "../../contexts/PostContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { auth } from "../../firebase";
import { getUserById } from "../../services/userService";
import { Like } from "./Like";
import styles from './Post.module.css'

export const Post = ({ post }) => {
    const [user, setUser] = useState(null);
    const currentId = auth.currentUser.uid;
    const { darkTheme } = useContext(ThemeContext);
    const { deleteHandler } = useContext(PostContext);

    useEffect(() => {
        getUserById(post.userId)
            .then(user => {
                setUser(user);
            })
    }, [])

    if (!user) {
        return '';
    }
    return (
        <div className="border">
            <Link to={`/post/${post._id}`}>
                <div className="flex">
                    <div className="flexStart">
                        <object><Link to={`/${user.username}`}><img src={user.avatar} className={styles.avatar} alt="" /></Link></object>
                        <div>
                            <object><Link to={`/${user.username}`}><span className={styles.username}>{user.username}</span></Link></object>
                            <div className={styles.text}>{post.text}</div>
                        </div>
                    </div>
                </div>
            </Link>
            <hr />
            <div className="flex">
                <Like postId={post._id} />
                {currentId === post.userId && <button className={`${styles.btn} ${darkTheme ? "dark" : "white"}-danger`} onClick={() => deleteHandler(post._id)}><i className={`${styles.icon} fas fa-times`}></i></button>}
            </div>
        </div>
    );
}