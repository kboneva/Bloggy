import styles from './Form.module.css'

export const AvatarForm = ({ avatarChangeHandler, setImageSelected, errors, resetErrors, formToggle }) => {
    return (
        <div className="border">
            <form className="flex" onSubmit={avatarChangeHandler}>
                <div className={styles.area}>
                <label className={styles.label} htmlFor="avatar">New Avatar</label>
                <input className={styles.input}
                    onChange={(e) => {setImageSelected(e.target.files[0]); resetErrors();}}
                    type="file" id="avatar" name="avatar"
                />
                {errors.invalidImage && <p className={styles.error}>Not a valid type of image!</p>}
                {errors.noImage && <p className={styles.error}>Please select an image!</p>}
                {errors.someThingWentWrong && <p className={styles.error}>Something went wrong.</p>}
                </div>

                <div>
                    <button type='submit' className={`${styles.btn} color-blue`}><i className={`${styles.icon} fas fa-check`}></i></button>
                    <button className={`${styles.btn} danger`} onClick={() => formToggle('avatar')}><i className={`${styles.icon} fas fa-times`}></i></button>
                </div>
            </form>
        </div>
    );
}