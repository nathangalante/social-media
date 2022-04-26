export default function messagesReducer(chatMessages = [], action) {
    if (action.type === "messages/received") {
        chatMessages = action.payload.data.reverse();
    } else if (action.type === "message/sent") {
        chatMessages = [...chatMessages, action.payload];
    }
    console.log("hello chat messages:", chatMessages);

    return chatMessages;
}

export function receivedChatMessages(messages) {
    console.log("messages", messages);
    return {
        type: "messages/received",
        payload: messages,
    };
}

export function sendNewMessage(message) {
    return {
        type: "message/sent",
        payload: message,
    };
}
