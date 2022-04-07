import ReactDOM from "react-dom";
import Welcome from "./welcome";
// import Login from "./login";

// start.js
fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        console.log("data:", data);
        if (!data.userId) {
            // this means the user does not have the right cookie, and should
            // see registration,( login or pw reset)
            ReactDOM.render(<Welcome />, document.querySelector("main"));
            // ReactDOM.render(<Login />, document.querySelector("main"));
        } else {
            // this means the user is logged in cause their browser DID have a cookie
            ReactDOM.render(
                <img src="/img/nameOfImg.png" alt=" logo" />,
                document.querySelector("main")
            );
        }
    });
