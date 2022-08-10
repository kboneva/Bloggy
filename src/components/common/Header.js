import { Link } from 'react-router-dom'
import { auth } from '../../firebase';

export const Header = () => {

    return (
        <header>
            <div className='headerSection flex-wrapper'>
                <div>
                    <Link className='logo navlink' to={"/"}>Bloggy</Link>
                </div>
                {!!auth.currentUser
                    ? <div id='user' className='flex-wrapper'>

                        <div className="search-container">
                            <input className='search-bar' type="text" id="search" name="search" placeholder="Search users" />
                            <button value="Search"><i className="fa fa-search"></i></button>
                        </div>
                        {/* // TODO leave this for later  */}



                        <div className='dropdown'>
                            <Link className='navlink' to={"/profile"}>{auth.currentUser.displayName}</Link>
                            <div className='dropdown-content'>
                                <Link to={'/settings'}>Edit profile</Link>
                                <Link to={'/logout'}>Log out</Link>
                            </div>
                        </div>
                    </div>

                    : <div id='guest' className='flex-wrapper'>
                        <Link className='navlink' to={"/login"}>Login</Link>
                        <Link className='navlink' to={"/register"}>Register</Link>
                    </div>
                }
            </div>
        </header>
    );
}