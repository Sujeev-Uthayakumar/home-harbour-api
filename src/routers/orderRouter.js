const express = require("express");
const { db } = require("../firebase");

const router = express.Router();
const ORDERS_COLLECTION = "orders";

router.get("/findAll", async (req, res) => {});

module.exports = router;
