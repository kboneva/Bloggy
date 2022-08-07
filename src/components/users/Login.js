import {  Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

export const Login = () => {
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        const {
            email,
            password,
        } = Object.fromEntries(new FormData(e.target));


        login(email, password)
        .then(() => {
            navigate('/');
        })
        .catch(() => {
            navigate('/not-found');
        });
    }


    return (
        <form id="login" onSubmit={onSubmit}>
                <div className="container">
                    <h1>Login</h1>

                    <div className="emailSection">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="john@email.com" />
                    </div>

                    <div className="passwordSection">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="*********" />
                    </div>

                    <div>
                        <input type="submit" className="btn submit" value="Login"/>
                    </div>

                    <div>
                        <p>Don't have an account? <span><Link to='/register'>Click here.</Link></span></p>
                    </div>
                </div>
            </form>
    );
}