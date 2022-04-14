import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function findPeople() {
    const [searchTerm, setSearchTerm] = useState();
    const [users, setUsers] = useState();
    const history = useHistory();

    useEffect(() => {
        if (!searchTerm) {
            console.log("should get most recently signed up");
            fetch("/find-users.json")
                .then((res) => res.json())
                .then(({ rows }) => {
                    setUsers(rows);
                });
        } else {
            let abort;
            fetch(`/find-users/${searchTerm}`)
                .then((res) => res.json())
                .then(({ rows }) => {
                    if (!abort) {
                        console.log("this are users", users);
                        setUsers(rows);
                    }
                });
            return () => (abort = true);
        }
    }, [searchTerm]);

    return (
        <div id={"findPeople"}>
            <input
                className="searchQuery"
                placeholder="Type a search query"
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                }}
            />
            <div className="users">
                {users &&
                    users.map((user) => (
                        <div key={user.id}>
                            <img
                                src={user.url || "/logo.jpeg"}
                                alt="otherProfilePic"
                                className="findProfilePic"
                                onClick={() => {
                                    history.replace(`/user/${user.id}`);
                                }}
                            />
                            <p className="userPhoto">
                                {user.first} {user.last}
                            </p>
                        </div>
                    ))}
            </div>
        </div>
    );
}
