const express = require("express");
const firebase = require("./src/firebase");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const authRouter = require("./src/routers/authRouter");
const homeRouter = require("./src/routers/homeRouter");
const favouriteRouter = require("./src/routers/favouriteRouter");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/api/homes", homeRouter);
app.use("/api/favourites", favouriteRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
