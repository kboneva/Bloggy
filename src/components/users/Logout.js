import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';

export const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        logout()
            .then(() => {
                navigate('/');
            })
            .catch(() => {
                navigate('/');
            });
    }, []);

    return null;
}