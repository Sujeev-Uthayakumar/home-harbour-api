const express = require("express");
const { db } = require("../firebase");

const router = express.Router();
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

router.post("/save", async (req, res) => {
  const newData = req.body;
  const documentsCollection = db.collection(HOME_COLLECTION);

  try {
    const docRef = await documentsCollection.add(newData);
    res.status(201).send(`Document created with ID: ${docRef.id}`);
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
