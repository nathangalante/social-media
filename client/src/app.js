import { Component } from "react";
// import { BrowserRouter, Route } from "react-router-dom";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            // error: false,
            // isLoading: false,
            uploaderIsVisible: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        console.log("component did mount", this.state);
        fetch("/user")
            .then((resp) => resp.json())
            .then((data) => {
                console.log("submit was clicked", this.user);
                console.log("Response from get request: ", data);
            
                this.setState({ user: data.user });
            })
            .catch((err) => {
                console.log("Error", err);
                // this.state({ error, isLoading: false });
            });
    }
    handleSubmit(evt) {
        // console.log("user is typing in the input field :)");
        // console.log("which input field is my user tpying in?", evt.target.name);
        // console.log("what is my user typing?", evt.target.value);
        console.log("This is THIS: ", this.state);
        this.setState({
            [evt.target.name]: evt.target.value,
        });
        console.log("what is this?", evt.target);
    }
    render() {
        // const { isLoading, error } = this.state;
        // if (!this.state.user.id) {
        //     console.log("State: ", this.state.user.id);
        //     return <img src="weareloading.png" alt="loading.." />;
        // }
        // if (error) {
        //     return <p>{error.message}</p>;
        // }
        // if (isLoading) {
        //     return <p>Loading ...</p>;
        // }
        return (
            console.log("wow you made it here"),
            (
                <>
                    <div className="topElement">
                        <div className="insideElements">
                            <img
                                src="/chicken.png"
                                alt="chicken"
                                className="profilePic"
                                onClick={this.handleSubmit}
                            />
                            {/* <img
                                src={this.state.user.url || "/chicken.png"}
                                alt="profilePic"
                                className="profilePic"
                                onClick={this.handleSubmit}
                                clickHandler={() =>
                                    this.setState({
                                        uploaderIsVisible: true,
                                    })
                                }
                            /> */}
                            <h1 className="title">Put a bird on it</h1>
                            <img
                                src="/hamburger3.svg"
                                alt="hamburger"
                                className="hamburger"
                            />
                        </div>
                    </div>
                    <div className="chicken">
                        {/* <BrowserRouter>
                            <Route exact path="/profilePic"> */}
                        <ProfilePic
                            props={(this.state.first, this.state.last)}
                            img={this.state.user.url}
                            first={this.state.user.first}
                            last={this.state.user.last}
                            clickHandler={() =>
                                this.setState({
                                    uploaderIsVisible: true,
                                })
                            }
                        />
                        {/* </Route>
                            <Route path="/upload"> */}
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                updateProfilePicture={(url) => {
                                    this.setState({
                                        user: { url: url },
                                    });
                                }}
                                clickHandlerHideUploader={() => {
                                    this.setState({
                                        showUploader: false,
                                    });
                                }}
                            />
                        )}
                        {/* </Route>
                        </BrowserRouter> */}
                    </div>
                </>
            )
        );
    }
}

/// <img src={props.img || '/default.jpg'}/>
/// or fetch with a default image and then conditional to
/// render the profile pic

/// use function not class for ProfilePic
