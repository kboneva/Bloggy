import { Link } from 'react-router-dom'
import { auth } from '../../../firebase';
import { Search } from './Search/Search';
import { Dropdown } from './Dropdown/Dropdown';
import styles from './Header.module.css'
import { useContext, useState } from 'react';
import { ResponsiveContext } from '../../../contexts/ResponsiveContext';

export const Header = () => {
    const { isMobile } = useContext(ResponsiveContext);
    const [searchNav, setSearchNav] = useState(false);
    const [loginNav, setLoginNav] = useState(false);

    const closeLoginNav = () => {
        setTimeout(() => {
            setLoginNav(false);
        }, 100);
    }

    return (
        <header>
            <div className="headerSection flex">
                {!searchNav && !loginNav && <div className='flex'>
                    <Link className={styles.logo} to={"/"}>Bloggy</Link>
                    {!auth.currentUser && <Link className={styles.navlink} to={"/Catalog"}>Catalog</Link>}
                </div>}
                {!!auth.currentUser
                    ? <div id='user'>
                        {isMobile
                            ? <div>
                                {searchNav
                                    ? <div className='flex'>
                                        <Search setSearchNav={setSearchNav} />
                                        <button onClick={() => setSearchNav(false)} className={`${styles.btn} danger`}><i className={`${styles.icon} fas fa-times`}></i></button>
                                    </div>
                                    : <div className='flex'>
                                        <button className={`${styles.btn} color-blue`} onClick={() => setSearchNav(true)}><i className={`${styles.icon} fas fa-search`}></i></button>

                                        <Dropdown />
                                    </div>}
                            </div>
                            : <div className="flex">
                                <Search />

                                <Dropdown />
                            </div>}
                    </div>

                    : <div id='guest'>
                        {isMobile ?
                            <div>
                                {loginNav
                                    ? <div className='flex'>
                                        <div className='flex'>
                                            <Link onClick={() => closeLoginNav()} className={styles.navlink} to={"/login"}>Login</Link>
                                            <Link onClick={() => closeLoginNav()} className={styles.navlink} to={"/register"}>Register</Link>
                                        </div>
                                        <button onClick={() => setLoginNav(false)} className={`${styles.signInBtnClose} danger`}><i className={`${styles.icon} fas fa-times`}></i></button>
                                    </div>
                                    : <button className={`${styles.btn} color-blue`} onClick={() => setLoginNav(true)}><i className={`${styles.icon} fas fa-sign-in-alt`}></i></button>}
                            </div>
                            : <div className="flex">
                                <Link className={styles.navlink} to={"/login"}>Login</Link>
                                <Link className={styles.navlink} to={"/register"}>Register</Link>
                            </div>}
                    </div>
                }
            </div>
        </header>
    );
}