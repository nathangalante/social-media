import React from "react";
import { bool } from "prop-types";
import { StyledMenu } from "./menu.styled";
const Menu = ({ open }) => {
    // const [open, setOpen] = useState(false);
    return (
        <StyledMenu open={open}>
            <a href="/profile">
                <span role="img" aria-label="about us">
                    &#x1f481;&#x1f3fb;&#x200d;&#x2642;&#xfe0f;
                </span>
                Profile
            </a>
            <a href="/friendsWannabees">
                <span role="img" aria-label="price">
                    &#x1f4b8;
                </span>
                Friends
            </a>
            <a href="/logout">
                <span role="img" aria-label="contact">
                    &#x1f4e9;
                </span>
                Logout
            </a>
        </StyledMenu>
    );
};
Menu.propTypes = {
    open: bool.isRequired,
};
export default Menu;
