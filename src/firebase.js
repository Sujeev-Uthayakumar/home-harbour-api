const admin = require("firebase-admin");

const config = require("./config");

admin.initializeApp({
  credential: admin.credential.cert(config),
  storageBucket: "gs://home-harbour.appspot.com",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

console.log("Successfully connected to Firebase and Firestore");

module.exports = {
  db,
  admin,
  bucket,
};
