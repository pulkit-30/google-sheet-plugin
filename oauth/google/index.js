const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");

const {
  GOOGLE_APP_CLIENT_ID,
  GOOGLE_APP_CLIENT_SECRET,
  GOOGLE_APP_REDIRECT_URL,
} = process.env;

// generate a url that asks permissions for Google Calendar scopes
const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_APP_CLIENT_ID,
  GOOGLE_APP_CLIENT_SECRET,
  GOOGLE_APP_REDIRECT_URL
);

const generateAuthUrl = (state) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    ...(state ? { state } : {}),
  });
  return url;
};

const verifyCode = async ({ code }) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

const getAuth = (access_token) => {
  const newClient = new google.auth.OAuth2(
    GOOGLE_APP_CLIENT_ID,
    GOOGLE_APP_CLIENT_SECRET,
    GOOGLE_APP_REDIRECT_URL
  );
  newClient.setCredentials({ access_token });
  return newClient;
};

// google sheets

async function createSpreadSheet({ title, access_token }) {
  const auth = new GoogleAuth({
    authClient: getAuth(access_token),
    scopes,
  });

  const service = google.sheets({ version: "v4", auth });
  const resource = {
    properties: {
      title,
    },
  };
  try {
    const spreadsheet = await service.spreadsheets.create({
      resource,
      fields: "spreadsheetId",
    });

    return spreadsheet.data.spreadsheetId;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}

async function appendValues({
  access_token,
  spreadsheetId,
  values,
  range = "A1:Z15",
  valueInputOption = "RAW",
  ...args
}) {
  const auth = new GoogleAuth({
    authClient: getAuth(access_token),
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const service = google.sheets({ version: "v4", auth });

  const request = {
    spreadsheetId,
    range,
    valueInputOption,
    resource: {
      values,
    },
    ...args,
  };
  try {
    const response = await service.spreadsheets.values.append(request);
    if (response.status === 200) {
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  } catch (err) {
    return {
      success: false,
    };
  }
}

async function clearRangeValues({
  access_token,
  spreadsheetId,
  range = "A1:Z15",
  ...args
}) {
  const auth = new GoogleAuth({
    authClient: getAuth(access_token),
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const service = google.sheets({ version: "v4", auth });

  const request = {
    spreadsheetId,
    range,
    resource: {},
    ...args,
  };
  try {
    const response = await service.spreadsheets.values.clear(request);
    if (response.status === 200) {
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
    };
  }
}

module.exports = {
  generateAuthUrl,
  verifyCode,
  getAuth,
  createSpreadSheet,
  appendValues,
  clearRangeValues,
};
