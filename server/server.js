const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { compare, hash } = require("./bc");
const cookieSession = require("cookie-session");
const db = require("./db");
const secret =
    process.env.SESSION_SECRET ||
    require("../server/secrets.json").SESSION_SECRET;
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");
const s3 = require("./s3");
const { uploader } = require("./upload");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

app.use(compression());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

const cookieSessionMiddleware = cookieSession({
    secret: secret,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});

app.use(cookieSessionMiddleware);
app.use(cookieSessionMiddleware);

io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
// app.use(
//     cookieSession({
//         secret: secret,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//         sameSite: true,
//     })
// );

// app.use(cookieSession);
// app.use(cookieSession);

// io.use(function (socket, next) {
//     cookieSession(socket.request, socket.request.res, next);
// });

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.post("/register.json", (req, res) => {
    const { first, last, email, password, url, bio } = req.body;
    hash(password)
        .then((hashedPassword) => {
            db.createUsers(first, last, email, hashedPassword, url, bio)
                .then((userId) => {
                    req.session.userId = userId.rows[0].id;
                    res.json({
                        success: true,
                    });
                })
                .catch((err) => {
                    console.log("Eror registering", err);
                    res.json({
                        success: false,
                    });
                });
        })
        .catch((err) => {
            console.log("Error with password", err);
            res.json({
                success: false,
            });
        });
});

app.post("/login", (req, res) => {
    db.getUserPasswordFromEmail(req.body.email)
        .then(({ rows }) => {
            console.log("rows:", rows);
            compare(req.body.password, rows[0].password)
                .then((match) => {
                    console.log("match:", match);
                    if (match) {
                        req.session.userId = rows[0].id;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch(() => {
                    res.json({
                        sucess: true,
                    });
                });
        })
        .catch(() => {
            res.json({
                sucess: false,
            });
        });
});

app.post("/reset/start", (req, res) => {
    db.getUserPasswordFromEmail(req.body.email)
        .then(({ rows }) => {
            if (rows.length > 0) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                return db
                    .insertUserCodes(req.body.email, secretCode)
                    .then(() => {
                        ses.sendEmail(rows[0].email, secretCode).then(() => {
                            res.json({ success: true });
                        });
                    });
            }
        })
        .catch(() => {
            res.json({ success: false });
        });
});

app.post("/reset/verify", (req, res) => {
    db.findLatestCodes(req.body.email).then(({ rows }) => {
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].code == req.body.code) {
                console.log("correct code");
                hash(req.body.password)
                    .then((hashedPassword) => {
                        db.updateUserPassword(
                            hashedPassword,
                            req.body.email
                        ).then(() => {
                            console.log("new hashed password", hashedPassword);
                            res.json({ success: true });
                        });
                    })
                    .catch((err) => {
                        console.log("error verify code secret", err);
                        res.json({ success: false });
                    });
            }
        }
    });
});

app.get("/user", (req, res) => {
    db.getUserByUserId(req.session.userId)
        .then(({ rows }) => {
            res.json({ success: true, user: rows[0] });
        })
        .catch((err) => {
            console.log(err);
            res.json({ success: false });
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const fullUrl = `https://s3.amazonaws.com/spicedendoftermprojects/${req.file.filename}`;

    if (req.file) {
        db.updateImageUrl(req.session.userId, fullUrl)
            .then(({ rows }) => {
                console.log("Hello!", fullUrl);
                console.log("ROWS: ", rows);
                res.json({ success: true, url: rows[0].url });
            })
            .catch((err) => {
                console.log("error uploading image", err);
                res.json({ success: false });
            });
    }
});

app.post("/editBio", (req, res) => {
    db.updateBio(req.session.userId, req.body.draftBio)
        .then(({ rows }) => {
            res.json({ rows });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/find-users.json", (req, res) => {
    db.mostRecentUsers()
        .then(({ rows }) => {
            console.log("users rows: ", rows);
            res.json({ rows });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/find-users/:search", (req, res) => {
    db.retrieveMatchingUsers(req.params.search)
        .then(({ rows }) => {
            console.log("users rows: ", rows);
            res.json({ rows });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/find/user/:id", (req, res) => {
    db.getOtherUsersData(req.params.id)
        .then(({ rows }) => {
            console.log("user's data: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error retrieving user data: ", err);
        });
});

app.get("/friendship/:otherUserId", (req, res) => {
    console.log(
        "Params on friendship",
        req.params,
        typeof req.params.otherUserId
    );
    console.log("cookies on friendship", req.session);
    const otherUserId = parseInt(req.params.otherUserId);
    console.log(otherUserId);
    db.friendshipStatus(req.session.userId, otherUserId)
        .then(({ rows }) => {
            console.log("friendship status: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("Error making new friends: ", err);
        });
});

app.post("/friendship-status/sendFriendRequest", (req, res) => {
    const { sender_id, recipient_id } = req.body;
    console.log("BODY friendrequest", req.body);
    db.insertIntoFriendRequests(sender_id, recipient_id)
        .then(({ rows }) => {
            console.log("rows on friendship insert: ", { rows });
            res.json(rows);
        })
        .catch((err) => {
            console.log("error uploading friend request", err);
        });
});

app.post("/friendship-status/cancelFriendship", (req, res) => {
    console.log("Delete BODY", req.body);
    const { id } = req.body;
    db.unfriendQuery(id)
        .then((data) => {
            console.log("rows on cancel friendship: ", data);
            res.json(data);
        })
        .catch((err) => {
            console.log("error canceling friendship", err);
        });
});

app.post("/friendship-status/acceptFriendRequest", (req, res) => {
    const { sender_id, recipient_id } = req.body;
    console.log("sender", sender_id);
    console.log("recipient", recipient_id);
    db.acceptFriendRequest(sender_id, recipient_id)
        .then(({ rows }) => {
            console.log("rows on accepting friendship: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error rejecting friend request", err);
        });
});

app.get("/friends-wannabees", (req, res) => {
    db.retrieveFriendsAndWannabees(req.session.userId)
        .then(({ rows }) => {
            console.log("friend and wannabees rows: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error while retrieving friends and wannabees", err);
        });
});

app.post("/accept-wannabee", (req, res) => {
    db.acceptFriendRequest(req.body.id, req.session.userId)
        .then(({ rows }) => {
            console.log("rows on accepting friendship: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error rejecting friend request", err);
        });
});

app.get("/api/chat", (req, res) => {
    db.retrieveChatMessages(req.session.userId)
        .then(({ rows }) => {
            console.log("data on messages received by the server", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error getting chat messages", err);
        });
});

// app.post("/unfriend", (req, res) => {
//     console.log("Delete BODY", req.body);
//     const { id } = req.body;
//     db.unfriendQuery(id)
//         .then((data) => {
//             console.log("rows on cancel friendship: ", data);
//             res.json(data);
//         })
//         .catch((err) => {
//             console.log("error canceling friendship", err);
//         });
// });

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", function (socket) {
    console.log("NEW CONNECTION");
    const userId = socket.request.session.userId;
    console.log("userID: ", userId);

    if (userId) {
        db.retrieveChatMessages().then(({ rows }) => {
            console.log("rows of retrieved messages", rows);
            socket.emit("last-10-messages", {
                data: rows,
            });
        });

        socket.on("message", (data) => {
            console.log("data: ", data);
            db.insertMessage(data.message, userId).then(({ rows }) => {
                db.retrieveChatMessages(userId).then(({ rows: data }) => {
                    console.log("data on getUserInfo", data);
                    io.emit("message-broadcast", { ...rows[0], ...data[0] });
                });
                console.log("data on insert message", rows);
            });
        });
    } else {
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    }
    // 2. broadcast new incoming messages
});

// ODER BY for 3 users to appear whenever the client hasn't
// typed anything into the input LIMIT 3
