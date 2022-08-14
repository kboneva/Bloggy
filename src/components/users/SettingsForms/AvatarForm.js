import { useState } from 'react';
import { auth } from '../../../firebase';
import { changeAvatar } from '../../../services/authService';
import { uploadAvatar } from '../../../services/fileService';
import styles from './Form.module.css'

export const AvatarForm = () => {
    const photoURL = auth.currentUser.photoURL;
    const [imageSelected, setImageSelected] = useState(null);
    const [form, setForm] = useState(false);
    const [errors, setErrors] = useState({
        noImage: false,
        invalidImage: false,
        someThingWentWrong: false
    })
    const [success, setSuccess] = useState(false)

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
                        setSuccess(true);
                        setTimeout(() => {
                            setSuccess(false);
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

    return (
        <div className="border">
            {!form
                ? <div className="flex">
                    <div className={styles.area}>
                        <div className="flex">
                            <p className={styles.text}>Avatar: </p>
                            <img className={styles.avatar} src={photoURL} alt="avatar"></img>
                        </div>
                        {success && <span className={styles.success}>Successfully changed Avatar.</span>}
                    </div>

                    <button className={`${styles.invisible} color-blue`} onClick={() => formToggle()}>
                        <i className={`${styles.edit} icon-color fas fa-edit`}></i>
                    </button>
                </div>
                : <form className="flex" onSubmit={avatarChangeHandler}>
                    <div className={styles.form}>
                        <label className={styles.label} htmlFor="avatar">New Avatar</label>
                        <input className={styles.input}
                            onChange={(e) => { setImageSelected(e.target.files[0]); resetErrors(); }}
                            type="file" id="avatar" name="avatar"
                        />
                        {errors.invalidImage && <p className={styles.error}>Not a valid type of image!</p>}
                        {errors.noImage && <p className={styles.error}>Please select an image!</p>}
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