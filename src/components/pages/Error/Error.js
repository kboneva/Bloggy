import { useNavigate } from 'react-router-dom';
import styles from './Error.module.css';

export const Error = () => {
    const navigate = useNavigate()
    return (
        <div>
            <h1 className={styles.title}>Page not found</h1>
            <p className={styles.text}>We can't seem to find the page you are looking for. Are you sure the URL is correct?</p>
            <button className={styles.btn} onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );
}