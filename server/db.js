const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/users`
);

exports.createUsers = (first, last, email, password, url, bio) => {
    return db.query(
        `INSERT INTO users (first, last, email, password, url, bio)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id`,
        [first, last, email, password, url, bio]
    );
};

exports.getUserPasswordFromEmail = (email) => {
    return db.query(
        `SELECT * FROM users
        WHERE email = $1`,
        [email]
    );
};

exports.updateUserPassword = (password, email) => {
    return db.query(
        `UPDATE users SET password=$1
        WHERE users.email=$2`,
        [password, email]
    );
};

exports.insertUserCodes = (email, code) => {
    return db.query(
        `INSERT INTO reset_codes (email, code)
    VALUES ($1, $2)
    RETURNING *`,
        [email, code]
    );
};

exports.findLatestCodes = (email) => {
    return db.query(
        `SELECT code FROM reset_codes
    WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' 
    AND email=$1`,
        [email]
    );
};

exports.updateImageUrl = (userId, url) => {
    return db.query(
        `UPDATE users 
    SET url=$2
    WHERE id=$1
    RETURNING url`,
        [userId, url]
    );
};

exports.getUserByUserId = (userId) => {
    return db.query(
        `SELECT * FROM users 
        WHERE id=$1`,
        [userId]
    );
};

exports.updateBio = (userId, bio) => {
    return db.query(
        `UPDATE users
    SET bio=$2
    WHERE id=$1
    RETURNING bio`,
        [userId, bio]
    );
};

exports.mostRecentUsers = () => {
    return db.query(
        `SELECT * FROM users
    ORDER BY id
    LIMIT 6`
    );
};

exports.retrieveMatchingUsers = (search) => {
    return db.query(
        `
      SELECT * FROM users
        WHERE first ILIKE $1
        OR last ILIKE $1;
  `,
        [search + "%"]
    );
};

exports.getOtherUsersData = (id) => {
    return db.query(
        `SELECT first, last, url, bio, id
    FROM users WHERE id=$1`,
        [id]
    );
};

exports.friendshipStatus = (recipient, sender) => {
    return db.query(
        `SELECT * FROM friend_requests
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1) `,
        [recipient, sender]
    );
};

exports.insertIntoFriendRequests = (sender_id, recipient_id) => {
    return db.query(
        `INSERT INTO friend_requests (sender_id, recipient_id)
            VALUES ($1, $2)
            RETURNING *`,
        [sender_id, recipient_id]
    );
};

exports.acceptFriendRequest = (sender_id, recipient_id) => {
    return db.query(
        `UPDATE friend_requests 
        SET accepted = 'true'
        WHERE sender_id = $1 AND recipient_id = $2
        RETURNING *`,
        [sender_id, recipient_id]
    );
};

exports.unfriendQuery = (id) => {
    return db.query(
        `DELETE FROM friend_requests
        WHERE sender_id=$1 `,
        [id]
    );
};

exports.retrieveFriendsAndWannabees = (id) => {
    return db.query(
        `SELECT users.id, first, last, url, accepted
    FROM friend_requests
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
        `,
        [id]
    );
};

exports.retrieveChatMessages = () => {
    return db.query(
        `SELECT users.first AS first, users.last AS last, users.url AS url, chat.id AS id, chat.message AS message, chat.created_at AS created_at 
        FROM chat
        JOIN users
        ON users.id = chat.sender_id
        ORDER BY id DESC 
        LIMIT 10
        `
    );
};

// SELECT chats.id AS message_id, chats.user_id AS user_id, first, last, profile_pic, message
//             FROM chats
//             JOIN users
//             ON chats.user_id = users.id
//             ORDER BY chats.id DESC
//             LIMIT 10

// exports.insertMessage = (message, user_id) => {
//     return db.query(
//         `WITH “user”
//         AS ( SELECT * FROM users WHERE id = $2),
//         message AS (INSERT INTO chats (message, user_id, from_id) VALUES ($1, $2, $2) RETURNING message, user_id)
//         SELECT first, last, profile_pic, message, user_id FROM “user”, message`,
//         [message, user_id]
//     );
// };

exports.insertMessage = (message, id) => {
    return db.query(
        `INSERT INTO chat (message, sender_id) VALUES ($1, $2)
        RETURNING id, message, created_at
        `,
        [message, id]
    );
};

exports.getUserInfo = (id) => {
    return db.query(
        `SELECT first, last, url
        FROM users
        WHERE id=$1`,
        [id]
    );
};
