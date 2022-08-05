
import { Routes, Route } from 'react-router-dom';

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


function App() {
    const [authenticated, setAuthenticated] = useState(!!auth.currentUser); // TODO possibly do this better? unused state var, only used to refresh the component

    useEffect(() => {
        auth.onAuthStateChanged(authUser => {
            console.log("Auth user:", authUser);
            if (authUser) {
                setAuthenticated(true);
            }
            else {
                setAuthenticated(false);
            }
        })
    }, [])


    return (
        <div className='appSection'>
            <Header />

            <main>
                <div className='mainSection'>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="*" element={<Error />} />
                    </Routes>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default App;
