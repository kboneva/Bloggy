import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import styles from './Dropdown.module.css';

export const Dropdown = () => {
    return (
        <div className={styles.dropdown}>
            <span className={styles.navlink}>{auth.currentUser.displayName}</span>
            <div className={styles.content}>
                <Link className={`${styles.link} dropdown-theme`} to={"/profile"}>Profile</Link>
                <Link className={`${styles.link} dropdown-theme`} to={'/settings'}>Settings</Link>
                <Link className={`${styles.link} dropdown-theme`} to={'/logout'}>Log out</Link>
            </div>
        </div>
    );
}