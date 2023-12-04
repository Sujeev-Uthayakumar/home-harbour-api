const express = require("express");
const { db } = require("../firebase");

const router = express.Router();
const ORDERS_COLLECTION = "orders";

router.get("/findAll", async (req, res) => {
  db.collection(ORDERS_COLLECTION)
    .get()
    .then((snapshot) => {
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      console.log(documents);
      res.send(documents);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

router.get("/findById/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const documentRef = await db
      .collection(ORDERS_COLLECTION)
      .where("userId", "==", id)
      .get();

    const doc = documentRef.docs.map((doc) => ({
      id: doc.homeId,
      ...doc.data(),
    }));
    console.log(doc);
    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

router.post("/create", async (req, res) => {
  let newData = req.body;

  try {
    const documentRef = await db.collection(ORDERS_COLLECTION).add(newData);
    const document = await documentRef.get();
    res.status(200).send({ id: document.id, ...document.data() });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
