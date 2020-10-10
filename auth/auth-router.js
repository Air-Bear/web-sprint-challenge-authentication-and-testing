const router = require('express').Router();
const bcryptjs = require("bcryptjs");
const User = require("./auth-model");
const jwt = require("jsonwebtoken");
const restricted = require("./authenticate-middleware");

router.post('/register', (req, res) => {
  // implement registration
  const hash = bcryptjs.hashSync(req.body.password, 10)
  req.body.password = hash;

  User.add(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      next({apiCode: 500, apiMessage: "error registering", ...err});
    });
});

router.post('/login', (req, res) => {
  // implement login
  let {username, password} = req.body;

  User.findBy(username)
    .then(user => {
      if(user && bcryptjs.compareSync(password, user.password)){
        const token = generateToken(user);
        res.status(200).json({
          message: `Logged in as: ${user.username}`,
          token: token
        });
      }
    })
    .catch(err => {
      next({apiCode: 500, apiMessage: "error, logging in", ...err});
    });
});

function generateToken(user){
  payload = {
    subject: user.id,
    username: user.username
  };

  const secret = "I'm the best around";

  const options = {
    expiresIn: "1h"
  };

  const token = jwt.sign(payload, secret, options);

  return token;
}

module.exports = router;
