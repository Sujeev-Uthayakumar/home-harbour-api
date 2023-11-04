const express = require("express");
const firebase = require("./firebase");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const authRouter = require("./routers/authRouter");
const homeRouter = require("./routers/homeRouter");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/api/homes", homeRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
