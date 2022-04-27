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
        console.log("event target value:", evt.target.value);
        this.setState({ draftBio: evt.target.value });
    }
    toggleTextArea() {
        this.setState({
            showTextArea: !this.state.showTextArea,
        });
    }
    submitBio(e) {
        console.log("this is weird and a very big label:", this.state);
        if (!this.state.draftBio) {
            return this.toggleTextArea();
        }
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
                this.props.setBio(this.state.draftBio);
                this.toggleTextArea();
            });
    }
    render() {
        return (
            <>
                {!this.state.showTextArea && !this.props.bio && (
                    <>
                        <div className="editText">
                            <button
                                className="button-83"
                                onClick={this.toggleTextArea}
                            >
                                Add a bio
                            </button>
                        </div>
                    </>
                )}
                {!this.state.showTextArea && this.props.bio && (
                    <>
                        <div className="editTextBio">
                            <p className="bio">{this.props.bio}</p>
                            <button
                                onClick={this.toggleTextArea}
                                className="button-83"
                            >
                                Edit Bio
                            </button>
                        </div>
                    </>
                )}
                {this.state.showTextArea && (
                    // <>
                    <div className="editText">
                        <form>
                            <mat-form-field appearance="fill">
                                <input
                                    placeholder="Type your bird story here"
                                    onKeyDown={this.handleBioChange}
                                    defaultValue={this.props.bio}
                                ></input>
                            </mat-form-field>
                        </form>
                        <button onClick={this.submitBio} className="button-83">
                            Save
                        </button>
                    </div>
                    // </>
                )}

                {/* if this text area is hidden, 
                check to see if there is a bio
                
                if there is an existing bio allow user to EDIT
                
                if there is NO bio, allow them to ADD a bio whenever 
                they click on the button show the text area*/}
            </>
        );
    }
}
