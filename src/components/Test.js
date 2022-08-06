import { User } from './users/User';

import * as userService from "../services/userService";

import { useEffect, useState } from "react";

export const Test = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        userService.getAll()
            .then(result => 
                Object.entries(result).map(([id, user]) => {
                    return {
                        _id: id,
                        ...user
                    }
                }))
            .then(res => {
                setUsers(res);
                setLoading(false);
            })
    }, [])

    return (
        <div>
            {loading && <p>Loading...</p>}
            {users.map(user => 
                <User key={user._id} {...user} />
            )}
        </div>
    );
}