require("dotenv").config();
const express = require("express");
const app = express();
const auth = require("./routes/auth");
const callback = require("./routes/callback");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db/connection");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req, res) => {
  res.send("welcome to google sheet plugin for formConnect!");
});

app.use("/v1/auth", auth);
app.use("/v1/callback", callback);

app.listen(8080, async () => {
  console.log("app listening on port 8080!");
  await connectDB();
});
