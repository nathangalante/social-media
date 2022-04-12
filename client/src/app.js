import { Component } from "react";
// import { BrowserRouter, Route } from "react-router-dom";
import ProfilePic from "./profilePic";
import Uploader from "./upload";
import Profile from "./profile";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            uploaderIsVisible: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setBio = this.setBio.bind(this);
    }
    componentDidMount() {
        console.log("component did mount", this.state);
        fetch("/user")
            .then((resp) => resp.json())
            .then((data) => {
                this.setState({ user: data.user });
            })
            .catch((err) => {
                console.log("Error", err);
            });
    }

    handleSubmit(evt) {
        console.log("handleSubmit: ", evt);
        this.setState({
            showUploader: true,
        });
    }
    setBio(newBio) {
        this.setState({
            user: { ...this.state.user, bio: newBio },
        });
    }
    render() {
        if (!this.state.user.id) {
            return <img src="loading.gif" alt="loading..." />;
        }
        return (
            <>
                <div className="topElement">
                    <div className="insideElements">
                        <ProfilePic
                            img={this.state.user.url}
                            first={this.state.user.first}
                            last={this.state.user.last}
                            sizing={"profilePic"}
                            clickHandler={() =>
                                this.setState({
                                    uploaderIsVisible:
                                        !this.state.uploaderIsVisible,
                                })
                            }
                        />
                        <h1 className="title">Put a bird on it</h1>
                        <img
                            src="/hamburger3.svg"
                            alt="hamburger"
                            className="hamburger"
                        />
                    </div>
                </div>
                <Profile
                    url={this.state.user.url}
                    first={this.state.user.first}
                    last={this.state.user.last}
                    setBio={this.setBio}
                    bio={this.state.user.bio}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        updateProfilePicture={(url) => {
                            console.log("this is the url", url);
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
            </>
        );
    }
}
// browser router implementieren exact route/profile render wenn findpeople normal path/findPeople
