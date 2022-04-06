import ReactDOM from "react-dom";
// import { Name } from "./name.js";
import { Counter } from "./counter.js";

ReactDOM.render(<HelloWorld />, document.querySelector("main"));

function HelloWorld() {
    return (
        <div>
            <div>
                <Counter />
            </div>
        </div>
    );
}
