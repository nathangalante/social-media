import { Component } from "react";
import { Link } from "react-router-dom";

export default class Reset extends Component {
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
        console.log("user is typing in the input field :)");
        console.log("which input field is my user tpying in?", evt.target.name);
        console.log("what is my user typing?", evt.target.value);
        console.log("This is THIS: ", this.state);
        // every time a change on any of the input fields happens we want to sync that
        // change to our state
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    }
    handleSubmit(e) {
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
                    location.reload();
                } else {
                    this.setState({
                        error: "Didn't receive your code? Please type your e-mail again",
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
            <section>
                <h1 className="someClass">Reset Your Password</h1>
                {this.state.error && <h2>{this.state.error}</h2>}
                <form>
                    <input
                        name="email"
                        placeholder="E-mail"
                        type="email"
                        onChange={this.handleChange}
                    />
                    <button
                        className="button-83"
                        role="button"
                        onClick={this.handleSubmit}
                    >
                        Send e-mail to reset password
                    </button>
                    <Link to="/register">Click here to Register!</Link>
                </form>
            </section>
        );
    }
}

// post fetch and send email, in the backend make query if user
// login query the same

// next display says email was sent

/// this.state = {
//     1
//     }
/// getCurrentDisplay() {
//     if (step === 1) {
//         <div>this is display 1</div>
//     } else if (step === 2) {

//     }
// }
