import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { socket } from "./socket.js";
import { useRef } from "react";
import Moment from "react-moment";

export default function Chat() {
    const chatContainer = useRef();
    const messages = useSelector((state) => state.messages);
    const [value, setMessages] = useState("");

    const sendMessage = () => {
        setMessages("");
        socket.emit("message", { message: value });
        console.log("messages on Chat", messages);
        console.log("these are the messages sent", setMessages);
    };

    const handleChange = (e) => {
        setMessages(e.target.value);
    };

    useEffect(() => {
        chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }, [messages]);

    return (
        <section>
            <h1>Bird Chat</h1>
            <div>
                {messages &&
                    messages.length > 0 &&
                    messages.map((message) => {
                        return (
                            <div key={message.id}>
                                <img
                                    src={message.url || "/chicken.png"}
                                    height={50}
                                    width={50}
                                ></img>
                                <p>
                                    {message.first} {message.last} said{}
                                </p>
                                <p>{message.message}</p>
                                <p>
                                    On {}
                                    <Moment
                                        format="DD.MM.YYYY HH:MM,"
                                        date={message.created_at}
                                    />
                                </p>
                            </div>
                        );
                    })}
            </div>
            <section ref={chatContainer}></section>
            <textarea
                placeholder={"Chime In!"}
                onChange={handleChange}
            ></textarea>
            <button onClick={sendMessage}>Submit</button>
        </section>
    );
}
