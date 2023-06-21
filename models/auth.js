const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Auth = new Schema({
  token: {
    type: String,
    required: true,
  },
  form: {
    type: String,
    required: true,
  },
  meta: {
    type: Object,
    default: {},
  },
});

module.exports = mongoose.model("Auth", Auth);
