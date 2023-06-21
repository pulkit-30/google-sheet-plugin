const generateToken = require("../../tokens/generate");
const AuthModel = require("../../models/auth");

const create = async ({ orgId, formId, meta }) => {
  if (!orgId || !formId) {
    return {
      success: false,
      message: "Missing orgId or formId",
    };
  }
  const data = {
    orgId,
    formId,
  };
  const token = generateToken(data);
  if (!token) {
    return {
      success: false,
      message: "Unable to generate token",
    };
  }
  const AuthData = await new AuthModel({
    token,
    form: formId,
    meta,
  });
  AuthData.save();
  return {
    success: true,
    data: {
      token,
    },
  };
};

module.exports = create;
