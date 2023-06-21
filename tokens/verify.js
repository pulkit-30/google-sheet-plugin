// verify jwt token

const jwt = require("jsonwebtoken");

const verifyToken = async (token) => {
  try {
    const data = await jwt.verify(token, process.env.AUTH_SECRET);
    return data;
  } catch (error) {
    return null;
  }
};

module.exports = verifyToken;
