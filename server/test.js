// export default function friends(friends = [], action) {
//     if (action.type === "friends-wannabees/received") {
//         friends = action.payload.friends;
//     } else if (action.type === "friends-wannabees/accepted") {
//         // const newFriendsWannabees = friends.map();
//         friends = friends.map((friend) => {
//             if (friend.id == action.payload.id) {
//                 friend = { ...friend, status: true };
//             }
//             return friend;
//         });
//         // return newFriendsWannabees;
//     } else if (action.type === "friends-wannabees/deleted") {
//         friends = friends.filter((friend) => {
//             if (friend.id != action.payload.id) {
//                 return friend;
//             }
//         });
//     }
//     // no mutationg of original state, make copies
//     return friends;
// }

// export function asyncReceiveFriendsAndWannaBees() {
//     return async (dispatch) => {
//         const friends = await fetch("/friendship/friendsAll2").then(
//             (response) => response.json()
//         );
//         dispatch({
//             type: "friends-wannabees/received",
//             payload: { friends },
//         });
//     };
// }
// export function asyncAcceptFriend(id) {
//     return async (dispatch) => {
//         const data = await fetch("/friendship/accept", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ otherUserId: id }),
//         }).then((response) => response.json());
//         if (data.success) {
//             dispatch({
//                 type: "friends-wannabees/accepted",
//                 payload: { id },
//             });
//         }
//     };
// }
// export function asyncDeleteFriend(id) {
//     return async (dispatch) => {
//         const data = await fetch("/friendship/reject", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ otherUserId: id }),
//         }).then((response) => response.json());
//         if (data.success) {
//             dispatch({
//                 type: "friends-wannabees/deleted",
//                 payload: { id },
//             });
//         }
//     };
// }
