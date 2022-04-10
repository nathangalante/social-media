import { Component } from "react";
import { Link } from "react-router-dom";

export default class Reset extends Component {
    constructor() {
        super();
        this.state = {
            step: 1,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitStart = this.handleSubmitStart.bind(this);
        this.handleSubmitVerify = this.handleSubmitVerify.bind(this);
    }
    componentDidMount() {
        console.log("Registration just mounted");
    }
    handleChange(evt) {
        console.log("user is typing in the input field :)");
        console.log("which input field is my user tpying in?", evt.target.name);
        console.log("what is my user typing?", evt.target.value);
        console.log("This is THIS: ", this.state);
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    }
    handleSubmitStart(e) {
        console.log(
            "user wants to send over data to the server & register",
            this.state
        );
        e.preventDefault();
        fetch("/reset/start", {
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
                    this.setState({ step: 2 });
                } else {
                    this.setState({ step: 1 });
                }
            })
            .catch((err) => {
                console.log("err on fetch register.json", err);
                this.setState({
                    error: "Something went wrong with the server! Please contact your provider",
                });
            });
    }
    handleSubmitVerify(e) {
        console.log("submit was clicked", this.state);
        e.preventDefault();
        fetch("/reset/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log(resp);
                if (resp.success == true) {
                    this.setState({ step: 3 });
                    console.log("Success!", resp.success);
                } else {
                    this.setState({ step: 2 });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ error: true });
            });
    }
    getCurrentDisplay() {
        if (this.state.step === 1) {
            return (
                <section>
                    {this.state.error && <h2>{this.state.error}</h2>}
                    <input
                        name="email"
                        placeholder="E-mail"
                        type="email"
                        onChange={this.handleChange}
                    />
                    <button
                        className="button-83"
                        role="button"
                        onClick={this.handleSubmitStart}
                    >
                        Send e-mail to reset password
                    </button>
                </section>
            );
        } else if (this.state.step === 2) {
            return (
                <section>
                    <h1>Change Your Password</h1>
                    {this.state.error && <h2>{this.state.error}</h2>}
                    <input
                        name="code"
                        placeholder="Code"
                        key="code"
                        onChange={this.handleChange}
                    />
                    <input
                        name="password"
                        placeholder="New Password"
                        type="password"
                        key="password"
                        onChange={this.handleChange}
                    />
                    <div className="button">
                        <button
                            className="button-83"
                            role="button"
                            onClick={this.handleSubmitVerify}
                        >
                            Submit
                        </button>
                    </div>
                </section>
            );
        } else if (this.state.step === 3) {
            return (
                <section>
                    {this.state.error && <h2>{this.state.error}</h2>}
                    <h2>Success!</h2>
                    <Link to="/login" className="link">
                        Click here to Log in!
                    </Link>
                </section>
            );
        }
    }
    render() {
        return (
            <section className="inputs">
                <h2>Reset Your Password</h2>
                {this.state.error && <h2>{this.state.error}</h2>}
                <div>{this.getCurrentDisplay()}</div>
            </section>
        );
    }
}

// post fetch and send email, in the backend make query if user
// login query the same

// next display says email was sent
