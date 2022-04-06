import React from "react";

export class Counter extends React.Component {
    constructor() {
        super();
        this.state = {
            count: 0,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        console.log("Mount");

        /// good for fetching data 
    }

    componentDidUpdate() {
        console.log("Did UPdate")
    }

    handleClick() {
        this.setState((prevState) => {
            console.log(this.prevState);
            return { count: prevState.count + 1 };
        });
        this.setState({ wasClicked: true });
    }

    //this.setState({ count: this.state.count + 1 }
    render() {
        return (
            <section>
                <h1>Counter</h1>
                <p>Count: {this.state.count}</p>
                <button onClick={this.handleClick}>Click Me</button>
            </section>
        );
    }
}
