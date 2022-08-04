import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";

export const Register = () => {
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        const {
            username,
            email,
            password,
            repeatPassword,
        } = Object.fromEntries(new FormData(e.target));

        if (password != repeatPassword) {
            navigate('/404');
            return;
        }


        authService.register(username, email, password)
            .then(() => {
                navigate('/');
            })
            .catch(() => {
                navigate('/404');
            })
    }


    return (
        <form id="register" onSubmit={onSubmit}>
            <div className="container">
                <h1>Register</h1>

                <div className="usernameSection">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="John" />
                </div>

                <div className="emailSection">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="john@email.com" />
                </div>

                <div className="passwordSection">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="*********" />
                </div>

                <div className="repeatPasswordSection">
                    <label htmlFor="password">Repeat Password</label>
                    <input type="password" id="repeatPassword" name="repeatPassword" placeholder="*********" />
                </div>

                <div>
                    <input type="submit" className="btn submit" value="Register" />
                </div>

                <div>
                    <p>Already have a profile? <span><Link to='/login'>Click here.</Link></span></p>
                </div>
            </div>
        </form>
    );
}