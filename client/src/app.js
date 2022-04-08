import React from "react";
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false
        };
    }
    componentDidMount() {
        fetch("/user").then(
            res=>res.json()
        ).then(
            data => {
                this.setState(data);
            }
        );
    }
    render() {
        if(!this.state.id) {
            return <img src="weareloading.png" alt="loading.."/>;
        }
        return (
            <>
                <img src="logo.png" alt="logo" />
                {/* <ProfilePic 
                    img={this.state.img}
                    clickHandler={()=> this.setState({
                        uploaderIsVisible: true
                    })}
                />
                {this.state.uploaderIsVisible && <Uploader />} */}
            </>
        );
    }
}

/// <img src={props.img || '/default.jpg'}/>
/// or fetch with a default image and then conditional to
/// render the profile pic

/// use function not class for ProfilePic
