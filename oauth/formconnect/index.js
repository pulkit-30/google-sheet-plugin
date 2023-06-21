const axios = require("axios");
const authUrl = `${process.env.FORM_CONNECT_SERVER_URL}/v1/plugin/auth`;
const formUrl = `${process.env.FORM_CONNECT_SERVER_URL}/v1/plugin/form`;

const clientSecret = process.env.FORM_CONNECT_SECRET;

const getOrganization = async ({ email, orgId }) => {
  try {
    const response = await axios(`${authUrl}?email=${email}&orgId=${orgId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Secret": clientSecret,
      },
    });
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      message: "authentication failed",
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

const integratePluginWithForm = async ({ formId }) => {
  try {
    // perform form authentication
    const response = await axios(`${formUrl}?formId=${formId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Secret": clientSecret,
      },
    });
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      message: "authentication failed",
    };
  } catch (err) {
    return {
      success: false,
      message: "integration failed",
    };
  }
};

module.exports = {
  getOrganization,
  integratePluginWithForm,
};
