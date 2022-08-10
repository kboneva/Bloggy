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
                <button className={`${styles.btn} ${darkTheme ? "dark" : "white"}-color-blue`}>Change</button>
            </div>
            {/* avatar */}
            <div className="flex border">
                <p className={styles.text}>Email: {user.email}</p>
                <button className={`${styles.btn} ${darkTheme ? "dark" : "white"}-color-blue`}>Change</button>
            </div>
            <div className="flex border">
                <p className={styles.text}>Verified: {user.emailVerified ? "Yes" : "No"}</p>
                <button className={`${styles.btn} ${darkTheme ? "dark" : "white"}-color-blue`}>Change</button>
            </div>
            <div className="flex border">
                <p className={styles.text}>{darkTheme ? "Dark" : "Light"} Theme</p>
                <button className={styles.invisible} onClick={() => darkThemeToggle(user.uid)}>{darkTheme ? <i className={`${styles.icon} icon-color fas fa-toggle-on`}></i> : <i className={`${styles.icon} icon-color fas fa-toggle-off`}></i>}</button>
            </div>
        </div>
    );
}