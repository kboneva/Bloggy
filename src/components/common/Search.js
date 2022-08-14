import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchUsers } from "../../services/userService";
import styles from './Search.module.css'

export const Search = () => {
    const [input, setInput] = useState('')
    const [searchResult, setSearchResult] = useState([]);
    const navigate = useNavigate();

    const onChangeHandler = (e) => {
        setInput(e.target.value);
        if (e.target.value !== '') {
            searchUsers(e.target.value)
                .then(result => {
                    setSearchResult(result);
                })
        }
        else {
            setSearchResult([]);
        }
    }

    const resetInput = (e) => {
        setTimeout(() => {
            setInput('');
            setSearchResult([]);
        }, 100);
    }

    return (
        <div>
            <input className={styles.searchBar}
                type="text" id="search" name="search" placeholder="Search users"
                value={input} onChange={onChangeHandler}
                onBlur={resetInput} />
            <button className={`${styles.searchBtn} search`} value="Search"><i className="fa fa-search"></i></button>

            {searchResult.length > 0 && <div className={`${styles.searchResult} searchRes`}>
                {searchResult.map(user =>
                    <div key={user._id}>
                        <Link className={`${styles.user} dropdown-theme`} to={`/${user.username}`}>{user.username}</Link>
                    </div>)}
            </div>}
        </div>
    );
}