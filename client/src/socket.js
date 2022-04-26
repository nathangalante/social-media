import { io } from "socket.io-client";
import { receivedChatMessages, sendNewMessage } from "./redux/messages/slice";

export let socket;

export const init = (store) => {
    if (!socket) {
        console.log("INITIALIZE CONNECTION");
        socket = io.connect();
        socket.on("last-10-messages", (data) => {
            // console.log("got last 10 messages", data);
            store.dispatch(receivedChatMessages(data));
        });

        socket.on("message-broadcast", (message) => {
            console.log("new stuff", message);
            store.dispatch(sendNewMessage(message));
        });
    }
};
