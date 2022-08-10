import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import styles from './Register.module.css';

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

        if (password !== repeatPassword) {
            navigate('/not-found');
            return;
        }

        register(username, email, password)
            .then(() => {
                navigate('/');
            })
            .catch(() => {
                navigate('/not-found');
            })
    }


    return (
        <form id="register" onSubmit={onSubmit}>
            <div className="container">
                <h1>Register</h1>

                <div className={styles.area}>
                    <label className={styles.label} htmlFor="username">Username</label>
                    <input className={styles.input} type="text" id="username" name="username" placeholder="John" />
                </div>

                <div className={styles.area}>
                    <label className={styles.label} htmlFor="email">Email</label>
                    <input className={styles.input} type="email" id="email" name="email" placeholder="john@email.com" />
                </div>

                <div className={styles.area}>
                    <label className={styles.label} htmlFor="password">Password</label>
                    <input className={styles.input} type="password" id="password" name="password" placeholder="*********" />
                </div>

                <div className={styles.area}>
                    <label className={styles.label} htmlFor="password">Repeat Password</label>
                    <input className={styles.input} type="password" id="repeatPassword" name="repeatPassword" placeholder="*********" />
                </div>

                <div>
                    <input type="submit" className={styles.btn} value="Register" />
                </div>

                <div>
                    <p>Already have a profile? <span><Link className={styles.span} to='/login'>Click here.</Link></span></p>
                </div>
            </div>
        </form>
    );
}