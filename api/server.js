const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');
const errorHandler = require("../error-handler.js");

const server = express();

const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const sessionConfig = {
    name: "aycookie",
    secret: "I'm the best around",
    cookie: {
        maxAge: 60 * 60 * 1000,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false,

    store: new knexSessionStore({
        knex: require("../database/dbConfig"),
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 60 * 60 * 1000
    })
}

server.use(session(sessionConfig));
server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

server.use(errorHandler);

module.exports = server;
