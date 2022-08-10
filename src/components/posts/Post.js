import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PostContext } from "../../contexts/PostContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { auth } from "../../firebase";
import { getUserById } from "../../services/userService";
import { Spinner } from "../common/Spinner";

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
    })

    if (!user) {
        return '';
    }
    return (
        <div className="border-box flex-wrapper">
            <div className="flex-wrapper flex-left flex-align">
                <img src={user.avatar} className="avatar-s" alt="" />
                <div>
                    <Link to={`/${user.username}`}><span className="username">{user.username}</span></Link>
                    <div className="post-text">{post.text}</div>
                </div>
            </div>
            {currentId === post.userId && <button className={`circle-btn ${darkTheme ? "dark" : "white"}-danger`} onClick={() => deleteHandler(post._id)}><i className="fas fa-times"></i></button>} 
        </div>
    );
}