const express = require("express");
const firebase = require("./firebase");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const authRouter = require("./routers/authRouter");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
