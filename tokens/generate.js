// generate Auth Token

const jwt = require("jsonwebtoken");

const generateToken = ({ token, meta }) => {
  try {
    return jwt.sign({ token, meta }, process.env.AUTH_SECRET, {
      expiresIn: "7d",
    });
  } catch (error) {
    return null;
  }
};

module.exports = generateToken;
