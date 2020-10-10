const router = require('express').Router();
const bcryptjs = require("bcryptjs");
const User = require("./auth-model");
const jwt = require("jsonwebtoken");
const restricted = require("./authenticate-middleware");

router.post('/register', (req, res, next) => {
  // implement registration
  if(req.body.password && req.body.username){
    const hash = bcryptjs.hashSync(req.body.password, 10)
    req.body.password = hash;

    User.add(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      next({apiCode: 500, apiMessage: "error registering", ...err});
    });
  } else {
    next({apiCode: 500, apiMessage: "error registering"}); 
  }
  
});

router.post('/login', (req, res, next) => {
  // implement login
  let {username, password} = req.body;

  User.findBy(username)
    .then(user => {
      if(user && bcryptjs.compareSync(password, user.password)){
        //const token = generateToken(user);
        req.session.user = user;
        res.status(200).json({
          message: `Logged in as: ${user.username}`,
          //token: token
        });
      } else {
        next({apiCode: 401, apiMessage: "invalid credentials"})
      }
    })
    .catch(err => {
      next({apiCode: 500, apiMessage: "error, logging in", ...err});
    });
});

// function generateToken(user){
//   payload = {
//     subject: user.id,
//     username: user.username
//   };

//   const secret = "I'm the best around";

//   const options = {
//     expiresIn: "1h"
//   };

//   const token = jwt.sign(payload, secret, options);

//   return token;
// }

module.exports = router;
