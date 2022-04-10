// below we are importing sth not exported as default
import { BrowserRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Reset from "./reset";

export default function Welcome() {
    return (
        <div className="chicken">
            <div id="welcome">
                <h1>Put a bird on it</h1>
                <BrowserRouter>
                    <div>
                        <Route exact path="/register">
                            <Registration />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/reset">
                            <Reset />
                        </Route>
                    </div>
                </BrowserRouter>
            </div>
        </div>
    );
}
