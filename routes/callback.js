const { integratePluginWithForm } = require("../oauth/formconnect");
const {
  verifyCode,
  createSpreadSheet,
  appendValues,
  clearRangeValues,
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
  try {
    const { type, form, organization, data } = req.body;
    // save data to spreadsheet
    const formData = await findOne({ form });
    if (!formData) {
      return {
        success: false,
        message: "No data found",
      };
    }

    if (type === "responseData") {
      const values = [];
      Object.keys(data.response).forEach((field) => {
        values.push(data.response[field]);
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
    } else if (type === "formUpdate") {
      const values = [];
      data.form.fields.forEach((field) => {
        values.push(field.label);
      });
      const { spreadsheetId, tokens } = formData.meta;
      let res = await clearRangeValues({
        access_token: tokens.access_token,
        spreadsheetId,
        range: "A1:A1",
      });
      res =
        res.success &&
        (await appendValues({
          access_token: tokens.access_token,
          spreadsheetId,
          values: [values],
          range: "A1:A1",
        }));
      if (!res.success) {
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
