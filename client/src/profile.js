import ProfilePic from "./profilePic";
import BioEditor from "./bioEditor";

export default function Profile(props) {
    return (
        <div className="imageContainer">
            <h2 className="imageName">
                {props.first} {props.last}
            </h2>
            <ProfilePic
                img={props.url}
                first={props.first}
                last={props.last}
                sizing={"mainProfilePic"}
            />
            <BioEditor bio={props.bio} setBio={props.setBio} />
        </div>
    );
}
