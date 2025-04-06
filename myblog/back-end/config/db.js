const admin = require("firebase-admin");

const serviceAccount = require("./myblog-e225c-firebase-adminsdk-fbsvc-a35bba136b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
