import styles from './Form.module.css'

export const EmailForm = ({ emailChangeHandler, email, errors, resetErrors, formToggle }) => {
    return (
        <div className="border">
            <form className="flex" onSubmit={emailChangeHandler}>
                <div className={styles.area}>
                    <label className={styles.label} htmlFor="email">New Email</label>
                    <input className={styles.input}
                        type="email" id="email" name="email"
                        defaultValue={email}
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

                <div>
                    <button type='submit' className={`${styles.btn} color-blue`}><i className={`${styles.icon} fas fa-check`}></i></button>
                    <button className={`${styles.btn} danger`} onClick={() => formToggle('email')}><i className={`${styles.icon} fas fa-times`}></i></button>
                </div>
            </form>
        </div>
    );
}