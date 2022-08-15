import { useState } from 'react';
import { auth } from '../../../../firebase';
import { changeUsername } from '../../../../services/authService';
import { isUsernameUnique } from '../../../../services/userService';
import styles from './Form.module.css'

export const UsernameForm = () => {
    const displayName = auth.currentUser.displayName;
    const [form, setForm] = useState(false);
    const [errors, setErrors] = useState({
        usernameLength: false,
        usernameTaken: false,
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

    const usernameChangeHandler = (e) => {
        e.preventDefault();

        const { username } = Object.fromEntries(new FormData(e.target));

        if (username === displayName) {
            e.target.reset();
            formToggle();
            return;
        }

        if (username.length < 3 || username.length > 15) {
            setErrors(state => ({
                ...state,
                usernameLength: true
            }))
            return;
        }

        isUsernameUnique(username)
            .then(result => {
                if (result) {
                    changeUsername(username)
                        .then(() => {
                            e.target.reset();
                            formToggle();
                            setSuccess(true);
                            setTimeout(() => {
                                setSuccess(false);
                            }, 2000);
                        })
                        .catch((er) => {
                            console.log(er.code);
                            setErrors(state => ({
                                ...state,
                                someThingWentWrong: true
                            }))
                        })
                }
                else {
                    setErrors(state => ({
                        ...state,
                        usernameTaken: true
                    }))
                }
            })


    }
    return (
        <div className="border">
            {!form
                ? <div className="flex">
                    <div className={styles.area}>
                        <p className={styles.text}>Username: {displayName}</p>
                        {success && <span className={styles.success}>Successfully changed username.</span>}
                    </div>

                    <button className={`${styles.invisible} color-blue`} onClick={() => formToggle()}>
                        <i className={`${styles.edit} icon-color fas fa-edit`}></i>
                    </button>
                </div>
                : <form className="flex" onSubmit={usernameChangeHandler}>
                    <div className={styles.form}>
                        <label className={styles.label} htmlFor="username">New Username</label>
                        <input className={styles.input}
                            type="text" id="username" name="username"
                            defaultValue={displayName}
                            onChange={() => resetErrors()}
                        />
                        {errors.usernameTaken && <p className={styles.error}>Username is already taken!</p>}
                        {errors.usernameLength && <p className={styles.error}>Username should be between 3 and 15 characters long!</p>}
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