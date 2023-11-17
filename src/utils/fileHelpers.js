const { admin, bucket } = require("../firebase");

function checkFileExists(fileName) {
  const file = bucket.file(fileName);

  return file
    .exists()
    .then((data) => {
      const exists = data[0];
      return exists;
    })
    .catch((error) => {
      console.error("Error checking file existence:", error);
      throw error; // or handle the error as needed
    });
}

module.exports = {
  checkFileExists,
};
