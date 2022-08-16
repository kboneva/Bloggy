import { useEffect, useState } from 'react';
import { auth } from './firebase';
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

function App() {
    const [authentication, setAuthentication] = useState({
        authenticated: false,
        initializing: true
    });
    const [darkTheme, setDarkTheme] = useState(false);
    // const [themeColor, setThemeColor] = useState()

    const darkThemeToggle = (_id) => {
        updateThemePreference(_id)
        .then(() => {
            setDarkTheme(!darkTheme);
        });
    }

    useEffect(() =>
        auth.onAuthStateChanged(authUser => {
            if (authUser) {
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
        }), [])

    if (authentication.initializing) {
        return <Spinner />;
    }
    return (
        <ThemeContext.Provider value={{darkTheme, darkThemeToggle}}>
            <div className={`appSection ${darkTheme ? "dark" : "light"}-theme`}>
            <Header />

            <main>
                <div className='mainSection'>
                    {authentication.authenticated
                        ? <Routes>
                            <Route path="/" element={<Catalog />} />
                            <Route path="/:username" element={<Profile />} />
                            <Route path="/profile" element={<Navigate to={`/${auth.currentUser.displayName}`} replace />} />
                            <Route path='/post/:postId' element={<Details />} />
                            <Route path='/settings' element={<Settings />}/>
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
        </ThemeContext.Provider>
    );
}

export default App;
