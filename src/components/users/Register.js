import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import styles from './Register.module.css';

export const Register = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        username: '',
        email: '',
        password: '',
        rePassword: ''
    })
    const [errors, setErrors] = useState({
        username: false,
        uniqueUsername: false,
        email: false,
        password: false,
        rePassword: false
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
        setFormValid(
            input.username.length >= 3 && input.username.length <= 15 
            && (/\S+@\S+\.\S+/.test(input.email)) 
            && input.password.length >= 5 && input.password.length <= 50
            && input.password === input.rePassword);
            console.log(formValid)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        
        if (input.password !== input.rePassword) {
            navigate('/not-found');
            return;
        }

        register(input.username, input.email, input.password)
            .then(() => {
                navigate('/');
            })
            .catch(() => {
                navigate('/not-found');
            })
    }


    const usernameValidator = (e) => {
        setErrors(state => ({
            ...state,
            username: input.username.length < 3 || input.username.length > 15,
            //TODO unique usernames
        }))
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

    const rePasswordValidator = (e) => {
        setErrors(state => ({
            ...state,
            rePassword: input.password !== input.rePassword
        }))
    }


    return (
        <form id="register" onSubmit={onSubmit}>
            <div className="container">
                <h1>Register</h1>

                <div className={styles.area}>
                    <label className={styles.label} htmlFor="username">Username</label>
                    <input className={styles.input}
                        type="text" id="username" name="username"
                        placeholder="John"
                        value={input.username}
                        onChange={onChangeHandler}
                        onBlur={usernameValidator} />
                    {errors.username && <p className={styles.error}>Username should be between 3 and 15 characters long!</p>}
                </div>

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

                <div className={styles.area}>
                    <label className={styles.label} htmlFor="rePassword">Repeat Password</label>
                    <input className={styles.input}
                        type="password" id="rePassword" name="rePassword"
                        placeholder="*********"
                        value={input.rePassword}
                        onChange={onChangeHandler}
                        onBlur={rePasswordValidator} />
                    {errors.rePassword && <p className={styles.error}>Passwords should match!</p>}
                </div>

                <div>
                    <input type="submit" disabled={!formValid} className={styles.btn} value="Register" />
                </div>

                <div>
                    <p>Already have a profile? <span><Link className={styles.span} to='/login'>Click here.</Link></span></p>
                </div>
            </div>
        </form>
    );
}