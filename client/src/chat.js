import { useSelector } from "react-redux";
import { socket } from "./socket.js";
import { useRef } from "react";

export function Chat() {
    const chatContainer = useRef();

    const sendMessage = () => {
        const message = "hello world!";

        socket.emit("message", { message });

        // chatContainer.current.scrollTop = /* scrollHeight - clientHeight*/;
    };

    return (
        <section>
            <h1>Chat</h1>
            <section ref={chatContainer}></section>
            <textarea placeholder={"Chime In!"}></textarea>
            <button onClick={sendMessage}>Submit</button>
        </section>
    );
}
