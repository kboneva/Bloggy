import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { auth } from "../../firebase";
import styles from './Settings.module.css';
import { AvatarForm } from "./SettingsForms/AvatarForm";
import { EmailForm } from "./SettingsForms/EmailForm";
import { PasswordForm } from "./SettingsForms/PasswordForm";
import { UsernameForm } from "./SettingsForms/UsernameForm";

export const Settings = () => {
    const user = auth.currentUser;
    const { darkTheme, darkThemeToggle } = useContext(ThemeContext);

    return (
        <div>
            <UsernameForm />

            <AvatarForm />

            <EmailForm />

            <PasswordForm />

            <div className="flex border">
                <p className={styles.text}>{darkTheme ? "Dark" : "Light"} Theme</p>
                <button className={styles.invisible} onClick={() => darkThemeToggle(user.uid)}>
                    <i className={`${styles.toggle} icon-color fas fa-toggle-${darkTheme ? "on" : "off"}`}></i>
                </button>
            </div>
        </div>
    );
}