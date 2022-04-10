import { Component } from "react";
import { Link } from "react-router-dom";

export default class Registration extends Component {
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
        console.log("This is THIS: ", this.state);
        // every time a change on any of the input fields happens we want to sync that
        // change to our state
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    }
    handleSubmit(e) {
        console.log("user wants to send over data to the server & register");
        e.preventDefault();
        // console.log("data the user provided:", this.state);
        fetch("/register.json", {
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
                    location.reload();
                } else {
                    resp.json({ success: false });
                    this.setState({
                        error: "Something went wrong! Please try again",
                    });
                }
            })
            .catch((err) => {
                console.log("err on fetch register.json", err);
                this.setState({
                    error: "Something went wrong! Please try again",
                });

                // make sure to set our error state in the component's state
            });
    }
    render() {
        return (
            <section className="inputs">
                <h2 className="someClass">Register</h2>
                <br />
                {this.state.error && <h2>{this.state.error}</h2>}
                <form>
                    <input
                        name="first"
                        placeholder="First Name"
                        type="text"
                        onChange={this.handleChange}
                    />
                    <input
                        name="last"
                        placeholder="Last Name"
                        type="text"
                        onChange={this.handleChange}
                    />
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
                        Register
                    </button>
                    <Link to="/login" className="link">
                        Click here to Log-in
                    </Link>
                </form>
            </section>
        );
    }
}
