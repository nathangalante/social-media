export default function ProfilePic(props) {
    return (
        console.log("Props!!!!: ", props),
        (
            <>
                <img
                    src={props.img || "/hamburger-icon.png"}
                    alt={`${props.first} ${props.last}`}
                    onClick={props.clickHandlerShowUploader}
                    className="user"
                />
            </>
        )
    );
}
