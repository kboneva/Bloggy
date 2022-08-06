import { auth } from "../../firebase";
//import { getUserById } from "../../services/userService";

export const Profile = () => {
    const user = auth.currentUser;
    //const userDetails = getUserById(user.uid);

    return (
        <div>
            <img src={user.photoURL} alt="avatar" />
            <h1>{user.displayName}</h1>
            <p>{user.email}</p>
        </div>
    );
}