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

    // this.setState((state) => {
    //     return { text: state };
    // });

    const handleChange = (e) => {
        e.preventDefault();
        setMessages(e.target.value);
        // this.setState({ text: "" });
    };

    useEffect(() => {
        chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }, [messages]);

    return (
        <section className="titleBird">
            <h1>Bird Chat</h1>
            <br />
            <br />
            <div className="outerBox">
                {messages &&
                    messages.length > 0 &&
                    messages.map((message) => {
                        return (
                            <>
                                <div className="messageBox">
                                    <div key={message.id}>
                                        <img
                                            src={message.url || "/chicken.png"}
                                            height={50}
                                            width={50}
                                            className="chatImage"
                                        ></img>
                                        <p className="nameOf">
                                            {message.first} {message.last} said:
                                            {}
                                        </p>
                                        <p className="message">
                                            {message.message}
                                        </p>
                                        <p className="dateAndTime">
                                            On {}
                                            <Moment
                                                format="DD.MM.YYYY HH:MM,"
                                                date={message.created_at}
                                            />
                                        </p>
                                    </div>
                                </div>
                                <br />
                                <br />
                            </>
                        );
                    })}
            </div>
            <section ref={chatContainer}></section>
            <div className="inputField">
                <mat-form-field appearance="fill">
                    <input
                        placeholder="Chime in!"
                        onChange={handleChange}
                    ></input>
                </mat-form-field>
                <button onClick={sendMessage} className="button-83">
                    Submit
                </button>
                <br />
                <br />
                <br />
            </div>
            {/* <textarea
                placeholder={"Chime In!"}
                onChange={handleChange}
            ></textarea> */}
        </section>
    );
}
