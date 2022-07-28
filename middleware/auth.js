const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function verifyToken(req, res, next) {
  console.log("verifyToken");
  
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    // if everything good, save to request for use in other routes
    req.userId = decoded._id;
    next();
  });
}

//verifyAdmin
function verifyAdmin(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    // if everything good, save to request for use in other routes
    if (decoded.IsAdmin == true) {
      req.userId = decoded._id;
      req.IsAdmin = decoded.IsAdmin;
      next();
    } else {
      return res.status(403).send({ auth: false, message: "Not an admin" });
    }
  });
}

module.exports = { verifyToken, verifyAdmin };
