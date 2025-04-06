const admin = require("firebase-admin");

const serviceAccount = require("./mystore-54146-firebase-adminsdk-fbsvc-cd156b1bb8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
