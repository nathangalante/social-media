import { useState, useEffect } from "react";

export default function FriendButton() {
    const [friendship, setFriendship] = useState();

    useEffect(() => {
        fetch("/friendButton")
            .then((res) => res.json())
            .then(({ rows }) => {
                console.log(friendship);
                console.log(rows);
                setFriendship(rows);
            });
    });
    return (
        <>
            <div>
                <br />
                <br />
                <br />
                <button>Friendship Request</button>
            </div>
        </>
    );
}
