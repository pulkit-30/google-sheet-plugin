const AuthModel = require("../../models/auth");
const findOne = async (data) => await AuthModel.findOne(data);
module.exports = findOne;
