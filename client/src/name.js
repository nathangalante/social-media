export function Name(props) {
    const { firstName, lastName } = props;
    return (
        <h3>
            <strong>
                {firstName}
                {lastName}
            </strong>
        </h3>
    );
}
