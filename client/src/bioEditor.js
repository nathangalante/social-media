import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTextArea: false,
            draftBio: "",
        };
        this.handleBioChange = this.handleBioChange.bind(this);
        this.submitBio = this.submitBio.bind(this);
        this.toggleTextArea = this.toggleTextArea.bind(this);
    }
    handleBioChange(evt) {
        this.setState({ draftBio: evt.target.value });
    }
    toggleTextArea() {
        this.setState({
            showTextArea: !this.state.showTextArea,
        });
    }
    submitBio(e) {
        e.preventDefault();
        fetch("/editBio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then(() => {
                // console.log(data);
                this.setState({
                    showTextArea: false,
                });
                this.props.setBio(this.state.draftBio);
            });
    }
    render() {
        return (
            <div className="bioEditor">
                {!this.state.showTextArea && (
                    <div>
                        <p className="bio">{this.props.bio}</p>
                        <button
                            onClick={this.toggleTextArea}
                            className="linkButton"
                        >
                            Edit Bio
                        </button>
                    </div>
                )}
                {this.state.showTextArea && (
                    <div>
                        <textarea
                            onKeyDown={this.handleBioChange}
                            className="textArea"
                        />
                        <button onClick={this.submitBio} className="linkButton">
                            Save
                        </button>
                    </div>
                )}

                {/* if this text area is hidden, 
                check to see if there is a bio
                
                if there is an existing bio allow user to EDIT
                
                if there is NO bio, allow them to ADD a bio whenever 
                they click on the button show the text area*/}
            </div>
        );
    }
}
