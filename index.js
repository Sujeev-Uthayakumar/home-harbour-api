const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
const PORT = process.env.PORT || 3000;

const authRouter = require("./routers/authRouter");

app.use("/api/auth", authRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
