import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import ProfilePic from "./profilePic";
import Uploader from "./upload";
import Profile from "./profile";
import FindPeople from "./findPeople";
import { Link } from "react-router-dom";
import OtherProfile from "./otherProfile";
import FriendsWannabees from "./friendsWannabees";
import Chat from "./chat";
// import { useState } from "react";
// import { ThemeProvider } from "styled-components";
// import { theme } from "./theme";
// import { Burger } from "./components/burger/burger";
// import { Menu } from "./components/menu/menu";
// import Logout from "./logout";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            uploaderIsVisible: false,
            userLoggedIn: false,
            // setOpen: false,
        };
        // const [open, setOpen] = useState(false);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        console.log("component did mount", this.state);
        fetch("/user")
            .then((resp) => resp.json())
            .then((data) => {
                console.log({ nathan: data.user });
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
        // const [open, setOpen] = useState(false);
        return (
            <>
                <BrowserRouter>
                    {/* <ThemeProvider theme={theme}>
                        <>
                            <div>
                                <img
                                    src="https://media.giphy.com/media/xTiTnwj1LUAw0RAfiU/giphy.gif"
                                    alt="animated burger"
                                />
                            </div>
                            <div>
                                <Burger open={open} setOpen={setOpen} />
                                <Menu open={open} setOpen={setOpen} />
                            </div>
                        </>
                    </ThemeProvider> */}
                    <div className="topElement">
                        <div className="insideElements">
                            <ProfilePic
                                url={this.state.user.url}
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
                    <br />
                    <div className="center">
                        <section className="side-nav">
                            <Link to="/">Profile</Link>
                            <Link to="/friends">Friends</Link>
                            <Link to="/chat">Chat</Link>
                            <Link to="/find-users">Find People</Link>
                            <a href="/logout">Logout</a>
                        </section>
                    </div>

                    {/* {this.state.userLoggedIn &&  */}
                    <Route exact path="/">
                        <Profile
                            url={this.state.user.url}
                            first={this.state.user.first}
                            last={this.state.user.last}
                            setBio={this.setBio}
                            bio={this.state.user.bio}
                        />
                    </Route>
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
                    <header></header>
                    <Route exact path="/find-users">
                        <FindPeople />
                    </Route>
                    <Route exact path="/friends">
                        <FriendsWannabees
                            url={this.state.user.url}
                            first={this.state.user.first}
                            last={this.state.user.last}
                            sizing={"mainProfilePic"}
                        />
                    </Route>
                    {/* <Route exact path={"/"}>
                        <OtherProfile />
                    </Route> */}
                    <Route exact path={"/user/:id"}>
                        <OtherProfile loggedInUserId={this.state.user.id} />
                    </Route>
                    <Route exact path="/chat">
                        <Chat
                            url={this.state.user.url}
                            first={this.state.user.first}
                            last={this.state.user.last}
                            sizing={"mainProfilePic"}
                        />
                    </Route>
                    {/* <Route exact path="/logout">
                        <Logout />
                    </Route> */}
                </BrowserRouter>
            </>
        );
    }
}
// browser router implementieren exact route/profile render wenn findpeople normal path/findPeople

/// on app browser router
