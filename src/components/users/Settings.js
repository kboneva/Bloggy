import { useContext, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { auth } from "../../firebase";
import { changeAvatar, changeEmail, changePassword, changeUsername } from "../../services/authService";
import { uploadAvatar } from "../../services/fileService";
import { isUsernameUnique, updateAvatar } from "../../services/userService";
import styles from './Settings.module.css';
import { AvatarForm } from "./SettingsForms/AvatarForm";
import { EmailForm } from "./SettingsForms/EmailForm";
import { PasswordForm } from "./SettingsForms/PasswordForm";
import { UsernameForm } from "./SettingsForms/UsernameForm";

export const Settings = () => {
    const user = auth.currentUser;
    const { darkTheme, darkThemeToggle } = useContext(ThemeContext);
    const [imageSelected, setImageSelected] = useState(null);
    const [forms, setForms] = useState({
        username: false,
        avatar: false,
        email: false,
        password: false
    });
    const [errors, setErrors] = useState({
        usernameLength: false,
        usernameTaken: false,
        invalidEmail: false,
        emailTaken: false,
        someThingWentWrong: false,
        passwordWrong: false,
        passwordLength: false,
        noImage: false,
        invalidImage: false
    })
    const [success, setSuccess] = useState({
        username: false,
        avatar: false,
        email: false,
        password: false
    })

    const resetErrors = () => {
        setErrors(false, false, false, false, false, false, false, false, false)
    }

    const resetSuccess = () => {
        setSuccess(false, false, false, false);
    }

    const formToggle = (target) => {
        setForms(state => ({
            ...state,
            [target]: !forms[target]
        }));
        resetErrors();
        resetSuccess();
    }


    const usernameChangeHandler = (e) => {
        e.preventDefault();

        const { username } = Object.fromEntries(new FormData(e.target));

        if (username === user.displayName) {
            e.target.reset();
            formToggle('username');
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
                            formToggle('username');
                            setSuccess(state => ({
                                ...state,
                                username: true
                            }))
                            setTimeout(() => {
                                setSuccess(state => ({
                                    ...state,
                                    username: false
                                }))
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

    const avatarChangeHandler = (e) => {
        e.preventDefault();

        if (imageSelected === null) {
            setErrors(state => ({
                ...state,
                noImage: true
            }))
            return;
        }

        if (imageSelected.type !== "image/png" && imageSelected.type !== "image/jpeg") {
            setErrors(state => ({
                ...state,
                invalidImage: true
            }))
            return;
        }

        uploadAvatar(imageSelected)
            .then(url => {
                changeAvatar(url)
                    .then(() => {
                        e.target.reset();
                        formToggle('avatar');
                        setSuccess(state => ({
                            ...state,
                            avatar: true
                        }))
                        setTimeout(() => {
                            setSuccess(state => ({
                                ...state,
                                avatar: false
                            }))
                        }, 2000);
                    })
                    .catch(er => {
                        console.log(er.code);
                        setErrors(state => ({
                            ...state,
                            someThingWentWrong: true
                        }))
                    })
            })
            .catch(er => {
                console.log(er.code);
                setErrors(state => ({
                    ...state,
                    someThingWentWrong: true
                }))
            })
    }

    const emailChangeHandler = (e) => {
        e.preventDefault();

        const { email, password } = Object.fromEntries(new FormData(e.target));

        if (email === user.email) {
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

        changeEmail(user.email, password, email)
            .then(() => {
                e.target.reset();
                formToggle('email');
                setSuccess(state => ({
                    ...state,
                    email: true
                }))
                setTimeout(() => {
                    setSuccess(state => ({
                        ...state,
                        email: false
                    }))
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


    const passwordChangeHandler = (e) => {
        e.preventDefault();

        const { newPassword, oldPassword } = Object.fromEntries(new FormData(e.target));

        if (newPassword.length < 5 || newPassword.length > 50) {
            setErrors(state => ({
                ...state,
                passwordLength: true
            }))
        }

        changePassword(oldPassword, user.email, newPassword)
            .then(() => {
                e.target.reset();
                formToggle('password');
                setSuccess(state => ({
                    ...state,
                    password: true
                }))
                setTimeout(() => {
                    setSuccess(state => ({
                        ...state,
                        password: false
                    }))
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
        <div>
            {!forms.username
                ? <div className="flex border">
                    <div className={styles.area}>
                        <p className={styles.text}>Username: {user.displayName}</p>
                        {success.username && <span className={styles.success}>Successfully changed username.</span>}
                    </div>

                    <button className={`${styles.invisible} color-blue`} onClick={() => formToggle('username')}>
                        <i className={`${styles.edit} icon-color fas fa-edit`}></i>
                    </button>
                </div>
                : <UsernameForm usernameChangeHandler={usernameChangeHandler} username={user.displayName} errors={errors} resetErrors={resetErrors} formToggle={formToggle} />}



            {!forms.avatar
                ? <div className="flex border">
                    <div className={styles.area}>
                        <div className="flex">
                            <p className={styles.text}>Avatar: </p>
                            <img className={styles.avatar} src={user.photoURL} alt="avatar"></img>
                        </div>
                        {success.avatar && <span className={styles.success}>Successfully changed Avatar.</span>}
                    </div>

                    <button className={`${styles.invisible} color-blue`} onClick={() => formToggle('avatar')}>
                        <i className={`${styles.edit} icon-color fas fa-edit`}></i>
                    </button>
                </div>
                : <AvatarForm avatarChangeHandler={avatarChangeHandler} setImageSelected={setImageSelected} errors={errors} resetErrors={resetErrors} formToggle={formToggle} />}



            {!forms.email
                ? <div className="flex border">
                    <div className={styles.area}>
                        <p className={styles.text}>Email: {user.email}</p>
                        {success.email && <span className={styles.success}>Successfully changed email.</span>}
                    </div>

                    <button className={`${styles.invisible} color-blue`} onClick={() => formToggle('email')}>
                        <i className={`${styles.edit} icon-color fas fa-edit`}></i>
                    </button>
                </div>
                : <EmailForm emailChangeHandler={emailChangeHandler} email={user.email} errors={errors} resetErrors={resetErrors} formToggle={formToggle} />
            }



            {!forms.password
                ? <div className="flex border">
                    <div className={styles.area}>
                        <p className={styles.text}>Change password</p>
                        {success.password && <span className={styles.success}>Successfully changed password.</span>}
                    </div>

                    <button className={`${styles.invisible} color-blue`} onClick={() => formToggle('password')}>
                        <i className={`${styles.edit} icon-color fas fa-edit`}></i>
                    </button>
                </div>
                : <PasswordForm passwordChangeHandler={passwordChangeHandler} errors={errors} resetErrors={resetErrors} formToggle={formToggle} />}



            <div className="flex border">
                <p className={styles.text}>{darkTheme ? "Dark" : "Light"} Theme</p>
                <button className={styles.invisible} onClick={() => darkThemeToggle(user.uid)}>
                    <i className={`${styles.toggle} icon-color fas fa-toggle-${darkTheme ? "on" : "off"}`}></i>
                </button>
            </div>
        </div>
    );
}