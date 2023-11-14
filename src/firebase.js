const admin = require("firebase-admin");

const config = require("./config");

admin.initializeApp({
  credential: admin.credential.cert(config),
});

const db = admin.firestore();

console.log("Successfully connected to Firebase and Firestore");

module.exports = {
  db,
  admin,
};
