import { Link } from 'react-router-dom'
import { auth } from '../../firebase';
import { Search } from './Search';
import { Dropdown } from './Dropdown';
import styles from './Header.module.css'

export const Header = () => {

    return (
        <header>
            <div className="headerSection flex">
                <div>
                    <Link className={styles.logo} to={"/"}>Bloggy</Link>
                </div>
                {!!auth.currentUser
                    ? <div id='user' className="flex">
                        <Search />
                        {/* // TODO leave this for later  */}

                        <Dropdown />
                    </div>

                    : <div id='guest' className="flex">
                        <Link className={styles.navlink} to={"/login"}>Login</Link>
                        <Link className={styles.navlink}to={"/register"}>Register</Link>
                    </div>
                }
            </div>
        </header>
    );
}