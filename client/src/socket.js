import { io } from "socket.io-client";
// import { receivedMessages } from "./redux/messages/slice.js";

export let socket;

export const init = (store) => {
    if (!socket) {
        console.log("INITIALIZE CONNECTION");
        socket = io.connect();

        // // 1. save last messages to the store
        // socket.on("last-10-messages", (data) => {
        //     console.log("data last-10-messages: ", data);
        //     store.dispatch(receivedMessages(data));
        //     store.dispatch({
        //         type: "messages / received",
        //         payload: data,
        //     });
        // });

        // 2. save new incoming mesages to the store

        // listen to "message-broadcast"

        //dispatch an action to update the store
    }
};

// in order to always show the bottom of the scroll on flex:

// #message-container {
// flex-direction: column;
// felx-direction: row-reverse}

// second option:
// <section
