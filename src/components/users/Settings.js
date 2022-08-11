import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { auth } from "../../firebase";
import styles from './Settings.module.css';

export const Settings = () => {
    const user = auth.currentUser;
    const { darkTheme, darkThemeToggle } = useContext(ThemeContext);

    return (
        <div>
            <div className="flex border">
                <p className={styles.text}>Username: {user.displayName}</p>
                <button className={`${styles.btn} color-blue`}>Change</button>
            </div>
            {/* avatar */}
            <div className="flex border">
                <p className={styles.text}>Email: {user.email}</p>
                <button className={`${styles.btn} color-blue`}>Change</button>
            </div>
            <div className="flex border">
                <p className={styles.text}>Verified: {user.emailVerified ? "Yes" : "No"}</p>
                <button className={`${styles.btn} color-blue`}>Change</button>
            </div>
            <div className="flex border">
                <p className={styles.text}>{darkTheme ? "Dark" : "Light"} Theme</p>
                <button className={styles.invisible} onClick={() => darkThemeToggle(user.uid)}><i className={`${styles.icon} icon-color fas fa-toggle-${darkTheme ? "on" : "off"}`}></i></button>
            </div>
        </div>
    );
}