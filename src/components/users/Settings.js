import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { auth } from "../../firebase";

export const Settings = () => {
    const user = auth.currentUser;
    const { darkTheme, darkThemeToggle } = useContext(ThemeContext);

    return (
        <div>
            <div className="flex-wrapper border-box">
                <p className="username">Username: {user.displayName}</p>
                <button className={`big-btn ${darkTheme ? "dark" : "white"}-color-blue`}>Change</button>
            </div>
            {/* <div className="flex-wrapper">
                <img src={user.photoURL} className="avatar-s" alt="avatar" />
                <button>Change</button>
            </div> */}
            <div className="flex-wrapper border-box">
                <p className="username">Email: {user.email}</p>
                <button className={`big-btn ${darkTheme ? "dark" : "white"}-color-blue`}>Change</button>
            </div>
            <div className="flex-wrapper border-box">
                <p className="username">Verified: {user.emailVerified ? "Yes" : "No"}</p>
                <button className={`big-btn ${darkTheme ? "dark" : "white"}-color-blue`}>Change</button>
            </div>
            <div className="flex-wrapper border-box">
                <p className="username">{darkTheme ? "Dark" : "Light"} Theme</p>
                <button className="invisible-btn" onClick={() => darkThemeToggle(user.uid)}>{darkTheme ? <i className="icon-color fas fa-toggle-on"></i> : <i className="icon-color fas fa-toggle-off"></i>}</button>
            </div>
        </div>
    );
}