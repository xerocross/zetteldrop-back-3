const User = require("../model/User");
const Zettel = require("../model/Zettel");
const { ErrorMessages } = require("./ErrorMessages")
const { StringUtils } = require("../util/StringUtils")
const { ZettelList } = require("./ZettelList")

class ZettelDrop  {
    isLoggedIn () {
        return (this.user != null);
    }

    register (username , password ) {
        let user = new User()
        user.username = username;
        user.password = password;
        return new Promise((resolve, reject) => {
            
            user.save(function (err, user) {
                if (err) { 
                    console.error(err);
                    reject();
                } else {
                    console.log("registered user")
                    resolve(true);
                }
            });
        });
    }

    login (username , password ) {
        let query = {"username" : username};
        console.log("query", JSON.stringify(query));
        return new Promise((resolve, reject) => {

            let user = User.findOne(query, (err, user) => {
                if (err) {
                    console.error(err);
                    reject();
                }
                console.log(user);
                console.log("found user ", user.username, user.password);
                if (user !== null && user.password === password) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    getRand() {
        const randomScale = 10000;
        return Math.floor(Math.random()*randomScale);
    }

    getNewZettelId() {
        return Date.now().toString() + this.getRand().toString();
    }


    userQuery(username, queryString) {

        let tags  = StringUtils.getHashtags(queryString);
        console.log("tags", tags);
        let zettels = [];
        return new Promise ((resolve, reject) => {
            Zettel.find({user : username},  (err, response) => {
                if (err) {
                    console.error(err);
                    reject();
                }
                let zettelList = new ZettelList([]);
                response.forEach((doc)=> {
                    zettels.push({
                        user : doc.user,
                        id : doc.id,
                        text : doc.text
                    });


                    zettelList = new ZettelList(zettels);
                    tags.forEach((tag) => {
                        zettelList = zettelList.filterByTag(tag);
                    })


                })
                resolve(zettelList.zettels);
            })
        });
    }


    deleteZettel(username, id) {
        return new Promise((resolve, reject) => {
            let query = {id: id, user: username}
            Zettel.deleteOne(query, (err, response) => {
                if (err) {
                    console.error(err);
                    reject();
                }
                if (response.deletedCount == 1) {
                    resolve({
                        deleted : true
                    });
                } else {
                    resolve({
                        deleted : false
                    });
                }
            })
            .catch(e =>{
                console.log("unknown error ", e, "28968d3c-e855-4f70-bed8-a6bad1e11964")
                reject();
            })
        });
    }


    createNewZettel(username, zettelText) {
        try {
            if (!zettelText) {
                return Promise.resolve({
                    status : 400,
                    message : "zettel must contain text"
                });
            } else {
                let zettelId = this.getNewZettelId()
                let zettel = new Zettel({id: zettelId, user: username, text: zettelText});
                return new Promise((resolve, reject) => {
                    zettel.save(function (err, newZettel) {
                        if (err) { 
                            console.error(err);
                            reject();
                        } else {
                            console.log("saved zettel")
                            console.log(newZettel);
                            resolve({
                                zettel : newZettel,
                                status : 201,
                                message : "zettel created"
                            });
                        }
                    })
                });
            }
        } catch (e) {
            console.log("unexpected error", e);
            throw e;
        }
    }

    userQueryById(username, id) {
        let query = {user : username, id : id}
        return new Promise((resolve, reject) => {
            Zettel.findOne(query, (err, zettel) => {
                if (err) {
                    console.error(err);
                    reject();
                }
                if (zettel == null) {
                    resolve({
                        status : 404,
                        message : "zettel not found"
                    });
                } else {
                    console.log("found zettel ", zettel.text);
                    resolve({
                        status : 200,
                        zettel : zettel
                    })
                }
            });
        });
    }
}
module.exports.ZettelDrop = ZettelDrop;

