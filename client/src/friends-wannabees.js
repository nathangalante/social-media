// import { useDispatch, useselector } from "react-redux";

// export default function FriendsAndWannabees() {
//     const dispatch = useDispatch();

//     const wannabees = useSelector(
//         (state) =>
//             state.friendsWannabees &&
//             state.friendsWannabees.filter((friendship) => !friendship.accepted)
//     );

//     useEffect(() => {
//         // step 1 - make a GET request using fetch to retrieve the friends
//         // and wannabees
//         // step 2 - once you have the data bacj, call dispatch and pass and action
//         //to add this data to redux

//         dispatch(receiveFriendsAndWannabees(data));
//     }, []);

//     return (
//         <section>
//             <h1>Friends</h1>
//             <h1>Wannabees</h1>
//             {wannabees.map((wannabee) => {
//                 return (
//                     <div key={wannabee.id}>
//                         <button>Accept</button>
//                     </div>
//                 );
//             })}
//         </section>
//     );
// }
