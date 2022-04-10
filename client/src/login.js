import { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        console.log("Registration just mounted");
    }
    handleChange(evt) {
        // console.log("user is typing in the input field :)");
        // console.log("which input field is my user tpying in?", evt.target.name);
        // console.log("what is my user typing?", evt.target.value);
        // console.log("This is THIS: ", this.state);
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    }
    handleSubmit(e) {
        console.log("user wants to send over data to the server & register");
        e.preventDefault();
        fetch("/login.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log("server response from POST /register.json", resp);
                if (resp.success === true) {
                    resp.redirect("/profilePic");
                    // location.reload();
                } else {
                    this.setState({
                        error: "E-mail and/or Password are incorrect",
                    });
                }
            })
            .catch((err) => {
                console.log("err on fetch register.json", err);
                this.setState({
                    error: "Something went wrong with the server! Please contact your provider",
                });
            });
    }
    render() {
        return (
            <section className="inputs">
                <h2>Log-in</h2>
                {this.state.error && <h2>{this.state.error}</h2>}
                <form>
                    <input
                        name="email"
                        placeholder="E-mail"
                        type="email"
                        onChange={this.handleChange}
                    />
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={this.handleChange}
                    />
                    <button
                        className="button-83"
                        role="button"
                        onClick={this.handleSubmit}
                    >
                        Log-in
                    </button>
                    <Link to="/register" className="link">
                        Click here to Register
                    </Link>
                    <br />
                    <Link to="/reset" className="link">
                        Forgot your password?
                    </Link>
                </form>
            </section>
        );
    }
}
