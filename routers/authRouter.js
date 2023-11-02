const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} = require("firebase/auth");
const express = require("express");

const router = express.Router();

router.post("/login", (req, res) => {
  const auth = getAuth();
  const { email, password } = req.body;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // Get the token
      return user.getIdToken();
    })
    .then((token) => {
      res.json({ status: "success", token: token });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(401).json({ status: "error", errorCode, errorMessage });
    });
});

router.post("/signup", (req, res) => {
  const auth = getAuth();
  const { email, password } = req.body;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential);
      // User created & signed in
      const user = userCredential.user;
      // You can also send a verification email here if needed
      return user.getIdToken();
    })
    .then((token) => {
      res.status(201).json({ status: "success", token: token });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(400).json({ status: "error", errorCode, errorMessage });
    });
});

router.post("/logout", (req, res) => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      res.json({ status: "success", message: "User logged out successfully" });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(500).json({ status: "error", errorCode, errorMessage });
    });
});

module.exports = router;
