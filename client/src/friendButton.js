import { useState, useEffect } from "react";

export default function FriendButton(props) {
    const [friendship, setFriendship] = useState([]);
    const [position, setPosition] = useState(1);
    const [buttonText, setButtonText] = useState("Send Friend Request");
    const [sender, setSender] = useState("");
    const [receiver, setReceiver] = useState(0);

    console.log("Other", props.otherUserId);
    useEffect(() => {
        fetch(`/friendship/${props.otherUserId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("data: ", data);
                console.log("props.otherUserId", props.otherUserId);
                console.log("props.logged", props.loggedInUserId);

                setSender(data[0]?.sender_id);
                setReceiver(data[0]?.recipient_id);
                // hier muessen wir setzen was ist value vom sender und was ist value vom receiver
                setFriendship(data || []);
            });
    }, []);

    const sendFriendRequest = (sender_id, recipient_id) => {
        console.log("sender_id: ", sender_id);
        fetch("/friendship-status/sendFriendRequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sender_id, recipient_id }),
        })
            .then((res) => res.json())
            .then((data) => {
                setButtonText("Cancel Request");
                setPosition(3);
                console.log("Send friend req data: ", data);
            });
    };

    const acceptFriendRequest = (sender_id, recipient_id) => {
        console.log("running accept request");
        fetch("/friendship-status/acceptFriendRequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sender_id, recipient_id }),
        })
            .then((res) => res.json())
            .then((data) => {
                setPosition(2);
                setButtonText("Unfriend");
                console.log("Send friend req data: ", data);
            });
    };

    const cancelFriendRequest = (id) => {
        fetch("/friendship-status/cancelFriendship", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })
            .then((res) => res.json())
            .then((data) => {
                setPosition(1);
                setButtonText("Send Friend Request");
                console.log("delete friend req data: ", data);
            });
    };

    // const rejectFriendRequest = (id) => {
    //     fetch("/friendship-status/rejectFriendship", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ id }),
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log("delete friend req data: ", data);
    //         });
    // };

    const senderId = friendship[0] && friendship[0].sender_id;
    const accepted = friendship[0] && friendship[0].accepted;
    console.log("this is the real value of friendship :", friendship);

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
            setButtonText("Accept Request");
            setPosition(4);
        }
    }, [props.loggedInUserId, friendship]);

    console.log("sender: ", sender);

    return (
        <>
            <div>
                <br />
                <br />
                <br />
                {position === 1 && (
                    <button
                        className="button-83"
                        onClick={() =>
                            sendFriendRequest(
                                props.loggedInUserId,
                                props.otherUserId
                            )
                        }
                    >
                        {buttonText}
                    </button>
                )}
                {position === 2 && (
                    <>
                        <button
                            className="button-83"
                            onClick={() =>
                                cancelFriendRequest(sender, receiver)
                            }
                        >
                            {buttonText}
                        </button>
                    </>
                )}
                {position === 3 && (
                    <>
                        <button
                            className="button-83"
                            onClick={() =>
                                cancelFriendRequest(sender, receiver)
                            }
                        >
                            {buttonText}
                        </button>
                    </>
                )}
                {position === 4 && (
                    <>
                        <button
                            className="button-83"
                            onClick={() =>
                                acceptFriendRequest(sender, receiver)
                            }
                        >
                            {buttonText}
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
