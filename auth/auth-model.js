const db = require("../database/dbConfig");

function add(data) {
    return db("users").insert(data);
}

function findBy(username) {
    return db("users").where({username}).first();
}

module.exports = {
    add,
    findBy
}