// messages reducer

export default function messagesReducer(state, action) {
    // reducer logic for messages

    return /*updateState*/;
}

// messages action creators

function receivedMessages(messages) {
    return {
        type: "messages/received",
        payload: messages,
    };
}
