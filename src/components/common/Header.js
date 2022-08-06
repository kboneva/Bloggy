import { Link } from 'react-router-dom'
import { auth } from '../../firebase';

export const Header = () => {

    return (
        <header>
            <div className='headerSection flex-wrapper'>
                <div>
                    <Link className='logo navlink' to={"/"}>Bloggy</Link>
                </div>
                {!!auth.currentUser // TODO replace Log out with Settings drop down, log out inside
                    ? <div id='user' className='flex-wrapper'>
                        <Link className='navlink' to={"/profile"}>{auth.currentUser.displayName}</Link>
                        {/* <Link className='navlink' to={"/logout"}>Log out</Link> */}
                        <div className='dropdown'>
                            <button className='btn navlink'>Settings</button>
                            <div className='dropdown-content'>
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