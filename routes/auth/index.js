const { getOrganization } = require("../../oauth/formconnect");
const router = require("express").Router();
const create = require("../../db/auth/create");
const { generateAuthUrl } = require("../../oauth/google");

router.post("/", async (req, res) => {
  try {
    const { email, orgId, formId } = req.body;
    if (!email || !orgId || !formId) {
      return res.status(400).json({
        success: false,
        message: "Missing email or orgId or formId",
      });
    }

    // find user by email and orgId
    const response = await getOrganization({ email, orgId });

    if (!response.success) {
      return res.status(400).json({
        success: false,
        message: response.message,
      });
    }

    const url = generateAuthUrl(JSON.stringify({ orgId, formId, user: email }));
    return res.status(200).json({
      success: true,
      redirect: true,
      url,
      message: "integration started.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
