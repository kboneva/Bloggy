import { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { ThemeContext } from './contexts/ThemeContext';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Spinner } from './components/common/Spinner';
import { Header } from './components/common/Header/Header';
import { Footer } from './components/common/Footer/Footer';
import { Catalog } from "./components/pages/Catalog/Catalog";
import { Register } from "./components/users/Register/Register";
import { Login } from "./components/users/Login/Login";
import { Logout } from './components/users/Logout';
import { Error } from "./components/pages/Error/Error";
import { Profile } from './components/users/Profile/Profile';
import { Settings } from './components/users/Settings/Settings';
import { Welcome } from './components/pages/Welcome/Welcome';
import { Details } from './components/posts/Details/Details';
import { isDarkTheme, updateThemePreference } from './services/userService';

import './App.css';
import { ResponsiveContext } from './contexts/ResponsiveContext';
import { onValue, ref } from 'firebase/database';
import { UsernameContext } from './contexts/UsernameContext';

function App() {
    const [authentication, setAuthentication] = useState({
        authenticated: false,
        initializing: true
    });
    const [darkTheme, setDarkTheme] = useState(false);
    const [width, setWindowWidth] = useState(0)
    const [username, setUsername] = useState('');
    const updateDimensions = () => {
        const width = window.innerWidth
        setWindowWidth(width)
    }

    const darkThemeToggle = (_id) => {
        updateThemePreference(_id)
            .then(() => {
                setDarkTheme(!darkTheme);
            });
    }

    useEffect(() => {
        auth.onAuthStateChanged(authUser => {
            if (authUser) {
                onValue(ref(db, "/users/" + authUser.uid + "/username"), (snapshot) => {
                    console.log(snapshot.val());
                    setUsername(snapshot.val());
                })
                isDarkTheme(authUser.uid)
                    .then(value => {
                        setDarkTheme(value);
                        setAuthentication({
                            authenticated: true,
                            initializing: false
                        });
                    })
            }
            else {
                setDarkTheme(false);
                setAuthentication({
                    authenticated: false,
                    initializing: false
                });
            }
        })

        updateDimensions();

        window.addEventListener("resize", updateDimensions);
        return () =>
            window.removeEventListener("resize", updateDimensions);
    }, [])


    const responsive = {
        isMobile: width < 730
    }

    if (authentication.initializing) {
        return <Spinner />;
    }
    return (
        <ThemeContext.Provider value={{ darkTheme, darkThemeToggle }}>
            <ResponsiveContext.Provider value={{ isMobile: responsive.isMobile }}>
                <div className={`appSection ${darkTheme ? "dark" : "light"}-theme`}>
                    <UsernameContext.Provider value={{username}}>
                        <Header />
                    </UsernameContext.Provider>

                    <main>
                        <div className='mainSection'>
                            {authentication.authenticated
                                ? <Routes>
                                    <Route path="/" element={<Catalog />} />
                                    <Route path="/:username" element={<Profile />} />
                                    <Route path="/profile" element={<Navigate to={`/${username}`} replace />} />
                                    <Route path='/post/:postId' element={<Details />} />
                                    <Route path='/settings' element={<Settings />} />
                                    <Route path="/logout" element={<Logout />} />
                                    <Route path="/not-found" element={<Error />} />
                                </Routes>
                                : <Routes>
                                    <Route path="/" element={<Welcome />} />
                                    <Route path="/Catalog" element={<Catalog />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/not-found" element={<Error />} />
                                    <Route path="/*" element={<Navigate to={"/not-found"} replace />} />
                                </Routes>
                            }
                        </div>
                    </main>

                    <Footer />
                </div>
            </ResponsiveContext.Provider>
        </ThemeContext.Provider>
    );
}

export default App;
