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
