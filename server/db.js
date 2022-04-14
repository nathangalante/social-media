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

exports.insertIntoFriendRequests = (sender_id, recipient_id, accepted) => {
    return db.query(
        `INSERT INTO friend_requests (sender_id, recipient_id, accepted)
            VALUES ($1, $2, $3)
            RETURNING *`,
        [sender_id, recipient_id, accepted]
    );
};

exports.updateFriendRequest = (
    sender_id,
    recipient_id,
    accepted,
    created_at
) => {
    return db.query(
        `INSERT INTO friend_requests (sender_id, recipient_id, accepted, created_at)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (sender_id)
    DO UPDATE SET sender_id = $1, recipient_id = $2, accepted = $3, created_at = $4`,
        [sender_id, recipient_id, accepted, created_at]
    );
};

exports.unfriendQuery = () => {
    return db.query(
        `DELETE FROM friend_requests
WHERE id=$1;`,
        []
    );
};
