const { integratePluginWithForm } = require("../oauth/formconnect");
const {
  verifyCode,
  createSpreadSheet,
  appendValues,
} = require("../oauth/google");
const create = require("../db/auth/create");
const router = require("express").Router();
const findOne = require("../db/auth/get");

// callback url to verify user
router.get("/oauth/google/", async (req, res) => {
  try {
    if (!req.query.code || !req.query.state) {
      return res.send("Invalid Request");
    }

    // verify code
    const { code, state } = req.query;
    const { formId, orgId, user } = JSON.parse(state);
    const tokens = await verifyCode({ code });
    const { success, data } = await integratePluginWithForm({ formId });
    const values = [];
    if (success) {
      data.fields.forEach((field) => {
        values.push(field.label);
      });
    }

    // create new spreadsheet
    const spreadsheetId = await createSpreadSheet({
      title: "form-connect-responses",
      access_token: tokens.access_token,
    });

    const { success: isFinalSuccess } = await appendValues({
      access_token: tokens.access_token,
      spreadsheetId,
      values: [values],
    });
    if (isFinalSuccess) {
      // store data in db
      await create({
        formId,
        orgId,
        meta: {
          spreadsheetId,
          tokens,
          initiatedBy: user || "",
        },
      });
    }

    return res
      .status(200)
      .redirect(process.env.CLINET_REDIRECT + `/${formId}/edit`);
  } catch (err) {
    // catch any error
    // return 400 response
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// callback url to verify user
router.post("/", async (req, res) => {
  console.log("hello");
  try {
    const { type, form, organization, response } = req.body;
    console.log({ type, form, organization, response });
    if (type === "responseData") {
      // save data to spreadsheet
      const formData = await findOne({ form });
      console.log(formData);
      if (!formData) {
        return {
          success: false,
          message: "No data found",
        };
      }
      const values = [];
      Object.keys(response).forEach((field) => {
        values.push(response[field]);
      });

      const { spreadsheetId, tokens } = formData.meta;
      const { success } = await appendValues({
        access_token: tokens.access_token,
        spreadsheetId,
        values: [values],
      });
      if (!success) {
        return {
          success: false,
          message: "Error while saving data",
        };
      }
    }
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    // catch any error
    console.log(err);
    // return 400 response
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
