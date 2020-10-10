/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken");
const secret = "I'm the best around";

module.exports = (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : "";

  if(token){
    jwt.verify(token, secret, (err, decodedToken) => {
      if(err){
        res.status(401).json({message: "invalid credentials"});
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({message: "invalid credentials"});
  }
};
