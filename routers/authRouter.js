const { admin } = require("../firebase");
const express = require("express");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    // Return the user record (be careful not to return sensitive info)
    res.status(201).send({ uid: userRecord.uid });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/verifyToken", async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.status(200).send({ uid: decodedToken.uid, verified: true });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

router.get("/protected", async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }
  const idToken = authorization.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    // proceed with the endpoint functionality
    res.status(200).send({ message: "This is protected content." });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

module.exports = router;
