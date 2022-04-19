import { useState, useEffect } from "react";

export default function FriendButton(props) {
    const [friendship, setFriendship] = useState([]);
    const [position, setPosition] = useState(1);
    const [buttonText, setButtonText] = useState("Send Friend Request");

    console.log("Other", props.otherUserId);
    useEffect(() => {
        fetch(`/friendship/${props.otherUserId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("friendship: ", friendship);
                setFriendship(data || []);
            });
    }, []);

    const sendFriendRequest = (sender_id, recipient_id) => {
        fetch("/friendship-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sender_id, recipient_id }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Send friend req data: ", data);
            });
    };

    // const cancelFriendRequest =

    const senderId = friendship[0] && friendship[0].sender_id;
    const accepted = friendship[0] && friendship[0].accepted;
    console.log("error en la amistad :", friendship);

    useEffect(() => {
        console.log(props.loggedInUserId, senderId);
        if (friendship.length === 0) {
            // case where there is no friendship or request
            setPosition(1);
        } else if (accepted === true) {
            // case where there is friendship
            setButtonText("Unfriend");
            setPosition(2);
        } else if (props.loggedInUserId === senderId) {
            // case where i already sent a request to a recipient
            setButtonText("Cancel Request");
            setPosition(3);
        } else if (props.loggedInUserId !== senderId) {
            // case where recipient already sent me a request
            setButtonText("Cancel Request");
            setPosition(4);
        }
    }, [props.loggedInUserId, friendship]);

    return (
        <>
            <div>
                <br />
                <br />
                <br />
                <button
                    onClick={() =>
                        sendFriendRequest(
                            props.loggedInUserId,
                            props.otherUserId
                        )
                    }
                >
                    {buttonText}
                </button>
                {position === 4 && (
                    <>
                        <button>Accept Request</button>
                        <button>Reject Request</button>
                    </>
                )}
            </div>
        </>
    );
}
