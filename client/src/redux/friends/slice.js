// this is our friends-wannabees sub-reducer
// in here- we MUST make copies for every array and object
// no mutating allowed!

// import { createStore, applyMiddleware } from "redux";
// import thunk from "redux-thunk";
// import rootReducer from "./reducers/index";

// const store = createStore(rootReducer, applyMiddleware(thunk));

export default function friendsWannabeesReducer(friends = null, action) {
    if (action.type === "friends-wannabees/accept") {
        return friends.map((friend) => {
            if (friend.id == action.payload.id) {
                return { ...friend, accepted: true };
            }
            return friend;
        });
    }
    if (action.type === "friends-wannabees/receive") {
        console.log("action", action);
        return [...action.payload.data];
    }
    if (action.type === "friends-wannabees/unfriend") {
        return friends.filter((friend) => {
            if (friend.id != action.payload.data) {
                return friend;
            }
        });
    }

    return friends;
}

// Actions go below

export function makeFriend(id) {
    return {
        type: "friends-wannabees/accept",
        payload: { id },
    };
}
export function receiveFriendsAndWannabees(data) {
    console.log("data on receive friendsandwannabees: ", data);
    return {
        type: "friends-wannabees/receive",
        payload: { data },
    };
}
export function makeUnfriend(data) {
    return {
        type: "friends-wannabees/unfriend",
        payload: { data },
    };
}
