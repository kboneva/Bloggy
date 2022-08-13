import { useState } from 'react';
import { auth } from '../../../firebase';
import { changePassword } from '../../../services/authService';
import styles from './Form.module.css'

export const PasswordForm = () => {
    const email = auth.currentUser.email;
    const [form, setForm] = useState(false);
    const [errors, setErrors] = useState({
        passwordWrong: false,
        passwordLength: false,
        someThingWentWrong: false
    })
    const [success, setSuccess] = useState(false);

    const resetErrors = () => {
        setErrors(false, false, false)
    }

    const resetSuccess = () => {
        setSuccess(false);
    }

    const formToggle = () => {
        setForm(!form);
        resetErrors();
        resetSuccess();
    }

    const passwordChangeHandler = (e) => {
        e.preventDefault();

        const { newPassword, oldPassword } = Object.fromEntries(new FormData(e.target));

        if (newPassword.length < 5 || newPassword.length > 50) {
            setErrors(state => ({
                ...state,
                passwordLength: true
            }))
        }

        changePassword(oldPassword, email, newPassword)
            .then(() => {
                e.target.reset();
                formToggle();
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 2000);
            })
            .catch(er => {
                if (er.code === "auth/wrong-password") {
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
                        <p className={styles.text}>Change password</p>
                        {success && <span className={styles.success}>Successfully changed password.</span>}
                    </div>

                    <button className={`${styles.invisible} color-blue`} onClick={() => formToggle()}>
                        <i className={`${styles.edit} icon-color fas fa-edit`}></i>
                    </button>
                </div>
                : <form className="flex" onSubmit={passwordChangeHandler}>
                <div className={styles.form}>
                    <label className={styles.label} htmlFor="newPassword">New Password</label>
                    <input className={styles.input}
                        type="password" id="newPassword" name="newPassword"
                        onChange={() => resetErrors()}
                    />
                    <label className={styles.label} htmlFor="oldPassword">Confirm Old Password</label>
                    <input className={styles.input}
                        type="password" id="oldPassword" name="oldPassword"
                        onChange={() => resetErrors()}
                    />
                    {errors.passwordLength && <p className={styles.error}>Password should be between 6 and 50 characters long!</p>}
                    {errors.passwordWrong && <p className={styles.error}>Old password is wrong!</p>}
                    {errors.someThingWentWrong && <p className={styles.error}>Something went wrong.</p>}
                </div>

                <div>
                    <button type='submit' className={`${styles.btn} color-blue`}><i className={`${styles.icon} fas fa-check`}></i></button>
                    <button className={`${styles.btn} danger`} onClick={() => formToggle()}><i className={`${styles.icon} fas fa-times`}></i></button>
                </div>
            </form>
            }
        </div>
    );
}