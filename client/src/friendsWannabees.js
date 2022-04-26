import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
    receiveFriendsAndWannabees,
    makeFriend,
    makeUnfriend,
} from "./redux/friends/slice";
// import your action creators here!

export default function FriendsWannabees() {
    // This gives you access to the dispatch function
    const dispatch = useDispatch();

    // You are selecting Wannabees from the global state
    // before you target a property in state, make sure you know what it looks like!
    const wannabees = useSelector(
        (state) =>
            state.friendsWannabees &&
            state.friendsWannabees.filter((friendship) => !friendship.accepted)
    );

    const friends = useSelector(
        (state) =>
            state.friendsWannabees &&
            state.friendsWannabees.filter((friendship) => friendship.accepted)
    );

    console.log("wannabees: ", wannabees);
    console.log("friends: ", friends);

    // Make sure you select your "friends" from state using useSelector
    // .....

    // When component mounts, get all friends and wannabees
    useEffect(() => {
        fetch("/friends-wannabees")
            .then((res) => res.json())
            .then((data) => {
                console.log("friends data", data);
                dispatch(receiveFriendsAndWannabees(data));
            })
            .catch((err) => {
                console.log("error fetching friends", err);
            });
        // STEP 1 - make a GET request using fetch to retrieve the friends and wannabees
        // STEP 2 - once you have that data back, call dispatch and pass it an action to add this data to redux
        // you'll need to create and import the action creator below
    }, []);

    const handleAccept = (id) => {
        fetch("/accept-wannabee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                dispatch(makeFriend(id));
            });
        // STEP 1 - make a POST request to update the DB
        // STEP 2 - dispatch an action to update the global state

        // you'll need to create and import the action creator below
    };
    const handleUnfriend = (id) => {
        fetch("/friendship-status/cancelFriendship", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                dispatch(makeUnfriend(id));
            });
        // STEP 1 - make a POST request to update the DB
        // STEP 2 - dispatch an action to update the global state

        // you'll need to create and import the action creator below
    };

    return (
        <section>
            <h1>Friends</h1>
            {friends?.map((friend) => {
                return (
                    <div key={friend.id}>
                        <img
                            src={friend.url || "/logo.jpeg"}
                            height={150}
                            width={150}
                        ></img>
                        <h3>
                            {friend.first} {friend.last}
                        </h3>

                        <button onClick={() => handleUnfriend(friend.id)}>
                            Unfriend
                        </button>
                    </div>
                );
            })}
            {/* Display your friends */}

            <h1>Wannabees</h1>
            {wannabees?.map((wannabee) => {
                return (
                    <div key={wannabee.id}>
                        <img
                            src={wannabee.url || "/logo.jpeg"}
                            height={150}
                            width={150}
                        ></img>
                        <h3>
                            {wannabee.first} {wannabee.last}
                        </h3>
                        <button onClick={() => handleAccept(wannabee.id)}>
                            Accept
                        </button>
                    </div>
                );
            })}
        </section>
    );
}
