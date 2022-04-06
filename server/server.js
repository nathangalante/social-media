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

app.post("/register.json", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password)
        .then((hashedPassword) => {
            db.createUsers(first, last, email, hashedPassword)
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
            compare(req.body.password, rows[0].password)
                .then((match) => {
                    console.log("match:", match);
                    if (match) {
                        req.session.userId = rows[0].id;
                        if (rows[0].signature == null) {
                            res.redirect("/petition");
                        } else {
                            res.redirect("/user/id.json");
                        }
                    } else {
                        res.redirect("/login");
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

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/register.json");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
