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

app.use(compression());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    cookieSession({
        secret: secret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.post("/register", (req, res) => {
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
    console.log("body from editBio", req.body);
    db.updateBio(req.session.userId, req.body.draftBio)
        .then(({ rows }) => {
            console.log("this is rows in editBio", { rows });
            console.log("bio", req.body.bio);
            res.json({ rows });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/users", (req, res) => {
    db.mostRecentUsers()
        .then(({ rows }) => {
            console.log("users rows: ", rows);
            res.json({ rows });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/users/:search", (req, res) => {
    db.retrieveMatchingUsers(req.params.search)
        .then(({ rows }) => {
            console.log("users rows: ", rows);
            res.json({ rows });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

// ODER BY for 3 users to appear whenever the client hasn't
// typed anything into the input LIMIT 3
