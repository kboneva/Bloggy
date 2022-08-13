import styles from './Form.module.css'

export const UsernameForm = ({ usernameChangeHandler, username, errors, resetErrors, formToggle }) => {
    return (
        <div className="border">
            <form className="flex" onSubmit={usernameChangeHandler}>
                <div className={styles.area}>
                    <label className={styles.label} htmlFor="username">New Username</label>
                    <input className={styles.input}
                        type="text" id="username" name="username"
                        defaultValue={username}
                        onChange={() => resetErrors()}
                    />
                    {errors.usernameTaken && <p className={styles.error}>Username is already taken!</p>}
                    {errors.usernameLength && <p className={styles.error}>Username should be between 3 and 15 characters long!</p>}
                    {errors.someThingWentWrong && <p className={styles.error}>Something went wrong.</p>}
                </div>

                <div>
                    <button type='submit' className={`${styles.btn} color-blue`}><i className={`${styles.icon} fas fa-check`}></i></button>
                    <button className={`${styles.btn} danger`} onClick={() => formToggle('username')}><i className={`${styles.icon} fas fa-times`}></i></button>
                </div>
            </form>
        </div>
    );
}