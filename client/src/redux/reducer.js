import { combineReducers } from "redux";
import friendsReducer from "./friends/slice";
import messagesReducer from "./messages/slice";

const rootReducer = combineReducers({
    friendsWannabees: friendsReducer,
    messages: messagesReducer,
});

export default rootReducer;
