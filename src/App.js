
import { Routes, Route, Navigate } from 'react-router-dom';

import { Spinner } from './components/common/Spinner';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Home } from "./components/pages/Home";
import { Login } from "./components/users/Login";
import { Register } from "./components/users/Register";
import { Error } from "./components/pages/Error";
import { Logout } from './components/users/Logout';

import './App.css';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { Profile } from './components/users/Profile';
import { AddPost } from './components/posts/AddPost';


function App() {
    const [authentication, setAuthentication] = useState({
        authenticated: false,
        initializing: true
    });

    useEffect(() =>
        auth.onAuthStateChanged(authUser => {
            if (authUser) {
                setAuthentication({
                    authenticated: true,
                    initializing: false
                });
            }
            else {
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
        <div className='appSection'>
            <Header />

            <main>
                <div className='mainSection'>
                    {authentication.authenticated
                        ? <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/:username" element={<Profile />} />
                            <Route path="/profile" element={<Navigate to={`/${auth.currentUser.displayName}`} replace />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/add" element={<AddPost />} />
                            <Route path="/not-found" element={<Error />} />
                        </Routes>
                        : <Routes>
                            <Route path="/" element={<Home />} />
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
    );
}

export default App;
