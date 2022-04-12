import { Component } from "react";

export default class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: "",
        };
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
    }
    handleClick(e) {
        e.preventDefault();
        const file = this.state.file;
        let fd = new FormData();
        fd.append("file", file);
        fetch("/upload", {
            method: "POST",
            body: fd,
        })
            .then((res) => res.json())
            .then((response) => {
                console.log("response", response);
            })
            .catch((err) => {
                console.log("err", err);
            });
    }
    render() {
        return (
            <>
                <section className="modal">
                    <section className="modal-content">
                        <form className="form">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    console.log("changed", e.target.files[0]);
                                    this.setState({ file: e.target.files[0] });
                                }}
                            ></input>
                            <button onClick={this.handleClick}>Submit</button>
                        </form>
                    </section>
                </section>
            </>
        );
    }
}
