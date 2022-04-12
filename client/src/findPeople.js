import { useState, useEffect } from "react";

export function Hooks() {
    const [searchTerm, setSearchTerm] = useState();

    useEffect(() => {
        let abort = false;

        fetch(`/users?search=${searchTerm}`)
            .then((res) => res.json())
            .then((users) => {
                if (!abort) {
                    console.log(users);
                }
            });

        return () => (abort = true);
    }, [searchTerm]);

    return (
        // render image frist and last name 
        <div id={"hooks"}>
            <input onChange={(e) => setSearchTerm(e.target.value)} />
            <div>{searchTerm}</div>
        </div>
    );
}
