import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ProfilePic from "./profilePic";
import FriendButton from "./friendButton";

export default function OtherProfile() {
    const params = useParams();
    const history = useHistory();
    const [user, setUser] = useState({});

    useEffect(() => {
        fetch(`/find/user/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(
                    "this is what i'm getting back from the server",
                    data[0]
                );
                if (data.success) {
                    return history.reload("/");
                } else {
                    return setUser(data[0]);
                }
            })
            .catch((err) => {
                console.log(
                    "there was an error fetching info from user: ",
                    err
                );
            });

        // deal with the response and store it in the response
    }, []);

    return (
        <>
            {!user.id && <p>User doesnt exist</p>}
            {user.id && (
                <div className="imageContainer">
                    <h2 className="imageName">
                        {user.first} {user.last}
                    </h2>
                    <ProfilePic
                        first={user.first}
                        last={user.last}
                        url={user.url}
                        sizing={"mainProfilePic"}
                    />
                    <p className="otherProfileBio">{user.bio}</p>
                    <FriendButton />
                </div>
            )}
        </>
    );
    // Other Profile display user information from your state
}
