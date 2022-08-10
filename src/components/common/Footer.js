import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer>
            <div className="flex-wrapper upper-row">
                <h4>Contacts</h4>
                <div className="flex-wrapper">
                <Link to=""><i className="fab fa-twitter"></i></Link>
                <Link to=""><i className="fab fa-facebook"></i></Link>
                <Link to=""><i className="fab fa-instagram"></i></Link>
                </div>
            </div>
            <div>
                <p className="text-muted m-3"><small>© 2022 Bloggy, made by KrisyYy for SoftUni ReactJS Course.</small></p>
            </div>
        </footer>
    );
}