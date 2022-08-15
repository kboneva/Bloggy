import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css';

export const Welcome = () => {
    const navigate = useNavigate()

    return (
        <div className={styles.mainBox}>
            <h1 className={styles.title}>Welcome!</h1>
            <p className={styles.text}>Bloggy is a place where you can share your experiences with others.</p>
            <div className={styles.signBox}>
                <button onClick={() => navigate('/register')} className={`${styles.btn} primary-color-blue`} >Create an Account</button>
                <button onClick={() => navigate('/login')} className={`${styles.btn} `}>Login</button>
            </div>
        </div>
    );
}