const Zettel = require("./main/model/Zettel");
const User = require("./main/model/User");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const LocalConfig = require("./config/LocalConfig")
const ZettelDrop = require("./main/business/ZettelDrop").ZettelDrop
const { ErrorMessages } = require("./main/business/ErrorMessages")

const app = express()
app.use(express.urlencoded({extended:false}));
app.use(express.json({}));
app.use(session({"secret" : "31efaea8-c74e-4896-b191-c86d343d8d2c"}));

const port = process.env.PORT || 3000
let zettelDrop = new ZettelDrop();

app.post('/b/register', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    zettelDrop.register(username, password)
    .then((result) => {
        if (result) {
            let username = zettelDrop.user.username;
            req.session.user = username;
            res.send("Welcome, " + req.session.user + ".");
        } else {
            res.sendStatus(500);
        }
    })
    .catch(e =>{
        console.log(e);
        res.sendStatus(500);
    });
 });

app.post('/b/login', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    zettelDrop.login(username, password)
    .then((result) => {
        if (result) {
            req.session.user = username;
            res.send("Welcome, " + req.session.user + ".");
        } else {
            res.send("Invalid credentials.");
        }
    })
    .catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
 });

 app.post('/b/logout', function(req, res) {
    req.session.user = null;
    res.status(200).send("User has been logged out.");
 });

app.post('/b/zettel', (req , res ) => {
    if (!isLoggedIn(req)) {
        res.sendStatus(403);
        return;
    }
    try {
        let zettelText = req.body.text;
        let username = req.session.user;
        zettelDrop.createNewZettel(username, zettelText)
        .then((response)=> {
            if (response.status == 201) {
                res.status(response.status).json(response.zettel);
            } else {
                res.status(response.status).send(response.message);
            }
        })
        .catch((e)=> {
            console.log(e);
            console.log("error type", "6997f0aa-8f2c-47cc-9434-e1dbff097665");
            res.sendStatus(500);
        })
    } catch (e) {
        console.log(ErrorMessages.unknown,"guid: 034402be-ba15-4f62-b63f-745e8d8b280c");
        console.log(e);
        res.sendStatus(500);
    }
})

app.post("/b/zettels", (req, res) => {
    if (!isLoggedIn(req)) {
        res.sendStatus(403);
        return;
    }
    let username = req.session.user;
    let queryText = req.body.queryString;
    zettelDrop.userQuery(username,queryText).then((response) => {

        res.json(response);
    })
    .catch(e => {
        console.log(e);
        res.sendStatus(500);
    })
});

app.delete("/b/zettel/:zettelId", (req, res)=> {
    if (!isLoggedIn(req)) {
        res.sendStatus(403);
        return;
    }
    let username = req.session.user;
    let id = req.params.zettelId;
    console.log("received request to delete zettle with ID ", id, "from user" + username);
    zettelDrop.deleteZettel(username, id)
    .then((response) => {
        if (response.deleted) {
            res.sendStatus(200);
        } else {
            res.status(400).send("no such zettel was deleted");
        }
    })
    .catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
});

app.get("/b/zettel/:zettelId", (req, res) => {
    try {
        console.log("username", req.session.user)
        if (!isLoggedIn(req)) {
            res.status(403).send("not logged in");
            return;
        } else {
            
        }
        if (!req.params.zettelId) {
            res.status(400).send("invalid zettel ID");
            return;
        }

        let username = req.session.user;
        let id = req.params.zettelId;

        if (id) {
            zettelDrop.userQueryById(username, id)
            .then((response) => {

                if (response.status == 200) {
                    res.json({
                        "zettel" : response.zettel
                    })
                } else {
                    res.status(response.status).send(response.message);
                }

            })
            .catch(e => {
                console.log("unknown exception 49181ca2-9755-468d-818f-4345bd704afa", e);

            })
        } else {
            res.sendStatus(400);
        }
    } catch (e) {
        console.log(ErrorMessages.unknown,"guid:e4e4d583-a729-48b4-b594-42f67763e290");
        console.log(e);
        res.sendStatus(500);
    }
});


app.get('/b/isloggedin', function(req , res) {
    if (isLoggedIn(req)) {
        res.send("true");
    } else {
        res.send("false");
    }
});

app.use('/', express.static('static'));

function isLoggedIn(req) {
    return (req.session.user && req.session.user.length > 0);
}

function init() {
    console.log("initiated");
    app.listen(port, () => {
        if (console) {
            console.log(`App listening on port ${port}!`)
        }
    });
}


try {
    
    console.log("making connection")
    mongoose.connect(LocalConfig.mongodb, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function() {
        init();
    });

} catch (e) {
    console.log(e)
}