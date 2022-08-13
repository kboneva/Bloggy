import styles from './Form.module.css'

export const PasswordForm = ({ passwordChangeHandler, errors, resetErrors, formToggle }) => {
    return (
        <div className="border">
            <form className="flex" onSubmit={passwordChangeHandler}>
                <div className={styles.area}>
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
                    <button className={`${styles.btn} danger`} onClick={() => formToggle('password')}><i className={`${styles.icon} fas fa-times`}></i></button>
                </div>
            </form>
        </div>
    );
}