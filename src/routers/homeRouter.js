const express = require("express");
const { db, bucket } = require("../firebase");
const multer = require("multer");

const Home = require("../models/Home");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const HOME_COLLECTION = "homes";

router.get("/findAll", async (req, res) => {
  db.collection(HOME_COLLECTION)
    .get()
    .then((snapshot) => {
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      res.send(documents);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

router.get("/find/:id", async (req, res) => {
  const { id } = req.params;
  const documentRef = db.collection(HOME_COLLECTION).doc(id);

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

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const documentRef = db.collection(HOME_COLLECTION).doc(id);
  // TODO: Check if the user owns that specific document

  try {
    await documentRef.update(updateData);
    res.status(200).send(`Document with ID: ${id} has been updated.`);
  } catch (error) {
    console.error("Error updating document: ", error);
    res.status(500).send(error.message);
  }
});

router.post("/create", async (req, res) => {
  let newData = req.body;
  const documentsCollection = db.collection(HOME_COLLECTION);
  console.log("created with data: ", newData);
  try {
    const docRef = await documentsCollection.add(newData);
    res.status(201).send(docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(500).send(error.message);
  }
});

router.post("/upload/:id", upload.array("images", 10), async (req, res) => {
  const { id } = req.params;
  console.log("id: ", id);
  const documentRef = db.collection(HOME_COLLECTION).doc(id);
  if (!req.files) {
    return res.status(400).send("No files uploaded.");
  }

  const uploadPromises = req.files.map((file) => {
    const blob = bucket.file(file.originalname);
    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobWriter.on("error", (err) => reject(err));
      blobWriter.on("finish", () => {
        blob
          .makePublic()
          .then(() => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
          })
          .catch((err) => reject(err));
      });
      blobWriter.end(file.buffer);
    });
  });

  try {
    const urls = await Promise.all(uploadPromises);
    // URLs of all uploaded files
    console.log(urls);
    await documentRef.update({ images: urls });
    res.status(200).send({ urls });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading files");
  }
});

module.exports = router;
