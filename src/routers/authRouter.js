const { admin, bucket } = require("../firebase");
const { db } = require("../firebase");
const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const { checkFileExists } = require("../utils/fileHelpers");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
      fullName: fullName.toLowerCase(),
      dateOfBirth,
      signUpDate: new Date().toISOString(),
      phoneNumber: "",
      address: "",
      profilePic:
        "https://firebasestorage.googleapis.com/v0/b/home-harbour.appspot.com/o/default-profile.png?alt=media",
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
        phoneNumber: "",
        address: "",
        profilePic:
          "https://firebasestorage.googleapis.com/v0/b/home-harbour.appspot.com/o/default-profile.png?alt=media",
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
    if (doc.exists) {
      console.log({ id: doc.id, ...doc.data() });
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

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const documentRef = db.collection(USER_COLLECTION).doc(id);

  try {
    await documentRef.update(updateData);
    const updatedSnapshot = await documentRef.get();

    // Check if the document exists and extract data
    if (!updatedSnapshot.exists) {
      return res.status(404).send("Document not found");
    }
    const updatedData = updatedSnapshot.data();
    console.log(updatedData);
    res.status(200).send({ id, ...updatedData });
  } catch (error) {
    console.log("Error updating document: ", error);
    res.status(500).send(error.message);
  }
});

router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  const fileName = req.file.originalname + `${new Date().getTime()}`;
  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  blobStream.on("error", (err) => {
    res.status(500).send(err);
  });

  blobStream.on("finish", async () => {
    // The public URL can be used to directly access the file via HTTP.
    const documentRef = db
      .collection(USER_COLLECTION)
      .doc(req.file.originalname);
    try {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media`;
      console.log(publicUrl);
      await documentRef.update({ profilePic: publicUrl });
      res.status(200).send({ profilePic: publicUrl });
    } catch (error) {
      console.log("Error updating document: ", error);
      res.status(500).send(error.message);
    }
  });

  blobStream.end(req.file.buffer);
});

module.exports = router;
