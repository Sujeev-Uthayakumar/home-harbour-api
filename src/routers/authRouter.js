const { admin } = require("../firebase");
const { db } = require("../firebase");
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const USER_COLLECTION = "users";

router.post("/signup", async (req, res) => {
  const { fullName, email, password, dateOfBirth } = req.body;
  console.log(req.body);
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    const decodedToken = jwt.decode(customToken);
    const expirationTime = new Date(decodedToken.exp * 1000);
    console.log(`Token will expire at ${expirationTime}`);

    const documentCollection = db
      .collection(USER_COLLECTION)
      .doc(userRecord.uid);

    await documentCollection.set({
      email,
      password,
      fullName: fullName.toLowerCase(),
      dateOfBirth,
      signUpDate: new Date().toISOString(),
    });

    res.status(201).send({
      token: customToken,
      tokenExpires: expirationTime.toISOString(),
      userData: {
        uid: userRecord.uid,
        email,
        fullName,
        dateOfBirth,
        signUpDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.code });
  }
});

router.get("/find/:id", async (req, res) => {
  const { id } = req.params;
  const documentRef = db.collection(USER_COLLECTION).doc(id);

  try {
    const doc = await documentRef.get();
    console.log(doc);
    if (doc.exists) {
      res.json({ id: doc.id, ...doc.data() });
    } else {
      res.status(404).send("Document not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
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
