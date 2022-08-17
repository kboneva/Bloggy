import { useState } from 'react';
import { auth } from '../../../../firebase';
import { changeEmail } from '../../../../services/authService';
import styles from './Form.module.css'

export const EmailForm = () => {
    const userEmail = auth.currentUser.email;
    const [form, setForm] = useState(false);
    const [errors, setErrors] = useState({
        invalidEmail: false,
        emailTaken: false,
        passwordWrong: false,
        someThingWentWrong: false
    })
    const [success, setSuccess] = useState(false);

    const resetErrors = () => {
        setErrors(false, false, false, false)
    }

    const resetSuccess = () => {
        setSuccess(false);
    }

    const formToggle = () => {
        setForm(!form);
        resetErrors();
        resetSuccess();
    }

    const emailChangeHandler = (e) => {
        e.preventDefault();

        const { email, password } = Object.fromEntries(new FormData(e.target));

        if (email === userEmail) {
            e.target.reset();
            formToggle('email');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors(state => ({
                ...state,
                invalidEmail: true
            }))
            return;
        }

        changeEmail(userEmail, password, email)
            .then(() => {
                e.target.reset();
                formToggle();
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 2000);
            })
            .catch((er) => {
                if (er.code === "auth/email-already-in-use") {
                    setErrors(state => ({
                        ...state,
                        emailTaken: true
                    }))
                }
                else if (er.code === "auth/wrong-password") {
                    setErrors(state => ({
                        ...state,
                        passwordWrong: true
                    }))
                }
                else {
                    console.log(er.code);
                    setErrors(state => ({
                        ...state,
                        someThingWentWrong: true
                    }))
                }
            })
    }


    return (
        <div className="border">
            {!form
                ? <div className="flex">
                    <div className={styles.area}>
                        <p className={styles.text}>Email: {userEmail}</p>
                        {success && <span className={styles.success}>Successfully changed email.</span>}
                    </div>

                    <button className={`${styles.invisible} color-blue`} onClick={() => formToggle()}>
                        <i className={`${styles.edit} icon-color fas fa-edit`}></i>
                    </button>
                </div>
                : <form className="flex" onSubmit={emailChangeHandler}>
                <div className={styles.form}>
                    <label className={styles.label} htmlFor="email">New Email</label>
                    <input className={styles.input}
                        type="email" id="email" name="email"
                        defaultValue={userEmail}
                        onChange={() => resetErrors()}
                    />
                    <label className={styles.label} htmlFor="password">Confirm Password</label>
                    <input className={styles.input}
                        type="password" id="password" name="password"
                        onChange={() => resetErrors()}
                    />
                    {errors.emailTaken && <p className={styles.error}>Email is already taken!</p>}
                    {errors.invalidEmail && <p className={styles.error}>Please use a valid email!</p>}
                    {errors.passwordWrong && <p className={styles.error}>Password is wrong!</p>}
                    {errors.someThingWentWrong && <p className={styles.error}>Something went wrong.</p>}
                </div>

                <div className={styles.buttons}>
                    <button type='submit' className={`${styles.btn} color-blue`}><i className={`${styles.icon} fas fa-check`}></i></button>
                    <button className={`${styles.btn} danger`} onClick={() => formToggle()}><i className={`${styles.icon} fas fa-times`}></i></button>
                </div>
            </form>
            }
        </div>
    );
}