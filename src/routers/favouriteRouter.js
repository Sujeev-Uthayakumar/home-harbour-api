const express = require("express");
const { db } = require("../firebase");

const router = express.Router();
const FAVOURITES_COLLECTION = "favourites";
const HOME_COLLECTION = "homes";

router.get("/findAll", async (req, res) => {
  db.collection(FAVOURITES_COLLECTION)
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

router.get("/findHome/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const documentRef = await db
      .collection(FAVOURITES_COLLECTION)
      .doc(id)
      .get();

    console.log("doc", documentRef.data());
    const { homeId } = documentRef.data();
    const homeDocumentRef = await db
      .collection(HOME_COLLECTION)
      .doc(homeId)
      .get();

    if (documentRef.exists) {
      console.log("doc", homeDocumentRef.data());
      res.json({ id: homeId, ...homeDocumentRef.data() });
    } else {
      res.status(404).send("Document not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

router.get("/findById/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const documentRef = await db
      .collection(FAVOURITES_COLLECTION)
      .where("userId", "==", id)
      .get();

    const doc = documentRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("doc", doc);
    if (doc) {
      res.json(doc);
    } else {
      res.status(404).send("Document not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const documentRef = db.collection(FAVOURITES_COLLECTION).doc(id);
  // TODO: Check if the user owns that specific document

  try {
    await documentRef.update(updateData);
    res.status(200).send(`Document with ID: ${id} has been updated.`);
  } catch (error) {
    console.error("Error updating document: ", error);
    res.status(500).send(error.message);
  }
});

router.post("/add/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;
  const documentsCollection = db.collection(FAVOURITES_COLLECTION);
  const newData = {
    userId: userId,
    homeId: id,
  };
  try {
    const docRef = await documentsCollection.add(newData);
    res.status(201).send({ id: docRef.id, ...newData });
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(500).send(error.message);
  }
});

router.delete("/remove/:id", async (req, res) => {
  const { id } = req.params;
  const documentsCollection = db.collection(FAVOURITES_COLLECTION);

  try {
    await documentsCollection.doc(id).delete();
    res.status(201).send({ id });
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
