import {  Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import styles from './Login.module.css';

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

                    <div className={styles.area}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input className={styles.input} type="email" id="email" name="email" placeholder="john@email.com" />
                    </div>

                    <div className={styles.area}>
                        <label className={styles.label} htmlFor="password">Password</label>
                        <input className={styles.input} type="password" id="password" name="password" placeholder="*********" />
                    </div>

                    <div>
                        <input type="submit" className={styles.btn} value="Login"/>
                    </div>

                    <div>
                        <p>Don't have an account? <span><Link className={styles.span} to='/register'>Click here.</Link></span></p>
                    </div>
                </div>
            </form>
    );
}