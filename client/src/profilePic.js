export default function ProfilePic(props) {
    return (
        <>
            <img
                src={props.url || "/chicken.png"}
                alt={`${props.first} ${props.last}`}
                onClick={props.clickHandler}
                className={props.sizing}
            />
        </>
    );
}
