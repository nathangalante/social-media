export default function ProfilePic(props) {
    return (
        <>
            <img
                src={props.img || "/chicken.png"}
                alt={`${props.first} ${props.last}`}
                onClick={props.clickHandler}
                className={props.sizing}
            />
        </>
    );
}
