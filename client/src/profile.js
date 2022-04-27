import ProfilePic from "./profilePic";
import BioEditor from "./bioEditor";

export default function Profile(props) {
    return (
        <>
            <div className="imageContainer">
                <h2 className="titleProfile">
                    {props.first} {props.last}
                </h2>
                <ProfilePic
                    url={props.url}
                    first={props.first}
                    last={props.last}
                    sizing={"yourProfilePic"}
                />
                <BioEditor bio={props.bio} setBio={props.setBio} />
            </div>
        </>
    );
}
