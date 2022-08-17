import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UsernameContext } from "../../../../contexts/UsernameContext";
import styles from './Dropdown.module.css';

export const Dropdown = () => {
    const [contentDiv, setContentDiv] = useState(false);
    const { username } = useContext(UsernameContext);

    const onBlur = () => {
        setTimeout(() => {
            setContentDiv(false);
        }, 100);
    }

    return (
        <div className={styles.dropdown}>
            <button onClick={() => setContentDiv(true)} onBlur={() => onBlur()} className={`${styles.navlink} navBtn`}>{username}</button>
            {contentDiv && <div className={styles.content}>
                <Link className={`${styles.link} dropdown-theme`} to={"/profile"}>Profile</Link>
                <Link className={`${styles.link} dropdown-theme`} to={'/settings'}>Settings</Link>
                <Link className={`${styles.link} dropdown-theme`} to={'/logout'}>Log out</Link>
            </div>}
        </div>
    );
}