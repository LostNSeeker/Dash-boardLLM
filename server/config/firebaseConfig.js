const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

const serviceAccount = require("./firebaseServiceAccountKey.json"); // Download from Firebase Console

initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();
module.exports = db;
