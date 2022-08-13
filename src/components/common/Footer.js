import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export const Footer = () => {
    return (
        <footer>
            <div className={`flex ${styles.upperRow}`}>
                <h4 className={styles.contacts}>Contacts</h4>
                <div className="flex">
                <Link to=""><i className="fab fa-twitter"></i></Link>
                <Link to=""><i className="fab fa-facebook"></i></Link>
                <Link to=""><i className="fab fa-instagram"></i></Link>
                </div>
            </div>
            <div>
                <p className={styles.copyright}>© 2022 Bloggy, made by KrisyYy for SoftUni ReactJS Course.</p>
            </div>
        </footer>
    );
}