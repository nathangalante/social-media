// below we are importing sth not exported as default
import { Registration } from "./registration";
import Logo from "./logo";

export default function Welcome() {
    return (
        <>
            <h1>Welcome to your new social media!</h1>
            <Registration />
            <Logo />
        </>
    );
}
