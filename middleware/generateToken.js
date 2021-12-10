const jwt = require("jsonwebtoken");

const generateToken = (user_id , email) => {
    return jwt.sign({ user_id,email }, process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
  }
module.exports = generateToken;  