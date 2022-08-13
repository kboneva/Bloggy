import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import styles from './Login.module.css';

export const Login = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({
        email: false,
        password: false
    })
    const [authErrors, setAuthErrors] = useState({
        doesNotExist: false
    })
    const [formValid, setFormValid] = useState(false);

    const onChangeHandler = (e) => {
        setInput(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
        setErrors(state => ({
            ...state,
            [e.target.name]: false
        }))
        setAuthErrors(false ,false);
        setFormValid((/\S+@\S+\.\S+/.test(input.email)) && input.password.length >= 5 && input.password.length <= 50);
    }


    const onSubmit = (e) => {
        e.preventDefault();

        login(input.email, input.password)
            .then(() => {
                navigate('/');
            })
            .catch((e) => {
                if (e.code === "auth/user-not-found") {
                    setAuthErrors({doesNotExist: true})
                }
                else {
                    console.log(e.code);
                    navigate('/not-found');
                }
            });
    }


    const emailValidator = (e) => {
        setErrors(state => ({
            ...state,
            email: !(/\S+@\S+\.\S+/.test(input.email))
        }))
    }

    const passwordValidator = (e) => {
        setErrors(state => ({
            ...state,
            password: input.password.length < 5 || input.password.length > 50
        }))
    }

    
    return (
        <form id="login" onSubmit={onSubmit}>
            <div className={styles.container}>
                <h1 className={styles.title}>Login</h1>

                <div className={styles.area}>
                    <label className={styles.label} htmlFor="email">Email</label>
                    <input className={styles.input}
                        type="email" id="email" name="email"
                        placeholder="john@email.com"
                        value={input.email}
                        onChange={onChangeHandler}
                        onBlur={emailValidator} />
                    {errors.email && <p className={styles.error}>Please use a valid email!</p>}
                </div>

                <div className={styles.area}>
                    <label className={styles.label} htmlFor="password">Password</label>
                    <input className={styles.input}
                        type="password" id="password" name="password"
                        placeholder="*********"
                        value={input.password}
                        onChange={onChangeHandler}
                        onBlur={passwordValidator} />
                    {errors.password && <p className={styles.error}>Password should be between 6 and 50 characters long!</p>}
                </div>

                <div>
                    <input type="submit" disabled={!formValid} className={styles.btn} value="Login" />
                    {authErrors.doesNotExist && <p className={styles.error}>Email or password are wrong!</p>}
                </div>

                <div>
                    <p>Don't have an account? <span><Link className={styles.span} to='/register'>Click here.</Link></span></p>
                </div>
            </div>
        </form>
    );
}