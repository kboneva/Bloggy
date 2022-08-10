import { useNavigate } from "react-router-dom";
import styles from './Search.module.css'

export const Search = () => {
    const navigate = useNavigate();

    return (
        <div>
            <input className={styles.searchBar} type="text" id="search" name="search" placeholder="Search users" />
            <button className={`${styles.searchBtn} search`} value="Search"><i className="fa fa-search"></i></button>
            <div className={styles.searchResult}></div>
        </div>
    );
}