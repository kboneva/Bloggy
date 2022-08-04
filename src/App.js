
import { Routes, Route } from 'react-router-dom';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Home } from "./components/pages/Home";
import { Login } from "./components/users/Login";
import { Register } from "./components/users/Register";
import { Error } from "./components/pages/Error";
import { Logout } from './components/users/Logout';

import './App.css';

function App() {
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
