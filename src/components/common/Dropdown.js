import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import styles from './Dropdown.module.css';

export const Dropdown = () => {
    return (
        <div className={styles.dropdown}>
            <Link className={styles.navlink} to={"/profile"}>{auth.currentUser.displayName}</Link>
            <div className={styles.content}>
                <Link className={`${styles.link} dropdown-theme`} to={'/settings'}>Edit profile</Link>
                <Link className={`${styles.link} dropdown-theme`} to={'/logout'}>Log out</Link>
            </div>
        </div>
    );
}